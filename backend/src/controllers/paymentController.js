const stripe = require('../config/stripe');
const { db, admin } = require('../config/firebase');

const getUserRole = async (uid) => {
  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists) return 'customer';
  return userDoc.data().role || 'customer';
};

const canAccessOrder = async (reqUserUid, orderUserId) => {
  if (reqUserUid === orderUserId) return true;

  const role = await getUserRole(reqUserUid);
  return role === 'admin';
};

const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: 'orderId este obligatoriu'
      });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        message: 'Comanda nu există'
      });
    }

    const order = orderDoc.data();

    const hasAccess = await canAccessOrder(req.user.uid, order.userId);
    if (!hasAccess) {
      return res.status(403).json({
        message: 'Nu ai acces la această comandă'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'Comanda este deja plătită'
      });
    }

    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        message: 'Nu poți plăti o comandă anulată'
      });
    }

    if (!order.total || Number(order.total) <= 0) {
      return res.status(400).json({
        message: 'Totalul comenzii este invalid'
      });
    }

    // Refolosim PaymentIntent-ul existent dacă e încă valid
    if (order.stripePaymentIntentId) {
      try {
        const existingPaymentIntent = await stripe.paymentIntents.retrieve(
          order.stripePaymentIntentId
        );

        if (
          existingPaymentIntent &&
          existingPaymentIntent.status !== 'succeeded' &&
          existingPaymentIntent.status !== 'canceled'
        ) {
          return res.status(200).json({
            message: 'PaymentIntent existent reutilizat',
            clientSecret: existingPaymentIntent.client_secret,
            paymentIntentId: existingPaymentIntent.id
          });
        }
      } catch (stripeError) {
        // dacă nu mai există în Stripe, creăm unul nou
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total) * 100),
      currency: 'ron',
      metadata: {
        orderId,
        userId: order.userId,
        orderNumber: order.orderNumber || ''
      },
      // Stripe acceptă PaymentIntent cu amount/currency; automatic_payment_methods
      // este folosit în fluxurile moderne Payment Element. Poți să îl lași activ. 
      automatic_payment_methods: {
        enabled: true
      }
    });

    await orderRef.update({
      stripePaymentIntentId: paymentIntent.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      message: 'PaymentIntent creat cu succes',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la crearea PaymentIntent',
      error: error.message
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: 'orderId este obligatoriu'
      });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        message: 'Comanda nu există'
      });
    }

    const order = orderDoc.data();

    const hasAccess = await canAccessOrder(req.user.uid, order.userId);
    if (!hasAccess) {
      return res.status(403).json({
        message: 'Nu ai acces la această comandă'
      });
    }

    if (!order.stripePaymentIntentId) {
      return res.status(400).json({
        message: 'Comanda nu are PaymentIntent asociat'
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      await orderRef.update({
        paymentStatus: 'paid',
        orderStatus: order.orderStatus === 'pending' ? 'processing' : order.orderStatus,
        stripePaymentIntentStatus: paymentIntent.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        message: 'Plata a fost confirmată',
        paymentStatus: 'paid',
        stripeStatus: paymentIntent.status
      });
    }

    if (
      paymentIntent.status === 'processing' ||
      paymentIntent.status === 'requires_action' ||
      paymentIntent.status === 'requires_payment_method' ||
      paymentIntent.status === 'requires_confirmation'
    ) {
      await orderRef.update({
        stripePaymentIntentStatus: paymentIntent.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        message: 'Plata nu este încă finalizată',
        paymentStatus: order.paymentStatus || 'pending',
        stripeStatus: paymentIntent.status
      });
    }

    if (paymentIntent.status === 'canceled') {
      await orderRef.update({
        paymentStatus: 'failed',
        stripePaymentIntentStatus: paymentIntent.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(400).json({
        message: 'Plata a fost anulată',
        paymentStatus: 'failed',
        stripeStatus: paymentIntent.status
      });
    }

    await orderRef.update({
      stripePaymentIntentStatus: paymentIntent.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      message: 'Status plată actualizat',
      paymentStatus: order.paymentStatus || 'pending',
      stripeStatus: paymentIntent.status
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la confirmarea plății',
      error: error.message
    });
  }
};

// opțional: webhook pentru producție reală
const stripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).send('Webhook secret lipsă');
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (orderDoc.exists) {
          await orderRef.update({
            paymentStatus: 'paid',
            orderStatus: 'processing',
            stripePaymentIntentId: paymentIntent.id,
            stripePaymentIntentStatus: paymentIntent.status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (orderDoc.exists) {
          await orderRef.update({
            paymentStatus: 'failed',
            stripePaymentIntentId: paymentIntent.id,
            stripePaymentIntentStatus: paymentIntent.status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook
};
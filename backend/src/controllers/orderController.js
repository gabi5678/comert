const { db, admin } = require('../config/firebase');

const { generateInvoicePDF } = require('../services/invoiceService');

const path = require('path');
const fs = require('fs');

const SHIPPING_COST = 20;
const CURRENCY = 'RON';


const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        message: 'Adresa de livrare este obligatorie'
      });
    }

    const requiredFields = ['fullName', 'phone', 'city', 'street', 'postalCode'];

    for (const field of requiredFields) {
      if (!shippingAddress[field] || !String(shippingAddress[field]).trim()) {
        return res.status(400).json({
          message: `Câmpul ${field} este obligatoriu în adresa de livrare`
        });
      }
    }

    const result = await db.runTransaction(async (transaction) => {
      const cartRef = db.collection('carts').doc(userId);
      const cartDoc = await transaction.get(cartRef);

      if (!cartDoc.exists) {
        throw new Error('Coșul nu există');
      }

      const cart = cartDoc.data();
      const cartItems = cart.items || [];

      if (cartItems.length === 0) {
        throw new Error('Coșul este gol');
      }

      const validatedItems = [];
      let subtotal = 0;

      for (const item of cartItems) {
        const productRef = db.collection('products').doc(item.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists) {
          throw new Error(`Produsul cu ID ${item.productId} nu mai există`);
        }

        const product = productDoc.data();

        if (!product.isActive) {
          throw new Error(`Produsul ${product.name} nu mai este activ`);
        }

        if ((product.stock || 0) < item.quantity) {
          throw new Error(`Stoc insuficient pentru produsul ${product.name}`);
        }

        const currentPrice = Number(product.price);
        const itemTotal = currentPrice * item.quantity;
        subtotal += itemTotal;

        validatedItems.push({
          productId: productDoc.id,
          name: product.name,
          slug: product.slug,
          price: currentPrice,
          quantity: item.quantity,
          image: product.images?.[0] || ''
        });

        transaction.update(productRef, {
          stock: Number(product.stock) - Number(item.quantity),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      subtotal = Number(subtotal.toFixed(2));
      const total = Number((subtotal + SHIPPING_COST).toFixed(2));

      const orderRef = db.collection('orders').doc();
      const orderNumber = `CMD-${Date.now()}`;

      const orderData = {
        userId,
        orderNumber,
        items: validatedItems,
        subtotal,
        shippingCost: SHIPPING_COST,
        total,
        currency: CURRENCY,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          phone: shippingAddress.phone.trim(),
          city: shippingAddress.city.trim(),
          street: shippingAddress.street.trim(),
          postalCode: shippingAddress.postalCode.trim()
        },
        invoice: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      transaction.set(orderRef, orderData);

      transaction.set(cartRef, {
        userId,
        items: [],
        subtotal: 0,
        total: 0,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        orderId: orderRef.id,
        orderNumber,
        subtotal,
        shippingCost: SHIPPING_COST,
        total
      };
    });

    const orderRef = db.collection('orders').doc(result.orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        message: 'Comanda a fost creată, dar nu a mai putut fi găsită pentru generarea facturii'
      });
    }

    const createdOrderData = orderDoc.data();
    const invoice = await generateInvoicePDF(createdOrderData, result.orderId);
    const invoiceNumber = `INV-${Date.now()}`;

    await orderRef.update({
      invoice: {
        number: invoiceNumber,
        filePath: invoice.filePath,
        fileName: invoice.fileName,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Comanda a fost creată cu succes',
      ...result,
      invoice: {
        number: invoiceNumber,
        filePath: invoice.filePath,
        fileName: invoice.fileName
      }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Eroare la checkout',
      error: error.message
    });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection('orders')
      .where('userId', '==', userId)
      .get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea comenzilor',
      error: error.message
    });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const orderDoc = await db.collection('orders').doc(req.params.id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        message: 'Comanda nu există'
      });
    }

    const order = orderDoc.data();

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userRole = userDoc.exists ? userDoc.data().role : 'customer';

    if (order.userId !== req.user.uid && userRole !== 'admin') {
      return res.status(403).json({
        message: 'Nu ai acces la această factură'
      });
    }

    if (!order.invoice || !order.invoice.filePath) {
      return res.status(404).json({
        message: 'Factura nu există'
      });
    }

    const filePath = order.invoice.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: 'Fișierul nu există'
      });
    }

    res.download(path.resolve(filePath));
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la descărcarea facturii',
      error: error.message
    });
  }
};

const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user.uid;
    const orderDoc = await db.collection('orders').doc(req.params.id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        message: 'Comanda nu a fost găsită'
      });
    }

    const order = orderDoc.data();

    if (order.userId !== userId) {
      return res.status(403).json({
        message: 'Nu ai acces la această comandă'
      });
    }

    res.status(200).json({
      id: orderDoc.id,
      ...order
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea comenzii',
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const snapshot = await db.collection('orders').get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea tuturor comenzilor',
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const orderRef = db.collection('orders').doc(req.params.id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        message: 'Comanda nu a fost găsită'
      });
    }

    const allowedOrderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const allowedPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (orderStatus !== undefined) {
      if (!allowedOrderStatuses.includes(orderStatus)) {
        return res.status(400).json({
          message: 'orderStatus invalid'
        });
      }
      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          message: 'paymentStatus invalid'
        });
      }
      updateData.paymentStatus = paymentStatus;
    }

    await orderRef.update(updateData);

    res.status(200).json({
      message: 'Comanda a fost actualizată'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la actualizarea comenzii',
      error: error.message
    });
  }
};

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
  downloadInvoice
};
const { db, admin } = require('../config/firebase');

const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    total: Number(subtotal.toFixed(2))
  };
};

const getMyCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(200).json({
        userId,
        items: [],
        subtotal: 0,
        total: 0
      });
    }

    res.status(200).json({
      id: cartDoc.id,
      ...cartDoc.data()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la preluarea coșului',
      error: error.message
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: 'productId și quantity sunt obligatorii'
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        message: 'Cantitatea trebuie să fie un număr întreg pozitiv'
      });
    }

    const productRef = db.collection('products').doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        message: 'Produsul nu a fost găsit'
      });
    }

    const product = productDoc.data();

    if (!product.isActive) {
      return res.status(400).json({
        message: 'Produsul nu este activ'
      });
    }

    if ((product.stock || 0) <= 0) {
      return res.status(400).json({
        message: 'Produsul nu mai este în stoc'
      });
    }

    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    let items = [];

    if (cartDoc.exists) {
      items = cartDoc.data().items || [];
    }

    const existingIndex = items.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + qty;

      if (newQty > (product.stock || 0)) {
        return res.status(400).json({
          message: 'Cantitatea cerută depășește stocul disponibil'
        });
      }

      items[existingIndex].quantity = newQty;
      items[existingIndex].price = Number(product.price);
      items[existingIndex].stock = Number(product.stock || 0);
      items[existingIndex].image = product.images?.[0] || '';
      items[existingIndex].name = product.name;
      items[existingIndex].slug = product.slug;
    } else {
      if (qty > (product.stock || 0)) {
        return res.status(400).json({
          message: 'Cantitatea cerută depășește stocul disponibil'
        });
      }

      items.push({
        productId,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        quantity: qty,
        image: product.images?.[0] || '',
        stock: Number(product.stock || 0)
      });
    }

    const totals = calculateCartTotals(items);

    const cartData = {
      userId,
      items,
      subtotal: totals.subtotal,
      total: totals.total,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await cartRef.set(cartData);

    res.status(200).json({
      message: 'Produs adăugat în coș',
      cart: cartData
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la adăugarea în coș',
      error: error.message
    });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({
        message: 'Cantitatea trebuie să fie un număr întreg mai mare sau egal cu 0'
      });
    }

    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        message: 'Coșul nu există'
      });
    }

    let items = cartDoc.data().items || [];
    const itemIndex = items.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'Produsul nu există în coș'
      });
    }

    if (qty === 0) {
      items.splice(itemIndex, 1);
    } else {
      const productDoc = await db.collection('products').doc(productId).get();

      if (!productDoc.exists) {
        return res.status(404).json({
          message: 'Produsul asociat nu mai există'
        });
      }

      const product = productDoc.data();

      if (qty > (product.stock || 0)) {
        return res.status(400).json({
          message: 'Cantitatea cerută depășește stocul disponibil'
        });
      }

      items[itemIndex].quantity = qty;
      items[itemIndex].price = Number(product.price);
      items[itemIndex].stock = Number(product.stock || 0);
      items[itemIndex].image = product.images?.[0] || '';
      items[itemIndex].name = product.name;
      items[itemIndex].slug = product.slug;
    }

    const totals = calculateCartTotals(items);

    const cartData = {
      userId,
      items,
      subtotal: totals.subtotal,
      total: totals.total,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await cartRef.set(cartData);

    res.status(200).json({
      message: 'Cantitatea a fost actualizată',
      cart: cartData
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la actualizarea cantității',
      error: error.message
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;

    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({
        message: 'Coșul nu există'
      });
    }

    let items = cartDoc.data().items || [];
    items = items.filter(item => item.productId !== productId);

    const totals = calculateCartTotals(items);

    const cartData = {
      userId,
      items,
      subtotal: totals.subtotal,
      total: totals.total,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await cartRef.set(cartData);

    res.status(200).json({
      message: 'Produs eliminat din coș',
      cart: cartData
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la eliminarea produsului din coș',
      error: error.message
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cartRef = db.collection('carts').doc(userId);

    await cartRef.set({
      userId,
      items: [],
      subtotal: 0,
      total: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({
      message: 'Coșul a fost golit'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Eroare la golirea coșului',
      error: error.message
    });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
};
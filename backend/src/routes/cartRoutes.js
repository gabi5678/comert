const express = require('express');
const router = express.Router();

const {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getMyCart);
router.post('/add', authMiddleware, addToCart);
router.put('/item/:productId', authMiddleware, updateCartItemQuantity);
router.delete('/item/:productId', authMiddleware, removeCartItem);
router.delete('/clear', authMiddleware, clearCart);

module.exports = router;
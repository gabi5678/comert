const express = require('express');
const router = express.Router();

const {
  createOrderFromCart,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
  downloadInvoice
} = require('../controllers/orderController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/checkout', authMiddleware, createOrderFromCart);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/my-orders/:id', authMiddleware, getMyOrderById);
router.get('/:id/invoice', authMiddleware, downloadInvoice);

router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
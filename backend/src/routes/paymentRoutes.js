const express = require('express');
const router = express.Router();

const {
  createPaymentIntent,
  confirmPayment
} = require('../controllers/paymentController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-payment-intent/:orderId', authMiddleware, createPaymentIntent);
router.post('/confirm/:orderId', authMiddleware, confirmPayment);

module.exports = router;
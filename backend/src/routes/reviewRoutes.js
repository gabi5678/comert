const express = require('express');
const router = express.Router();

const {
  getReviewsByProduct,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/product/:productId', getReviewsByProduct);
router.post('/product/:productId', authMiddleware, createReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getProductStock,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/featured/all', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id/stock', getProductStock);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
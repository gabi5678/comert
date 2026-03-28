const express = require('express');
const router = express.Router();

const {
  createUserProfile,
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserRole
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/profile', authMiddleware, createUserProfile);

router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);

router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.put('/users/:uid/role', authMiddleware, adminMiddleware, updateUserRole);

module.exports = router;
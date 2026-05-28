const express = require('express');
const { register, login, getMe, updateProfile, changePassword, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin routes
router.get('/admin/users', protect, authorize('admin'), getAllUsers);

module.exports = router;

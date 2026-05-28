const express = require('express');
const {
  createInvestment,
  confirmInvestment,
  getMyInvestments,
  getInvestment,
  getAllInvestments,
  cancelInvestment,
} = require('../controllers/investmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllInvestments);

// Protected routes
router.post('/', protect, createInvestment);
router.get('/', protect, getMyInvestments);
router.get('/:id', protect, getInvestment);
router.put('/:id/confirm', protect, confirmInvestment);
router.put('/:id/cancel', protect, cancelInvestment);

module.exports = router;

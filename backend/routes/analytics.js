const express = require('express');
const { recordEvent, getSalesAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/events', recordEvent);
router.get('/sales', protect, authorize('admin', 'sale', 'auditor'), getSalesAnalytics);

module.exports = router;

const express = require('express');
const { getPublicSettings, getAdminSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/public', getPublicSettings);
router.get('/admin', protect, authorize('admin', 'sale'), getAdminSettings);
router.put('/admin', protect, authorize('admin'), updateSettings);

module.exports = router;

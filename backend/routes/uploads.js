const express = require('express');
const { uploadPublicFile, uploadAdminFile } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/public', uploadPublicFile);
router.post('/admin', protect, authorize('admin', 'sale', 'farm', 'farmer', 'auditor'), uploadAdminFile);

module.exports = router;

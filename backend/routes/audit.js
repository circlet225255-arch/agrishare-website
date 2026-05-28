const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/logs', protect, authorize('admin', 'auditor'), getAuditLogs);

module.exports = router;

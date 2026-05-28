const express = require('express');
const {
  createInvestmentOrder,
  getOrderByCode,
  getAllOrders,
  updateOrder,
  getCustomers,
  updateCustomer,
  submitPaymentProof,
  getOrderReceipt,
} = require('../controllers/checkoutController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/investment-orders', createInvestmentOrder);
router.post('/orders/:orderCode/payment-proof', submitPaymentProof);
router.get('/orders/:orderCode', getOrderByCode);
router.get('/orders/:orderCode/receipt', getOrderReceipt);
router.get('/admin/orders', protect, authorize('admin', 'sale', 'auditor'), getAllOrders);
router.patch('/admin/orders/:id', protect, authorize('admin', 'sale'), updateOrder);
router.get('/admin/customers', protect, authorize('admin', 'sale'), getCustomers);
router.patch('/admin/customers/:id', protect, authorize('admin', 'sale'), updateCustomer);

module.exports = router;

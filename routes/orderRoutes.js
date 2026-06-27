const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post(
  '/create',
  requireAuth,
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('name').notEmpty().withMessage('Customer name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('phone')
      .matches(/^[0-9]{10,11}$/)
      .withMessage('Phone number must be 10-11 digits'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  orderController.createOrder
);

router.get('/my-orders', requireAuth, orderController.getMyOrders);
router.get('/', requireAuth, requireRole('admin'), orderController.getAllOrders);
router.put('/:id/status', requireAuth, requireRole('admin'), orderController.updateOrderStatus);

module.exports = router;

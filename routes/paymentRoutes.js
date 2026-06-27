const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');

router.post(
  '/jazzcash',
  requireAuth,
  [
    body('amount').isNumeric().withMessage('Amount is required'),
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
  ],
  paymentController.createJazzCashPayment
);

module.exports = router;

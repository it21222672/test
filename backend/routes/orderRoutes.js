import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import  { check, validationResult } from 'express-validator';

router.route('/').post([
  check('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order items must be an array with at least one item'),
  check('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  check('paymentMethod').notEmpty().withMessage('Payment method is required'),
],addOrderItems).get(getOrders);
router.route('/mine').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/pay').put([
  check('id').notEmpty().withMessage('Transaction ID is required'),
  check('status').notEmpty().withMessage('Payment status is required'),
  check('update_time').notEmpty().withMessage('Update time is required'),
  check('payer.email_address').isEmail().withMessage('Valid email address is required'),
],updateOrderToPaid);
router.route('/:id/deliver').put([
  check('id')
    .isMongoId()
    .withMessage('Invalid order ID format'),
],updateOrderToDelivered);

export default router;

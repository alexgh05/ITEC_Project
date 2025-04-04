import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered
} from '../controllers/orderController.js';

const router = express.Router();

// Routes
// These routes would normally require authentication middleware
// For simplicity, we're not implementing that here
router.route('/').post(createOrder);
router.route('/myorders').get(getUserOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/deliver').put(updateOrderToDelivered);

export default router; 
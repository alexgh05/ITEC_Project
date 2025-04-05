import express from 'express';
import { subscribeToStockNotification } from '../controllers/stockNotificationController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/', optionalAuth, subscribeToStockNotification);

export default router; 
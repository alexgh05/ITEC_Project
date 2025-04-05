import express from 'express';
import { getAdminStats, uploadProductImage, getAdminUsers, getStoreSettings, updateStoreSettings } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAdminUsers);
router.post('/upload', protect, admin, uploadProductImage);
router.get('/settings', protect, admin, getStoreSettings);
router.put('/settings', protect, admin, updateStoreSettings);

export default router; 
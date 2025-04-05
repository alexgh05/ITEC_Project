import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadErrorHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// Routes
router
  .route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// Upload product images route
router
  .route('/upload')
  .post(
    protect, 
    admin, 
    upload.array('images', 5), 
    uploadErrorHandler, 
    uploadProductImages
  );

router
  .route('/:id')
  .get(getProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router; 
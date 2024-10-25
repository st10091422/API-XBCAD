// routes/productRoutes.js
const express = require('express');
const ProductController = require('../controllers/productController');
const { adminAuth } = require('../middleware/auth'); // Admin authentication middleware
const multer = require('multer'); // For file uploads

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.memoryStorage(); // Storing files in memory temporarily
const upload = multer({ storage: storage });

// Admin routes
router.post('/admin/products', adminAuth, upload.single('image'), ProductController.createProduct); // Create product
router.put('/admin/products/:productId', adminAuth, upload.single('image'), ProductController.updateProduct); // Update product
router.delete('/admin/products/:productId', adminAuth, ProductController.deleteProduct); // Delete product

// Public routes
router.get('/products', ProductController.getAllProducts); // Get all products
router.get('/products/:productId', ProductController.getProductById); // Get product by ID

module.exports = router;

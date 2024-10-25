// routes/orderRoutes.js
const express = require('express');
const OrderController = require('../controllers/orderController');
const { userAuth, adminAuth } = require('../middleware/auth'); // Authentication middleware

const router = express.Router();

// User routes
router.post('/orders', userAuth, OrderController.placeOrder); // Place order
router.get('/orders', userAuth, OrderController.getUserOrders); // Get user orders
router.get('/orders/:orderId', userAuth, OrderController.getOrderById); // Get order by ID

// Admin route
router.get('/get-all-orders', adminAuth, OrderController.getOrders)
router.put('/admin/orders/:orderId', adminAuth, OrderController.updateOrderStatus); // Update order status (Admin)

module.exports = router;

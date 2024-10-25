// routes/cartRoutes.js
const express = require('express');
const CartController = require('../controllers/cartController');
const { userAuth } = require('../middleware/auth'); // User authentication middleware

const router = express.Router();

// Cart routes
router.post('/cart', userAuth, CartController.addToCart); // Add product to cart
router.get('/cart', userAuth, CartController.getCart); // Get user's cart
router.put('/cart', userAuth, CartController.updateCartQuantity); // Update quantity in cart
router.delete('/cart', userAuth, CartController.removeFromCart); // Remove product from cart

module.exports = router;

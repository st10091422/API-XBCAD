// controllers/orderController.js
const OrderModel = require('../models/order');

const OrderController = {
  // Place an order
  async placeOrder(req, res) {
    try {
      const userId = req.user.uid;
      const orderData = req.body;
      const newOrder = await OrderModel.placeOrder(userId, orderData);
      return res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Get user's orders
  async getUserOrders(req, res) {
    try {
      const userId = req.user.uid;
      const orders = await OrderModel.getUserOrders(userId);

      console.log(JSON.stringify(orders))
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getOrders(req, res) {
    try {
      const orders = await OrderModel.getOrders();

      console.log(JSON.stringify(orders))
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },


  // Get order by ID
  async getOrderById(req, res) {
    try {
      const orderId = req.params.orderId;
      const order = await OrderModel.getOrder(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Update order status (Admin only)
  async updateOrderStatus(req, res) {
    try {
      const orderId = req.params.orderId;
      const { status } = req.body;
      const updatedOrder = await OrderModel.updateOrderStatus(orderId, status);
      return res.status(200).json({ message: 'Order status updated', order: updatedOrder });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = OrderController;

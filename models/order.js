// models/order.js
const { Order } = require('../config/firebase');

const OrderModel = {
  // Place an order
  async placeOrder(userId, orderData) {
    const newOrderRef = Order.doc();
    const newOrder = {
      ...orderData,
      userId,
      status: 'Pending', // default status
      address: orderData.address,  // Include address in the order
      createdAt: Date.now(),
    };
    await newOrderRef.set(newOrder);
    return newOrder;
  },

  // Get user's orders
  async getUserOrders(userId) {
    const snapshot = await Order.where('userId', '==', userId).get();
    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => doc.data());
  },

  async getOrders() {
    const snapshot = await Order.get();
    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => {
      const orderData = doc.data();
      return {
          ...orderData, // Spread the existing order data
          id: doc.id    // Add the document ID as the 'id' field
      };
  });
  },


  // Get specific order
  async getOrder(orderId) {
    const orderSnapshot = await Order.doc(orderId).get();
    if (!orderSnapshot.exists) return null;

    return orderSnapshot.data();
  },

  // Update order status (Admin only)
  async updateOrderStatus(orderId, status) {
    const orderRef = Order.doc(orderId);
    await orderRef.update({ status });
    return { orderId, status };
  }
};

module.exports = OrderModel;

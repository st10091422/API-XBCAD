const { Cart, Product } = require('../config/firebase');



const CartModel = {

  async isProductAvailable(productId) {
    const productSnapshot = await Product.doc(productId).get();
    return productSnapshot.exists; // Returns true if the product exists, false otherwise
  },

  // Add product to cart
  async addToCart(userId, product) {
    const cartRef = Cart.doc(userId);
    const cartSnapshot = await cartRef.get();
    let cartData = cartSnapshot.exists ? cartSnapshot.data() : { products: [] };

    const productIndex = cartData.products.findIndex(p => p.productId === product.productId);
    if (productIndex > -1) {
      cartData.products[productIndex].quantity += product.quantity;
    } else {
      cartData.products.push(product);
    }

    await cartRef.set(cartData); 
    return cartData;
  },

  

  // Get user's cart and filter unavailable products
  async getCart(userId) {
    const cartSnapshot = await Cart.doc(userId).get();
    if (!cartSnapshot.exists) {
      return { products: [] }; // Return an empty array if no cart exists
    }
    
    const cartData = cartSnapshot.data();
    const filteredProducts = await Promise.all(cartData.products.map(async (product) => {
      const isAvailable = await this.isProductAvailable(product.productId);
      return isAvailable ? product : null; // Return the product or null if not available
    }));

    // Filter out null values (unavailable products)
    cartData.products = filteredProducts.filter(product => product !== null);
    await Cart.doc(userId).set(cartData); // Update the cart with available products

    return cartData; // Return the cart with filtered products
  },
  

  // Update product quantity
  async updateQuantity(userId, productId, quantity) {
    const cartRef = Cart.doc(userId);
    const cartSnapshot = await cartRef.get();
    if (!cartSnapshot.exists) return null;

    const cartData = cartSnapshot.data();
    const productIndex = cartData.products.findIndex(p => p.productId === productId);
    if (productIndex > -1) {
      cartData.products[productIndex].quantity = quantity;
      await cartRef.set(cartData);
      return cartData;
    }
    return null;
  },

  // Remove product from cart
  async removeProduct(userId, productId) {
    const cartRef = Cart.doc(userId);
    const cartSnapshot = await cartRef.get();
    if (!cartSnapshot.exists) return null;

    const cartData = cartSnapshot.data();
    cartData.products = cartData.products.filter(p => p.productId !== productId);
    await cartRef.set(cartData);
    return cartData;
  }
};

module.exports = CartModel;

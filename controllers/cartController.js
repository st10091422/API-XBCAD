const CartModel = require('../models/cart');
const ProductModel = require('../models/product')

const CartController = {
  // Add product to cart
  async addToCart(req, res) {
    try {
      const userId = req.user.uid; // Assuming you have middleware to get authenticated user
      console.log(`userId: ${userId}`)
      const { productId, quantity } = req.body;
      const product = { productId, quantity };
      const updatedCart = await CartModel.addToCart(userId, product);
      return res.status(200).json({ message: 'Product added to cart', cart: updatedCart });
    } catch (error) {
      console.error("Error during product creation: ", error);

      return res.status(500).json({ error: error.message });
    }
  },

  // Get user's cart
  async getCart(req, res) {
    try {
        const userId = req.user.uid;
        const cart = await CartModel.getCart(userId);

        // Fetch product details for each item in the cart
        const cartItems = await Promise.all(cart.products.map(async (item) => {
            const product = await ProductModel.getProductById(item.productId); // Assuming you have this method
            return {
                id: userId || '',  // or however you manage IDs in your cart
                productId: item.productId,
                quantity: item.quantity,
                userId: userId, // Assuming userId is consistent
                product: product // This will be the full product object
            };
        }));

        console.log(cartItems)

        return res.status(200).json( cartItems );
    } catch (error) {
        console.error("Error retrieving cart: ", error);
        return res.status(500).json({ error: error.message });
    }
},


  // Update product quantity in cart
  // async updateCartQuantity(req, res) {
  //   try {
  //     const userId = req.user.uid;
  //     const { productId, quantity } = req.body;
  //     const updatedCart = await CartModel.updateQuantity(userId, productId, quantity);
  //     if (!updatedCart) return res.status(404).json({ error: 'Product not found in cart' });
  //     console.log(`cart: ${JSON.stringify(updatedCart)}`)
  //     return res.status(200).json({ message: 'Cart updated successfully', updatedCart });
  //   } catch (error) {
  //     console.error("Error during product creation: ", error);

  //     return res.status(500).json({ error: error.message });
  //   }
  // },

  async updateCartQuantity(req, res) {
    try {
        const userId = req.user.uid;
        const { productId, quantity } = req.body;

        // Update the cart item quantity
        const updatedCart = await CartModel.updateQuantity(userId, productId, quantity);
        if (!updatedCart) return res.status(404).json({ error: 'Product not found in cart' });

        console.log(`Updated cart: ${JSON.stringify(updatedCart)}`);

        // Fetch all carts owned by the user
        const cart = await CartModel.getCart(userId);
        if (!cart) return res.status(404).json({ error: 'No carts found for user' });

        // Fetch product details for each item in the cart
        const cartItems = await Promise.all(cart.products.map(async (item) => {
          const product = await ProductModel.getProductById(item.productId); // Assuming you have this method
          return {
              id: userId || '',  // or however you manage IDs in your cart
              productId: item.productId,
              quantity: item.quantity,
              userId: userId, // Assuming userId is consistent
              product: product // This will be the full product object
          };
      }));
        return res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error during cart update: ", error);
        return res.status(500).json({ error: error.message });
    }
  },

  // Remove product from cart
  async removeFromCart(req, res) {
    try {
      const userId = req.user.uid;
      const { productId } = req.body;
      const updatedCart = await CartModel.removeProduct(userId, productId);
      if (!updatedCart) return res.status(404).json({ error: 'Product not found in cart' });
      return res.status(200).json({ message: 'Product removed from cart', updatedCart });
    } catch (error) {
      console.error("Error during product creation: ", error);

      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CartController;

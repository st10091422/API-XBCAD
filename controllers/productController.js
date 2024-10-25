const ProductModel = require('../models/product');

const ProductController = {
  // Create a new product (Admin only)
  async createProduct(req, res) {
    try {
      const productData = JSON.parse(req.body.product);
      console.log(`property data: ${JSON.stringify(productData)}`);
        
      const file = req.file; // Assuming you're using multer for file upload
      const newProduct = await ProductModel.createProduct(productData, file);
      return res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      console.error("Error during product creation: ", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Get all products
  async getAllProducts(req, res) {
    try {
      const products = await ProductModel.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error during getting products: ", error);
      
      return res.status(500).json({ error: error.message });
    }
  },

  // Get a single product by ID
  async getProductById(req, res) {
    try {
      const productId = req.params.productId;
      const product = await ProductModel.getProductById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Update product (Admin only)
  async updateProduct(req, res) {
    try {
      const productId = req.params.productId;
      const updatedData = JSON.parse(req.body.product);
      const file = req.file; // Optional file for image update
      const updatedProduct = await ProductModel.updateProduct(productId, updatedData, file);
      if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Delete a product (Admin only)
  async deleteProduct(req, res) {
    try {
      const productId = req.params.productId;
      const deletedProductId = await ProductModel.deleteProduct(productId);
      if (!deletedProductId) {
        console.log('Product not found')
        return res.status(404).json({ error: 'Product not found' });}
      console.log('Product deleted successfully')
      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Product not found', error)
        
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ProductController;

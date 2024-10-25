const { admin, Product } = require('../config/firebase');

const ProductModel = {
  // Add a new product
  async createProduct(productData, file) {
    const productRef = Product.doc();
    const fileName = `${productRef.id}-${file.originalname}`;
    const bucket = admin.storage().bucket();
    
    // Upload image to Firebase Storage
    const fileUpload = bucket.file(`products/${fileName}`);
    await fileUpload.save(file.buffer, { contentType: file.mimetype });
    const imageUrl = await fileUpload.getSignedUrl({ action: 'read', expires: '03-01-2500' });

    const newProduct = {
      ...productData,
      id: productRef.id,
      imageUrl: imageUrl[0], // Firebase storage returns an array of URLs
      createdAt: new Date(),
    };

    await productRef.set(newProduct);
    return newProduct;
  },

  // Get all products
  async getAllProducts() {
    const snapshot = await Product.get();
    
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(doc => doc.data());
  },

  // Get product by ID
  async getProductById(productId) {
    const productSnapshot = await Product.doc(productId).get();
    
    if (!productSnapshot.exists) return null;

    return productSnapshot.data();
  },

  // Update product
  async updateProduct(productId, updatedData, file = null) {
    const productRef = Product.doc(productId);
    const productSnapshot = await productRef.get();
    
    if (!productSnapshot.exists) return null;
    
    let productData = productSnapshot.data();

    if (file) {
      const fileName = `${productId}-${file.originalname}`;
      const bucket = admin.storage().bucket();
      const fileUpload = bucket.file(`products/${fileName}`);
      await fileUpload.save(file.buffer, { contentType: file.mimetype });
      const newImageUrl = await fileUpload.getSignedUrl({ action: 'read', expires: '03-01-2500' });
      updatedData.image = newImageUrl[0];
    }

    await productRef.update(updatedData);
    return { ...productData, ...updatedData };
  },

  // Delete product
  async deleteProduct(productId) {
    const productRef = Product.doc(productId);
    const productSnapshot = await productRef.get();
    
    if (!productSnapshot.exists) return null;

    const productData = productSnapshot.data();
    console.log(`productData: ${productData.id}`)
    // Delete image from Firebase Storage
    // const imageUrl = productData.imageUrl ;
    // const bucket = admin.storage().bucket();
    // const filePath = imageUrl.split('/').pop();
    // const imageRef = bucket.file(`products/${filePath}`);
    // await imageRef.delete();

    await productRef.delete();
    return productId;
  }
};

module.exports = ProductModel;

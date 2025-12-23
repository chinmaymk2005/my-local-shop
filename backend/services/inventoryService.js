const Product = require('../models/Product');

// Business logic for inventory management

exports.createOrUpdateProduct = async (shopId, productData) => {
  const { name, category, price, quantity } = productData;

  // Check if product already exists
  const existingProduct = await Product.findOne({
    shop: shopId,
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  });

  if (existingProduct) {
    // Update existing product
    existingProduct.price = price;
    existingProduct.quantity = quantity;
    existingProduct.category = category;
    await existingProduct.save();
    return { action: 'updated', product: existingProduct };
  } else {
    // Create new product
    const newProduct = await Product.create({
      shop: shopId,
      name,
      category,
      price,
      quantity,
    });
    return { action: 'created', product: newProduct };
  }
};

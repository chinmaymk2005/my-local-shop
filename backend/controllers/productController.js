const Product = require('../models/Product');
const Shop = require('../models/Shop');
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/env');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { search, shopId, category } = req.query;
    let query = { isAvailable: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (shopId) {
      query.shop = shopId;
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).populate('shop', 'shopName address');

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Shop Owner)
exports.createProduct = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Please register your shop first',
      });
    }

    const product = await Product.create({
      ...req.body,
      shop: shop._id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Shop Owner)
exports.updateProduct = async (req, res, next) => {
  try {

    // extract token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id;

    // find product
    const product = await Product.findById(req.params.id).populate('shop');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // authorization check
    if (product.shop.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product',
      });
    }

    // ✅ delete happens ONLY here
    const updatedProd = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });    

    return res.json({
      success: true,
      message: 'Product Updated successfully',
      updatedProd
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Shop Owner)
exports.deleteProduct = async (req, res, next) => {
  try {

    // extract token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id;

    // find product
    const product = await Product.findById(req.params.id).populate('shop');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // authorization check
    if (product.shop.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product',
      });
    }

    // ✅ delete happens ONLY here
    await Product.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Product deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};

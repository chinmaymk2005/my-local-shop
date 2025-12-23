const Shop = require('../models/Shop');

// @desc    Register shop
// @route   POST /api/shops
// @access  Private (Shop Owner)
exports.registerShop = async (req, res, next) => {
  try {
    const { shopName, address, mobile } = req.body;

    // Check if shop already exists for this user
    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'Shop already registered for this account',
      });
    }

    const shop = await Shop.create({
      owner: req.user.id,
      shopName,
      address,
      mobile,
    });

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my shop
// @route   GET /api/shops/my-shop
// @access  Private (Shop Owner)
exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shop
// @route   PUT /api/shops/my-shop
// @access  Private (Shop Owner)
exports.updateShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { owner: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    res.json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby shops
// @route   GET /api/shops/nearby
// @access  Public
exports.getNearbyShops = async (req, res, next) => {
  try {
    // TODO: Implement geolocation-based filtering
    const shops = await Shop.find({ isActive: true });

    res.json({
      success: true,
      count: shops.length,
      shops,
    });
  } catch (error) {
    next(error);
  }
};

//  /api/orders

const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders/:id
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  try {
    const { quantity, orderType, convenienceTime } = req.body;

    // Get product from params
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!product.isAvailable || product.quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Product not available in requested quantity' });
    }

    // Calculate deadline based on convenience time
    const deadlineMinutes = {
      '20mins': 12,
      '40mins': 15,
      '1-2hours': 22,
      'anytime_today': 30
    };

    const waitTime = deadlineMinutes[convenienceTime] || 30;
    const confirmationDeadline = new Date(Date.now() + waitTime * 60 * 1000);

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      shop: product.shop,
      products: [{
        product: product._id,
        name: product.name,
        quantity,
        price: product.price
      }],
      totalAmount: product.price * quantity,
      orderType,
      convenienceTime,
      confirmationDeadline,
      status: 'incomplete'
    });

    // Decrease product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('shop', 'shopName mobile')
      .sort('-createdAt');

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shop orders
// @route   GET /api/orders/shop-orders
// @access  Private (Shop Owner)
exports.getShopOrders = async (req, res, next) => {
  try {
    // 1. extract token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token missing',
      });
    }

    // 2. decode token
    const decoded = jwt.verify(token, jwtSecret);
    const ownerId = decoded.id;

    // 3. fetch orders for this shop owner
    const orders = await Order.find({ owner: ownerId })
      .populate('product', 'name price')
      .populate('shop', 'name')
      .sort({ createdAt: -1 });

    // 4. return response
    res.status(200).json({
      success: true,
      count: orders.length,
      orders, 
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Confirm order
// @route   PUT /api/orders/:id/confirm
// @access  Private (Shop Owner)
exports.confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('shop');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order belongs to shop owner's shop
    if (order.shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to confirm this order' 
      });
    }
    
    if (order.status !== 'incomplete') {
      return res.status(400).json({
        success: false, 
        message: `Cannot confirm order with status: ${order.status}` 
      });
    }

    // Check if confirmation is within deadline
    const now = new Date();
    const isInTime = now <= order.confirmationDeadline;

    order.status = isInTime ? 'confirmed' : 'unconfirmed';
    order.isConfirmedInTime = isInTime;
    order.confirmedAt = now;

    await order.save();

    res.json({
      success: true,
      message: isInTime 
        ? 'Order confirmed successfully' 
        : 'Order confirmed but deadline passed - marked as unconfirmed',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete order
// @route   PUT /api/orders/:id/complete
// @access  Private (Shop Owner)
exports.completeOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('shop');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order belongs to shop owner's shop
    if (order.shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to complete this order' 
      });
    }

    // Only confirmed orders can be completed
    if (order.status !== 'confirmed') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot complete order with status: ${order.status}. Only confirmed orders can be completed.` 
      });
    }

    order.status = 'completed';
    order.completedAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: 'Order completed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

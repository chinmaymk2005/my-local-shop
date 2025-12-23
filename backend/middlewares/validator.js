// Validation middleware for request data
exports.validateRegistration = (req, res, next) => {
  const { name, mobile, password, role } = req.body;

  if (!name || !mobile || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 10-digit mobile number',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
    });
  }

  if (!['customer', 'shop_owner'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  next();
};

exports.validateShopRegistration = (req, res, next) => {
  const { shopName, address, mobile } = req.body;

  if (!shopName || !mobile) {
    return res.status(400).json({
      success: false,
      message: 'Please provide shop name and mobile number',
    });
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 10-digit mobile number',
    });
  }

  next();
};

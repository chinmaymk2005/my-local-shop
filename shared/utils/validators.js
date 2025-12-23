// Common validation utilities

exports.isValidMobile = (mobile) => {
  return /^[0-9]{10}$/.test(mobile);
};

exports.isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

exports.isValidPrice = (price) => {
  return typeof price === 'number' && price >= 0;
};

exports.isValidQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity >= 0;
};

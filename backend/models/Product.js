const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide product quantity'],
    min: 0,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt on save
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);

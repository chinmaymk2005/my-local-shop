const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderType: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true,
  },
  convenienceTime: {
    type: String,
    enum: ['20mins', '40mins', '1-2hours', 'anytime_today'],
    required: true,
  },
  status: {
    type: String,
    enum: ['incomplete', 'confirmed', 'completed', 'unconfirmed', 'cancelled'],
    default: 'incomplete',
  },
  confirmationDeadline: {
    type: Date,
    required: true,
  },
  isConfirmedInTime: {
    type: Boolean,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  confirmedAt: Date,
  completedAt: Date,
});

module.exports = mongoose.model('Order', orderSchema);

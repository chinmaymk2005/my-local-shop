const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shopName: {
    type: String,
    required: [true, 'Please provide shop name'],
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  mobile: {
    type: String,
    required: [true, 'Please provide shop mobile number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },  
});

module.exports = mongoose.model('Shop', shopSchema);

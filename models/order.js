const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
    required: true
  },
  requirements: {
    type: String,
    minlength: [10, 'Requirements must be at least 10 characters long'],
    maxlength: [2000, 'Requirements cannot exceed 2000 characters'],
    default: ''
  },
  note: {
    type: String,
    maxlength: [500, 'Note cannot exceed 500 characters'],
    default: ''
  },
  deliveryTime: {
    type: Number,
    min: [1, 'Delivery time must be at least 1 day'],
    max: [365, 'Delivery time cannot exceed 365 days'],
    default: 7
  },
  deliveryFile: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    min: [1, 'Price must be at least $1'],
    max: [10000, 'Price cannot exceed $10,000'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

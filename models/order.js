const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered', 'completed'],
    default: 'pending'
  },
  deliveryFile: String, // Cloudinary link (optional)
  instructions: String,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);

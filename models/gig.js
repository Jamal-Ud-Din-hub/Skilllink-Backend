const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  price: Number,
  deliveryTime: Number, // in days
  tags: [String],
  category: String,
  images: [String], // Cloudinary URLs
}, { timestamps: true });

module.exports = mongoose.model('Gig', GigSchema);

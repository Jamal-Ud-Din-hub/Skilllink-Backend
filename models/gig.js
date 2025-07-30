const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be at least $1'],
    max: [10000, 'Price cannot exceed $10,000']
  },
  deliveryTime: {
    type: Number,
    min: [1, 'Delivery time must be at least 1 day'],
    max: [365, 'Delivery time cannot exceed 365 days'],
    default: 7
  },
  revisions: {
    type: Number,
    min: [0, 'Revisions cannot be negative'],
    max: [10, 'Revisions cannot exceed 10'],
    default: 1
  },
  tags: [{
    type: String,
    minlength: [1, 'Tag must be at least 1 character'],
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'web-development', 'mobile-development', 'design', 'writing', 'marketing',
        'video-animation', 'music-audio', 'business', 'data', 'photography'
      ],
      message: 'Category must be one of the allowed values'
    }
  },
  images: [{ type: String }], // Cloudinary URLs
}, { timestamps: true });

module.exports = mongoose.model('Gig', GigSchema);

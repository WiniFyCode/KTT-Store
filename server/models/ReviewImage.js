const mongoose = require('mongoose');

const reviewImageSchema = new mongoose.Schema({
  reviewID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true
  },
  imageURL: {
    type: String,
    required: true
  }
}, { 
    versionKey: false,
    timestamps: true 
});

const ReviewImage = mongoose.model('ReviewImage', reviewImageSchema, 'review_images'); 

module.exports = ReviewImage;
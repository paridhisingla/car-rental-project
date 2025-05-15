const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Economy', 'Luxury', 'Sports', 'SUV', 'Sedan'],
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true
  },
  features: [String],
  image: {
    type: String,
    required: true
  },
  additionalImages: [String],
  specifications: {
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      default: 'Automatic'
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      default: 'Petrol'
    },
    seats: {
      type: Number,
      default: 5
    },
    mileage: {
      type: Number
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema); 

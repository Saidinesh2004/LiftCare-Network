const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add property name'],
    trim: true
  },
  propertyManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: [true, 'Please add property address']
  },
  city: {
    type: String,
    default: 'New York'
  },
  state: {
    type: String,
    default: 'NY'
  },
  postalCode: {
    type: String,
    default: '10001'
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
      default: 40.7128
    },
    lng: {
      type: Number,
      required: true,
      default: -74.0060
    }
  },
  buildingType: {
    type: String,
    enum: ['Commercial Office', 'Retail Mall', 'Hospital / Medical', 'Hotel / Hospitality', 'Residential Highrise', 'Industrial Facility'],
    default: 'Commercial Office'
  },
  totalFloors: {
    type: Number,
    required: [true, 'Please specify total floors'],
    default: 20
  },
  contactPhone: {
    type: String,
    default: '+1 (555) 234-5678'
  },
  contactEmail: {
    type: String,
    default: 'facility@property.com'
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);

const mongoose = require('mongoose');
const { isMongooseConnected } = require('../config/db');
const { createInMemoryModel } = require('../config/inMemoryStore');

const technicianSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: [true, 'Please add company / trade name']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    default: 3
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add valid license number']
  },
  licenseExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  },
  skills: {
    type: [String],
    default: ['Passenger Elevators', 'Routine Inspection']
  },
  certifications: {
    type: [String],
    default: ['Certified Elevator Technician (CET)']
  },
  serviceRadius: {
    type: Number,
    default: 25
  },
  location: {
    address: { type: String, default: 'New York, NY' },
    lat: { type: Number, required: true, default: 40.7128 },
    lng: { type: Number, required: true, default: -74.0060 }
  },
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 15
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED', 'RESUBMISSION_REQUESTED'],
    default: 'PENDING'
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  documents: {
    licenseDoc: { type: String, default: '' },
    certDoc: { type: String, default: '' },
    idDoc: { type: String, default: '' }
  }
}, { timestamps: true });

const MongooseTech = mongoose.models.Technician || mongoose.model('Technician', technicianSchema);
const InMemoryTech = createInMemoryModel('Technician');

const TechProxy = new Proxy(MongooseTech, {
  get(target, prop) {
    if (isMongooseConnected()) {
      return target[prop];
    }
    return InMemoryTech[prop] !== undefined ? InMemoryTech[prop] : target[prop];
  }
});

module.exports = TechProxy;

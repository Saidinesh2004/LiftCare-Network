const mongoose = require('mongoose');

const historyItemSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['Installation', 'Maintenance', 'Inspection', 'Repair', 'Parts Replacement', 'Emergency Service'],
    default: 'Maintenance'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  performedBy: {
    type: String,
    default: 'Certified Technician'
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceRequest'
  }
}, { _id: true });

const equipmentSchema = new mongoose.Schema({
  equipmentId: {
    type: String,
    required: [true, 'Please provide an equipment ID (e.g., ELEV-01)'],
    trim: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  type: {
    type: String,
    enum: ['Elevator', 'Escalator', 'Moving Walk'],
    required: true,
    default: 'Elevator'
  },
  subType: {
    type: String,
    default: 'Passenger Elevator'
  },
  manufacturer: {
    type: String,
    required: [true, 'Please add manufacturer (e.g. Otis, KONE, Schindler, TK Elevator)'],
    default: 'Otis'
  },
  model: {
    type: String,
    default: 'Gen2 High-Rise'
  },
  serialNumber: {
    type: String,
    required: [true, 'Please add serial number'],
    default: 'SN-998241A'
  },
  capacity: {
    type: String,
    default: '1600 kg / 21 Persons'
  },
  floorsServed: {
    type: String,
    default: '1-32'
  },
  installationDate: {
    type: Date,
    default: () => new Date('2018-05-15')
  },
  lastMaintenanceDate: {
    type: Date,
    default: () => new Date('2026-08-10')
  },
  nextMaintenanceDate: {
    type: Date,
    default: () => new Date('2026-11-10')
  },
  status: {
    type: String,
    enum: ['Operational', 'Maintenance Due', 'Under Maintenance', 'Breakdown', 'Out of Service'],
    default: 'Operational'
  },
  historyTimeline: [historyItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);

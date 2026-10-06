const mongoose = require('mongoose');

const serviceReportSchema = new mongoose.Schema({
  maintenanceRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceRequest',
    required: true,
    unique: true
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  inspectionDetails: {
    type: String,
    required: [true, 'Please provide inspection findings']
  },
  problemIdentified: {
    type: String,
    required: [true, 'Please specify problem identified']
  },
  workPerformed: {
    type: String,
    required: [true, 'Please specify work performed']
  },
  partsReplaced: {
    type: [String],
    default: []
  },
  recommendations: {
    type: String,
    default: 'Regular lubrication and routine inspection in 30 days.'
  },
  beforeImages: {
    type: [String],
    default: []
  },
  afterImages: {
    type: [String],
    default: []
  },
  technicianNotes: {
    type: String,
    default: ''
  },
  laborHours: {
    type: Number,
    default: 2.5
  },
  costEstimate: {
    type: Number,
    default: 450
  },
  status: {
    type: String,
    enum: ['PENDING_APPROVAL', 'APPROVED', 'REVISION_REQUESTED'],
    default: 'PENDING_APPROVAL'
  },
  managerFeedback: {
    type: String,
    default: ''
  },
  approvedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceReport', serviceReportSchema);

const mongoose = require('mongoose');

const timelineEntrySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: String,
    default: 'System'
  }
}, { _id: false });

const maintenanceRequestSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  propertyManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    default: null
  },
  requestType: {
    type: String,
    enum: [
      'Routine Maintenance',
      'Preventive Maintenance',
      'Breakdown',
      'Emergency',
      'Inspection',
      'Installation',
      'Replacement'
    ],
    required: true,
    default: 'Routine Maintenance'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  description: {
    type: String,
    required: [true, 'Please provide issue or maintenance description']
  },
  images: {
    type: [String],
    default: []
  },
  preferredDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: [
      'REQUESTED',
      'MATCHING',
      'ASSIGNED',
      'ACCEPTED',
      'ON_THE_WAY',
      'ARRIVED',
      'INSPECTION',
      'IN_PROGRESS',
      'COMPLETED',
      'APPROVED',
      'CLOSED'
    ],
    default: 'REQUESTED'
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  etaMinutes: {
    type: Number,
    default: null
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date,
    default: null
  },
  timeline: [timelineEntrySchema]
}, { timestamps: true });

// Pre-save to add initial timeline if new
maintenanceRequestSchema.pre('save', function (next) {
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    this.timeline = [{
      status: this.status,
      timestamp: new Date(),
      note: `Request initiated with priority ${this.priority}`,
      updatedBy: 'Property Manager'
    }];
  }
  next();
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

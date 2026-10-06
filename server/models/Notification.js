const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['EMERGENCY', 'JOB_ASSIGNED', 'STATUS_CHANGE', 'REPORT_SUBMITTED', 'VERIFICATION', 'SYSTEM'],
    default: 'SYSTEM'
  },
  link: {
    type: String,
    default: ''
  },
  metadata: {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceRequest' },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

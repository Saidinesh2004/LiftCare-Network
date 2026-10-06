const User = require('../models/User');
const Technician = require('../models/Technician');
const Property = require('../models/Property');
const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const ServiceReport = require('../models/ServiceReport');
const Notification = require('../models/Notification');
const socketHandler = require('../socket/socketHandler');

// @desc    Get Admin Analytics Overview
// @route   GET /api/admin/analytics
// @access  Private (ADMIN)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const propertyManagersCount = await User.countDocuments({ role: 'PROPERTY_MANAGER' });
    const techniciansCount = await User.countDocuments({ role: 'TECHNICIAN' });

    const verifiedTechnicians = await Technician.countDocuments({ verificationStatus: 'VERIFIED' });
    const pendingVerification = await Technician.countDocuments({ verificationStatus: 'PENDING' });
    const rejectedTechnicians = await Technician.countDocuments({ verificationStatus: 'REJECTED' });

    const totalProperties = await Property.countDocuments();
    const totalEquipment = await Equipment.countDocuments();
    const elevatorsCount = await Equipment.countDocuments({ type: 'Elevator' });
    const escalatorsCount = await Equipment.countDocuments({ type: 'Escalator' });
    const movingWalksCount = await Equipment.countDocuments({ type: 'Moving Walk' });

    const operationalEquipment = await Equipment.countDocuments({ status: 'Operational' });
    const maintenanceDueEquipment = await Equipment.countDocuments({ status: 'Maintenance Due' });
    const underMaintenanceEquipment = await Equipment.countDocuments({ status: 'Under Maintenance' });
    const breakdownEquipment = await Equipment.countDocuments({ status: 'Breakdown' });

    const totalRequests = await MaintenanceRequest.countDocuments();
    const activeJobs = await MaintenanceRequest.countDocuments({
      status: { $in: ['REQUESTED', 'MATCHING', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'INSPECTION', 'IN_PROGRESS'] }
    });
    const emergencyJobs = await MaintenanceRequest.countDocuments({ isEmergency: true });
    const completedJobs = await MaintenanceRequest.countDocuments({
      status: { $in: ['COMPLETED', 'APPROVED', 'CLOSED'] }
    });

    const totalReports = await ServiceReport.countDocuments();
    const pendingReports = await ServiceReport.countDocuments({ status: 'PENDING_APPROVAL' });

    // Request Types Breakdown
    const requestTypesAggregation = await MaintenanceRequest.aggregate([
      { $group: { _id: '$requestType', count: { $sum: 1 } } }
    ]);

    // Priority Breakdown
    const priorityAggregation = await MaintenanceRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Monthly Trends (simulate or compute from createdAt)
    const monthlyTrends = [
      { month: 'May', requests: 14, emergencies: 2, completed: 12 },
      { month: 'Jun', requests: 22, emergencies: 4, completed: 19 },
      { month: 'Jul', requests: 18, emergencies: 3, completed: 16 },
      { month: 'Aug', requests: 28, emergencies: 5, completed: 25 },
      { month: 'Sep', requests: 31, emergencies: 6, completed: 28 },
      { month: 'Oct', requests: 26, emergencies: 4, completed: 22 }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        propertyManagersCount,
        techniciansCount,
        verifiedTechnicians,
        pendingVerification,
        rejectedTechnicians,
        totalProperties,
        totalEquipment,
        elevatorsCount,
        escalatorsCount,
        movingWalksCount,
        operationalEquipment,
        maintenanceDueEquipment,
        underMaintenanceEquipment,
        breakdownEquipment,
        totalRequests,
        activeJobs,
        emergencyJobs,
        completedJobs,
        totalReports,
        pendingReports
      },
      charts: {
        requestTypes: requestTypesAggregation.map(r => ({ name: r._id, value: r.count })),
        priorityBreakdown: priorityAggregation.map(p => ({ name: p._id, value: p.count })),
        equipmentStatus: [
          { name: 'Operational', count: operationalEquipment },
          { name: 'Maintenance Due', count: maintenanceDueEquipment },
          { name: 'Under Maintenance', count: underMaintenanceEquipment },
          { name: 'Breakdown / Offline', count: breakdownEquipment }
        ],
        monthlyTrends
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get technicians pending verification
// @route   GET /api/admin/verifications
// @access  Private (ADMIN)
exports.getPendingVerifications = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) {
      query.verificationStatus = status;
    } else {
      query.verificationStatus = { $in: ['PENDING', 'RESUBMISSION_REQUESTED'] };
    }

    const technicians = await Technician.find(query)
      .populate('user', 'name email phone avatar companyName')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: technicians.length, technicians });
  } catch (err) {
    next(err);
  }
};

// @desc    Review Technician Verification (Approve, Reject, Resubmit)
// @route   PUT /api/admin/verifications/:id
// @access  Private (ADMIN)
exports.reviewTechnician = async (req, res, next) => {
  try {
    const { status, verificationNotes } = req.body; // status: 'VERIFIED', 'REJECTED', 'RESUBMISSION_REQUESTED'
    const technician = await Technician.findById(req.params.id).populate('user');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    technician.verificationStatus = status;
    if (verificationNotes !== undefined) {
      technician.verificationNotes = verificationNotes;
    }
    await technician.save();

    // Send notification to technician
    if (technician.user) {
      const titles = {
        VERIFIED: '✅ Account Verification Approved!',
        REJECTED: '❌ Account Verification Rejected',
        RESUBMISSION_REQUESTED: '⚠️ Additional Documents Required for Verification'
      };

      const messages = {
        VERIFIED: 'Congratulations! Your license documents have been verified. You can now accept commercial service jobs.',
        REJECTED: `Your verification was rejected. Reason: ${verificationNotes || 'Invalid or unverified license credentials.'}`,
        RESUBMISSION_REQUESTED: `Please resubmit your documents. Note: ${verificationNotes || 'Document illegible or expired.'}`
      };

      await Notification.create({
        recipient: technician.user._id,
        title: titles[status] || 'Verification Status Updated',
        message: messages[status] || 'Your technician account verification status has been updated.',
        type: 'VERIFICATION',
        link: '/technician/profile'
      });

      socketHandler.emitToUser(technician.user._id.toString(), 'notification:new', {
        title: titles[status],
        message: messages[status]
      });
    }

    res.status(200).json({
      success: true,
      message: `Technician verification status updated to ${status}`,
      technician
    });
  } catch (err) {
    next(err);
  }
};

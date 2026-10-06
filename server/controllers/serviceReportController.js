const ServiceReport = require('../models/ServiceReport');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const Technician = require('../models/Technician');
const Notification = require('../models/Notification');
const socketHandler = require('../socket/socketHandler');

// @desc    Submit a service report
// @route   POST /api/service-reports
// @access  Private (TECHNICIAN)
exports.createServiceReport = async (req, res, next) => {
  try {
    const {
      maintenanceRequestId,
      inspectionDetails,
      problemIdentified,
      workPerformed,
      partsReplaced,
      recommendations,
      beforeImages,
      afterImages,
      technicianNotes,
      laborHours,
      costEstimate
    } = req.body;

    const request = await MaintenanceRequest.findById(maintenanceRequestId)
      .populate('property')
      .populate('equipment')
      .populate('propertyManager');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    const tech = await Technician.findOne({ user: req.user.id });
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    // Check if report already exists for this request
    const existingReport = await ServiceReport.findOne({ maintenanceRequest: maintenanceRequestId });
    if (existingReport) {
      return res.status(400).json({ success: false, message: 'A service report already exists for this request' });
    }

    let parsedParts = [];
    if (Array.isArray(partsReplaced)) {
      parsedParts = partsReplaced;
    } else if (typeof partsReplaced === 'string' && partsReplaced.trim()) {
      parsedParts = partsReplaced.split(',').map(p => p.trim());
    }

    const report = await ServiceReport.create({
      maintenanceRequest: request._id,
      technician: tech._id,
      equipment: request.equipment._id,
      property: request.property._id,
      inspectionDetails,
      problemIdentified,
      workPerformed,
      partsReplaced: parsedParts,
      recommendations: recommendations || 'Regular monthly maintenance check recommended.',
      beforeImages: beforeImages || [],
      afterImages: afterImages || [],
      technicianNotes: technicianNotes || '',
      laborHours: laborHours || 2.5,
      costEstimate: costEstimate || 350,
      status: 'PENDING_APPROVAL'
    });

    // Advance request status to COMPLETED
    request.status = 'COMPLETED';
    request.completedDate = new Date();
    request.timeline.push({
      status: 'COMPLETED',
      timestamp: new Date(),
      note: `Service report filed by ${tech.company}. Awaiting property manager review and approval.`,
      updatedBy: req.user.name
    });
    await request.save();

    // Notify Property Manager
    if (request.propertyManager) {
      await Notification.create({
        recipient: request.propertyManager._id,
        title: 'Service Report Ready for Approval',
        message: `${tech.company} submitted service report for ${request.equipment.equipmentId} at ${request.property.name}.`,
        type: 'REPORT_SUBMITTED',
        link: `/requests/${request._id}`,
        metadata: { requestId: request._id }
      });

      socketHandler.emitToUser(request.propertyManager._id.toString(), 'report:submitted', {
        requestId: request._id,
        reportId: report._id,
        equipment: request.equipment.equipmentId
      });
    }

    res.status(201).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get report by request ID
// @route   GET /api/service-reports/request/:requestId
// @access  Private
exports.getReportByRequestId = async (req, res, next) => {
  try {
    const report = await ServiceReport.findOne({ maintenanceRequest: req.params.requestId })
      .populate('technician')
      .populate('equipment')
      .populate('property');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Service report not found for this request' });
    }

    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single report by ID
// @route   GET /api/service-reports/:id
// @access  Private
exports.getReportById = async (req, res, next) => {
  try {
    const report = await ServiceReport.findById(req.params.id)
      .populate({
        path: 'technician',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate('equipment')
      .populate('property')
      .populate('maintenanceRequest');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Service report not found' });
    }

    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

// @desc    Review and Approve/Request Revision for Service Report
// @route   PUT /api/service-reports/:id/review
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.reviewReport = async (req, res, next) => {
  try {
    const { action, managerFeedback } = req.body; // action: 'APPROVE' or 'REVISION'
    const report = await ServiceReport.findById(req.params.id)
      .populate('maintenanceRequest')
      .populate('equipment')
      .populate('technician');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const request = await MaintenanceRequest.findById(report.maintenanceRequest._id);
    const equip = await Equipment.findById(report.equipment._id);
    const tech = await Technician.findById(report.technician._id).populate('user');

    if (action === 'APPROVE') {
      report.status = 'APPROVED';
      report.approvedAt = new Date();
      report.managerFeedback = managerFeedback || 'Report approved. Quality inspection passed.';
      await report.save();

      // Update maintenance request status to APPROVED
      if (request) {
        request.status = 'APPROVED';
        request.timeline.push({
          status: 'APPROVED',
          timestamp: new Date(),
          note: `Work & service report officially approved by Property Manager (${req.user.name}).`,
          updatedBy: req.user.name
        });
        await request.save();
      }

      // Update Equipment: status to Operational + push to timeline
      if (equip) {
        equip.status = 'Operational';
        equip.lastMaintenanceDate = new Date();
        equip.nextMaintenanceDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        equip.historyTimeline.push({
          date: new Date(),
          type: report.partsReplaced && report.partsReplaced.length > 0 ? 'Parts Replacement' : 'Maintenance',
          title: `Service Certified: ${request ? request.requestType : 'Maintenance'}`,
          description: `${report.workPerformed}. Parts: ${report.partsReplaced.join(', ') || 'None'}. Recommendations: ${report.recommendations}`,
          performedBy: tech ? tech.company : 'Licensed Technician',
          technician: tech ? tech._id : null,
          requestId: request ? request._id : null
        });
        await equip.save();
      }

      // Update technician completed stats
      if (tech) {
        tech.completedJobs = (tech.completedJobs || 0) + 1;
        tech.earnings = (tech.earnings || 0) + (report.costEstimate || 350);
        await tech.save();

        if (tech.user) {
          await Notification.create({
            recipient: tech.user._id,
            title: '🎉 Service Report Approved!',
            message: `Your service report for ${equip.equipmentId} has been approved. Earnings: $${report.costEstimate || 350}`,
            type: 'STATUS_CHANGE',
            link: '/technician/jobs'
          });

          socketHandler.emitToUser(tech.user._id.toString(), 'report:approved', {
            reportId: report._id,
            requestId: request ? request._id : null
          });
        }
      }
    } else {
      // Revision requested
      report.status = 'REVISION_REQUESTED';
      report.managerFeedback = managerFeedback || 'Please provide more details on work performed.';
      await report.save();

      if (tech && tech.user) {
        await Notification.create({
          recipient: tech.user._id,
          title: 'Service Report Revision Requested',
          message: `Feedback: "${report.managerFeedback}" for ${equip.equipmentId}`,
          type: 'STATUS_CHANGE',
          link: '/technician/jobs'
        });
      }
    }

    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reports (Admin / overview)
// @route   GET /api/service-reports
// @access  Private
exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await ServiceReport.find()
      .populate('technician')
      .populate('equipment', 'equipmentId type manufacturer model')
      .populate('property', 'name address')
      .populate('maintenanceRequest', 'requestType priority status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (err) {
    next(err);
  }
};

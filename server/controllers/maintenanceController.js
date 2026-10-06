const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const Property = require('../models/Property');
const Technician = require('../models/Technician');
const Notification = require('../models/Notification');
const socketHandler = require('../socket/socketHandler');

// Haversine helper
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// @desc    Get maintenance requests
// @route   GET /api/maintenance
// @access  Private
exports.getRequests = async (req, res, next) => {
  try {
    const { status, priority, isEmergency, propertyId, equipmentId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (isEmergency !== undefined) query.isEmergency = isEmergency === 'true';
    if (propertyId) query.property = propertyId;
    if (equipmentId) query.equipment = equipmentId;

    if (req.user.role === 'PROPERTY_MANAGER') {
      query.propertyManager = req.user.id;
    } else if (req.user.role === 'TECHNICIAN') {
      const tech = await Technician.findOne({ user: req.user.id });
      if (tech) {
        // Technician can see jobs assigned to them OR jobs in MATCHING / REQUESTED status that are available
        query.$or = [
          { assignedTechnician: tech._id },
          { status: { $in: ['MATCHING', 'REQUESTED'] }, isEmergency: true },
          { status: 'REQUESTED', assignedTechnician: null }
        ];
      }
    }

    const requests = await MaintenanceRequest.find(query)
      .populate('property', 'name address coordinates contactPhone')
      .populate('equipment', 'equipmentId type manufacturer model status')
      .populate('propertyManager', 'name email phone companyName')
      .populate({
        path: 'assignedTechnician',
        populate: { path: 'user', select: 'name phone email avatar' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
// @access  Private
exports.getRequestById = async (req, res, next) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('property', 'name address coordinates contactPhone buildingType totalFloors')
      .populate('equipment')
      .populate('propertyManager', 'name email phone companyName')
      .populate({
        path: 'assignedTechnician',
        populate: { path: 'user', select: 'name phone email avatar' }
      });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    res.status(200).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// @desc    Create standard maintenance request
// @route   POST /api/maintenance
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.createRequest = async (req, res, next) => {
  try {
    const { property, equipment, requestType, priority, description, images, preferredDate, assignedTechnician } = req.body;

    const prop = await Property.findById(property);
    const equip = await Equipment.findById(equipment);

    if (!prop || !equip) {
      return res.status(404).json({ success: false, message: 'Invalid property or equipment specified' });
    }

    const newRequest = await MaintenanceRequest.create({
      property,
      equipment,
      propertyManager: req.user.id,
      assignedTechnician: assignedTechnician || null,
      requestType: requestType || 'Routine Maintenance',
      priority: priority || 'MEDIUM',
      description,
      images: images || [],
      preferredDate: preferredDate || new Date(),
      status: assignedTechnician ? 'ASSIGNED' : 'REQUESTED',
      timeline: [
        {
          status: assignedTechnician ? 'ASSIGNED' : 'REQUESTED',
          timestamp: new Date(),
          note: `Maintenance request created by ${req.user.name}. Priority: ${priority || 'MEDIUM'}.`,
          updatedBy: req.user.name
        }
      ]
    });

    // Update equipment status if breakdown/urgent
    if (requestType === 'Breakdown' || priority === 'CRITICAL' || priority === 'HIGH') {
      equip.status = 'Under Maintenance';
      equip.historyTimeline.push({
        date: new Date(),
        type: 'Repair',
        title: `Service Request Logged: ${requestType}`,
        description,
        performedBy: req.user.name,
        requestId: newRequest._id
      });
      await equip.save();
    }

    // Real-time notification if technician pre-assigned
    if (assignedTechnician) {
      const tech = await Technician.findById(assignedTechnician).populate('user');
      if (tech && tech.user) {
        await Notification.create({
          recipient: tech.user._id,
          title: 'New Service Job Assigned',
          message: `You have been assigned to ${equip.equipmentId} at ${prop.name}`,
          type: 'JOB_ASSIGNED',
          link: `/technician/jobs`,
          metadata: { requestId: newRequest._id, equipmentId: equip._id }
        });

        socketHandler.emitToUser(tech.user._id.toString(), 'notification:new', {
          title: 'New Service Job Assigned',
          message: `You have been assigned to ${equip.equipmentId} at ${prop.name}`
        });
      }
    }

    // Broadcast to available technicians
    socketHandler.emitToRole('TECHNICIAN', 'request:created', {
      requestId: newRequest._id,
      property: prop.name,
      equipment: equip.equipmentId,
      type: requestType,
      priority
    });

    res.status(201).json({ success: true, request: newRequest });
  } catch (err) {
    next(err);
  }
};

// @desc    Emergency Request Workflow (Immediate matching & dispatch)
// @route   POST /api/maintenance/emergency
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.createEmergencyRequest = async (req, res, next) => {
  try {
    const { property, equipment, description, autoDispatch } = req.body;

    const prop = await Property.findById(property);
    const equip = await Equipment.findById(equipment);

    if (!prop || !equip) {
      return res.status(404).json({ success: false, message: 'Invalid property or equipment specified' });
    }

    // Update equipment status immediately to Breakdown
    equip.status = 'Breakdown';
    equip.historyTimeline.push({
      date: new Date(),
      type: 'Emergency Service',
      title: 'CRITICAL EMERGENCY REPORTED',
      description: description || 'Immediate technician emergency dispatched due to shutdown/entrapment.',
      performedBy: req.user.name
    });
    await equip.save();

    // Find verified, available technicians sorted by distance
    const propLat = prop.coordinates ? prop.coordinates.lat : 40.7128;
    const propLng = prop.coordinates ? prop.coordinates.lng : -74.0060;

    const availableTechs = await Technician.find({
      verificationStatus: 'VERIFIED',
      availability: true
    }).populate('user', 'name phone email avatar');

    const rankedTechs = availableTechs.map(t => {
      const dist = getDistance(propLat, propLng, t.location.lat, t.location.lng);
      return {
        technician: t,
        distanceKm: dist
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    let assignedTechId = null;
    let eta = 25; // default 25 min ETA
    let status = 'MATCHING';

    if (autoDispatch && rankedTechs.length > 0) {
      assignedTechId = rankedTechs[0].technician._id;
      status = 'ASSIGNED';
      eta = Math.max(15, Math.round(rankedTechs[0].distanceKm * 3.5)); // rough ETA based on distance
    }

    const emergencyRequest = await MaintenanceRequest.create({
      property,
      equipment,
      propertyManager: req.user.id,
      assignedTechnician: assignedTechId,
      requestType: 'Emergency',
      priority: 'CRITICAL',
      isEmergency: true,
      etaMinutes: eta,
      description: description || 'Emergency elevator breakdown/stoppage. Urgent technician response required.',
      status,
      timeline: [
        {
          status: 'REQUESTED',
          timestamp: new Date(),
          note: `EMERGENCY ALERT declared by ${req.user.name}.`,
          updatedBy: req.user.name
        },
        {
          status: assignedTechId ? 'ASSIGNED' : 'MATCHING',
          timestamp: new Date(),
          note: assignedTechId
            ? `Auto-dispatched to nearest verified technician (${rankedTechs[0].technician.company}). Estimated ETA: ${eta} mins.`
            : `Broadcasting emergency alerts to ${rankedTechs.length} nearby verified technicians.`,
          updatedBy: 'Automated Dispatch System'
        }
      ]
    });

    // Notify closest technicians or assigned tech
    if (assignedTechId) {
      const topTech = rankedTechs[0].technician;
      if (topTech.user) {
        await Notification.create({
          recipient: topTech.user._id,
          title: '🚨 CRITICAL EMERGENCY DISPATCH',
          message: `EMERGENCY: Immediate response needed for ${equip.equipmentId} at ${prop.name}!`,
          type: 'EMERGENCY',
          link: `/technician/jobs`,
          metadata: { requestId: emergencyRequest._id, equipmentId: equip._id }
        });

        socketHandler.emitToUser(topTech.user._id.toString(), 'emergency:dispatched', {
          requestId: emergencyRequest._id,
          propertyName: prop.name,
          equipmentName: equip.equipmentId,
          etaMinutes: eta
        });
      }
    } else {
      // Notify all verified available techs in radius
      socketHandler.emitToRole('TECHNICIAN', 'emergency:dispatched', {
        requestId: emergencyRequest._id,
        propertyName: prop.name,
        equipmentName: equip.equipmentId,
        priority: 'CRITICAL',
        distance: rankedTechs[0] ? rankedTechs[0].distanceKm : 5
      });
    }

    res.status(201).json({
      success: true,
      request: emergencyRequest,
      nearbyCandidates: rankedTechs.slice(0, 5).map(r => ({
        id: r.technician._id,
        company: r.technician.company,
        rating: r.technician.rating,
        distanceKm: r.distanceKm
      }))
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign technician to request
// @route   PUT /api/maintenance/:id/assign
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.assignTechnician = async (req, res, next) => {
  try {
    const { technicianId } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('property')
      .populate('equipment');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    const tech = await Technician.findById(technicianId).populate('user');
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    request.assignedTechnician = tech._id;
    request.status = 'ASSIGNED';
    request.timeline.push({
      status: 'ASSIGNED',
      timestamp: new Date(),
      note: `Assigned to ${tech.company} (${tech.user ? tech.user.name : 'Technician'})`,
      updatedBy: req.user.name
    });

    await request.save();

    // Send notifications
    if (tech.user) {
      await Notification.create({
        recipient: tech.user._id,
        title: 'New Job Assigned',
        message: `You were assigned to ${request.equipment.equipmentId} at ${request.property.name}`,
        type: 'JOB_ASSIGNED',
        link: '/technician/jobs',
        metadata: { requestId: request._id }
      });

      socketHandler.emitToUser(tech.user._id.toString(), 'notification:new', {
        title: 'New Job Assigned',
        message: `You were assigned to ${request.equipment.equipmentId} at ${request.property.name}`
      });
    }

    socketHandler.emitToRequest(request._id.toString(), 'job:status_changed', {
      requestId: request._id,
      status: 'ASSIGNED',
      technician: tech.company
    });

    res.status(200).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Job Status
// @route   PUT /api/maintenance/:id/status
// @access  Private
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status, note, etaMinutes } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('property')
      .populate('equipment')
      .populate('propertyManager')
      .populate({ path: 'assignedTechnician', populate: { path: 'user' } });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;
    if (etaMinutes !== undefined) {
      request.etaMinutes = etaMinutes;
    }
    if (status === 'COMPLETED' || status === 'CLOSED') {
      request.completedDate = new Date();
    }

    request.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status progressed to ${status.replace(/_/g, ' ')}`,
      updatedBy: req.user.name
    });

    await request.save();

    // Equipment state synchronization
    const equip = await Equipment.findById(request.equipment._id);
    if (equip) {
      if (status === 'IN_PROGRESS' || status === 'INSPECTION' || status === 'ARRIVED') {
        equip.status = 'Under Maintenance';
      } else if (status === 'APPROVED' || status === 'CLOSED') {
        equip.status = 'Operational';
        equip.lastMaintenanceDate = new Date();
        equip.nextMaintenanceDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      }
      await equip.save();
    }

    // Real-time broadcast
    socketHandler.emitToRequest(request._id.toString(), 'job:status_changed', {
      requestId: request._id,
      status,
      note,
      updatedBy: req.user.name
    });

    // Notify Property Manager if technician updated status
    if (req.user.role === 'TECHNICIAN' && request.propertyManager) {
      await Notification.create({
        recipient: request.propertyManager._id,
        title: `Job Update: ${status.replace(/_/g, ' ')}`,
        message: `Technician updated status of ${request.equipment.equipmentId} at ${request.property.name} to ${status.replace(/_/g, ' ')}`,
        type: 'STATUS_CHANGE',
        link: `/properties/${request.property._id}`,
        metadata: { requestId: request._id }
      });

      socketHandler.emitToUser(request.propertyManager._id.toString(), 'notification:new', {
        title: `Job Update: ${status.replace(/_/g, ' ')}`,
        message: `${request.equipment.equipmentId} status changed to ${status.replace(/_/g, ' ')}`
      });
    }

    res.status(200).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// @desc    Technician accepts an available job
// @route   PUT /api/maintenance/:id/accept
// @access  Private (TECHNICIAN)
exports.acceptJob = async (req, res, next) => {
  try {
    const tech = await Technician.findOne({ user: req.user.id });
    if (!tech) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    if (tech.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        success: false,
        message: 'Only verified technicians can accept professional maintenance jobs.'
      });
    }

    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('property')
      .populate('equipment')
      .populate('propertyManager');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.assignedTechnician && request.assignedTechnician.toString() !== tech._id.toString() && request.status !== 'MATCHING') {
      return res.status(400).json({ success: false, message: 'Job has already been accepted by another technician.' });
    }

    request.assignedTechnician = tech._id;
    request.status = 'ACCEPTED';
    request.etaMinutes = req.body.etaMinutes || 35;
    request.timeline.push({
      status: 'ACCEPTED',
      timestamp: new Date(),
      note: `Job accepted by ${tech.company}. En-route ETA: ${request.etaMinutes} mins.`,
      updatedBy: req.user.name
    });

    await request.save();

    // Notify Property Manager
    if (request.propertyManager) {
      await Notification.create({
        recipient: request.propertyManager._id,
        title: 'Job Accepted by Technician',
        message: `${tech.company} has accepted the service request for ${request.equipment.equipmentId}. ETA: ${request.etaMinutes} mins.`,
        type: 'JOB_ASSIGNED',
        link: `/requests/${request._id}`,
        metadata: { requestId: request._id }
      });

      socketHandler.emitToUser(request.propertyManager._id.toString(), 'job:accepted', {
        requestId: request._id,
        technician: tech.company,
        etaMinutes: request.etaMinutes
      });
    }

    res.status(200).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

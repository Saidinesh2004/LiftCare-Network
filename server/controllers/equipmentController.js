const Equipment = require('../models/Equipment');
const Property = require('../models/Property');

// @desc    Get equipment list (with optional property filter)
// @route   GET /api/equipment
// @access  Private
exports.getEquipment = async (req, res, next) => {
  try {
    const { propertyId, type, status, search } = req.query;
    let query = {};

    if (propertyId) {
      query.property = propertyId;
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { equipmentId: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // If PM, ensure they only get their properties' equipment
    if (req.user.role === 'PROPERTY_MANAGER' && !propertyId) {
      const myProperties = await Property.find({ propertyManager: req.user.id }).select('_id');
      query.property = { $in: myProperties.map(p => p._id) };
    }

    const equipment = await Equipment.find(query)
      .populate('property', 'name address coordinates buildingType')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: equipment.length, equipment });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single equipment with full maintenance history
// @route   GET /api/equipment/:id
// @access  Private
exports.getEquipmentById = async (req, res, next) => {
  try {
    const item = await Equipment.findById(req.params.id)
      .populate('property', 'name address coordinates buildingType totalFloors contactPhone')
      .populate('historyTimeline.technician', 'company experience licenseNumber');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment unit not found' });
    }

    res.status(200).json({ success: true, equipment: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Create equipment unit
// @route   POST /api/equipment
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.createEquipment = async (req, res, next) => {
  try {
    const {
      equipmentId,
      property,
      type,
      subType,
      manufacturer,
      model,
      serialNumber,
      capacity,
      floorsServed,
      installationDate,
      lastMaintenanceDate,
      nextMaintenanceDate,
      status
    } = req.body;

    const prop = await Property.findById(property);
    if (!prop) {
      return res.status(404).json({ success: false, message: 'Specified property not found' });
    }

    const initialHistory = [{
      date: installationDate || new Date(),
      type: 'Installation',
      title: 'Initial Commissioning & Certification',
      description: `Installed and certified by ${manufacturer || 'Manufacturer OEM'}. Initial load and safety tests completed.`,
      performedBy: 'Certified OEM Inspector'
    }];

    const equipment = await Equipment.create({
      equipmentId,
      property,
      type: type || 'Elevator',
      subType: subType || (type === 'Escalator' ? 'Commercial Step-Type' : 'Passenger Traction Elevator'),
      manufacturer,
      model: model || 'Standard Spec',
      serialNumber,
      capacity: capacity || (type === 'Escalator' ? '6,500 pers/hr' : '1,250 kg'),
      floorsServed: floorsServed || 'Ground to Top',
      installationDate: installationDate || new Date(),
      lastMaintenanceDate: lastMaintenanceDate || new Date(),
      nextMaintenanceDate: nextMaintenanceDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: status || 'Operational',
      historyTimeline: initialHistory
    });

    res.status(201).json({ success: true, equipment });
  } catch (err) {
    next(err);
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.updateEquipment = async (req, res, next) => {
  try {
    let item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment unit not found' });
    }

    item = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('property', 'name address');

    res.status(200).json({ success: true, equipment: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Update equipment status directly
// @route   PATCH /api/equipment/:id/status
// @access  Private
exports.updateEquipmentStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment unit not found' });
    }

    item.status = status;
    if (note) {
      item.historyTimeline.push({
        date: new Date(),
        type: status === 'Operational' ? 'Inspection' : 'Maintenance',
        title: `Status updated to ${status}`,
        description: note,
        performedBy: req.user.name
      });
    }

    await item.save();
    res.status(200).json({ success: true, equipment: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Add event to equipment history timeline
// @route   POST /api/equipment/:id/history
// @access  Private
exports.addHistoryEvent = async (req, res, next) => {
  try {
    const { type, title, description, performedBy, date } = req.body;
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment unit not found' });
    }

    item.historyTimeline.push({
      date: date || new Date(),
      type: type || 'Maintenance',
      title,
      description: description || '',
      performedBy: performedBy || req.user.name
    });

    await item.save();
    res.status(200).json({ success: true, historyTimeline: item.historyTimeline });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.deleteEquipment = async (req, res, next) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }

    await Equipment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Equipment removed successfully' });
  } catch (err) {
    next(err);
  }
};

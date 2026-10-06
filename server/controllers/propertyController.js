const Property = require('../models/Property');
const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get all properties (filtered for PM, all for Admin)
// @route   GET /api/properties
// @access  Private
exports.getProperties = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'PROPERTY_MANAGER') {
      query.propertyManager = req.user.id;
    }

    const properties = await Property.find(query)
      .populate('propertyManager', 'name email phone companyName')
      .sort({ createdAt: -1 });

    // Aggregate equipment counts per property
    const enrichedProperties = await Promise.all(
      properties.map(async (prop) => {
        const propObj = prop.toObject();
        const equipmentList = await Equipment.find({ property: prop._id });
        const elevatorsCount = equipmentList.filter(e => e.type === 'Elevator').length;
        const escalatorsCount = equipmentList.filter(e => e.type === 'Escalator' || e.type === 'Moving Walk').length;
        const activeRequestsCount = await MaintenanceRequest.countDocuments({
          property: prop._id,
          status: { $nin: ['COMPLETED', 'APPROVED', 'CLOSED'] }
        });

        propObj.stats = {
          totalEquipment: equipmentList.length,
          elevators: elevatorsCount,
          escalators: escalatorsCount,
          activeRequests: activeRequestsCount
        };
        return propObj;
      })
    );

    res.status(200).json({ success: true, count: enrichedProperties.length, properties: enrichedProperties });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Private
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('propertyManager', 'name email phone companyName');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const equipment = await Equipment.find({ property: property._id });
    const requests = await MaintenanceRequest.find({ property: property._id })
      .populate('assignedTechnician')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      property,
      equipment,
      recentRequests: requests
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (PROPERTY_MANAGER or ADMIN)
exports.createProperty = async (req, res, next) => {
  try {
    const { name, address, city, state, postalCode, coordinates, buildingType, totalFloors, contactPhone, contactEmail, imageUrl } = req.body;

    const property = await Property.create({
      name,
      propertyManager: req.user.role === 'PROPERTY_MANAGER' ? req.user.id : (req.body.propertyManager || req.user.id),
      address,
      city: city || 'New York',
      state: state || 'NY',
      postalCode: postalCode || '10001',
      coordinates: coordinates || { lat: 40.7128 + (Math.random() - 0.5) * 0.08, lng: -74.0060 + (Math.random() - 0.5) * 0.08 },
      buildingType: buildingType || 'Commercial Office',
      totalFloors: totalFloors || 15,
      contactPhone: contactPhone || req.user.phone || '+1 (555) 000-0000',
      contactEmail: contactEmail || req.user.email,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
    });

    res.status(201).json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (PROPERTY_MANAGER owner or ADMIN)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (req.user.role === 'PROPERTY_MANAGER' && property.propertyManager.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (PROPERTY_MANAGER owner or ADMIN)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (req.user.role === 'PROPERTY_MANAGER' && property.propertyManager.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await Equipment.deleteMany({ property: property._id });
    await Property.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Property and linked equipment deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const Technician = require('../models/Technician');
const Property = require('../models/Property');
const User = require('../models/User');

// Haversine formula to compute distance between two coords in KM
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Calculate match score
function computeMatchScore(tech, targetLat, targetLng, requiredSkills = []) {
  let score = 0;
  const distance = (targetLat && targetLng && tech.location && tech.location.lat && tech.location.lng)
    ? getDistanceFromLatLonInKm(targetLat, targetLng, tech.location.lat, tech.location.lng)
    : 5.0;

  // 1. Distance score (max 25 pts)
  if (distance <= 5) {
    score += 25;
  } else if (distance <= 15) {
    score += 20;
  } else if (distance <= 30) {
    score += 15;
  } else if (distance <= 50) {
    score += 10;
  } else {
    score += 5;
  }

  // 2. Verification score (max 25 pts)
  if (tech.verificationStatus === 'VERIFIED') {
    score += 25;
  } else if (tech.verificationStatus === 'PENDING') {
    score += 8;
  }

  // 3. Availability score (max 15 pts)
  if (tech.availability) {
    score += 15;
  } else {
    score += 2;
  }

  // 4. Rating score (max 15 pts)
  const rating = tech.rating || 4.5;
  score += Math.round((rating / 5) * 15);

  // 5. Experience score (max 10 pts)
  const exp = tech.experience || 3;
  score += Math.min(10, Math.max(3, exp));

  // 6. Skill match score (max 10 pts)
  if (requiredSkills && requiredSkills.length > 0) {
    const techSkills = (tech.skills || []).map(s => s.toLowerCase());
    const matched = requiredSkills.filter(reqS =>
      techSkills.some(ts => ts.includes(reqS.toLowerCase()))
    ).length;
    score += Math.round((matched / requiredSkills.length) * 10);
  } else {
    score += 10;
  }

  return {
    score: Math.min(99, Math.max(40, score)),
    distance
  };
}

// @desc    Get technicians with optional matching against a property or coordinate
// @route   GET /api/technicians
// @access  Private
exports.getTechnicians = async (req, res, next) => {
  try {
    const { propertyId, lat, lng, skills, verifiedOnly, availableOnly, search } = req.query;

    let query = {};
    if (verifiedOnly === 'true') {
      query.verificationStatus = 'VERIFIED';
    }
    if (availableOnly === 'true') {
      query.availability = true;
    }

    let technicians = await Technician.find(query)
      .populate('user', 'name email phone avatar companyName isActive')
      .sort({ rating: -1 });

    let targetLat = lat ? parseFloat(lat) : null;
    let targetLng = lng ? parseFloat(lng) : null;

    if (propertyId) {
      const prop = await Property.findById(propertyId);
      if (prop && prop.coordinates) {
        targetLat = prop.coordinates.lat;
        targetLng = prop.coordinates.lng;
      }
    }

    const skillList = skills ? skills.split(',').map(s => s.trim()) : [];

    // Map each technician with match score & distance
    let results = technicians.map(t => {
      const tObj = t.toObject();
      const matchCalc = computeMatchScore(t, targetLat, targetLng, skillList);
      tObj.matchScore = matchCalc.score;
      tObj.distanceKm = matchCalc.distance;
      return tObj;
    });

    if (search) {
      const s = search.toLowerCase();
      results = results.filter(t =>
        (t.company && t.company.toLowerCase().includes(s)) ||
        (t.user && t.user.name && t.user.name.toLowerCase().includes(s)) ||
        (t.licenseNumber && t.licenseNumber.toLowerCase().includes(s)) ||
        (t.skills && t.skills.some(skill => skill.toLowerCase().includes(s)))
      );
    }

    // Sort by match score descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ success: true, count: results.length, technicians: results });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single technician profile
// @route   GET /api/technicians/:id
// @access  Private
exports.getTechnicianById = async (req, res, next) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .populate('user', 'name email phone avatar companyName');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    res.status(200).json({ success: true, technician });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in technician profile
// @route   GET /api/technicians/me/profile
// @access  Private (TECHNICIAN)
exports.getMyTechnicianProfile = async (req, res, next) => {
  try {
    const technician = await Technician.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar companyName');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found for this account' });
    }

    res.status(200).json({ success: true, technician });
  } catch (err) {
    next(err);
  }
};

// @desc    Update technician profile
// @route   PUT /api/technicians/me/profile
// @access  Private (TECHNICIAN or ADMIN)
exports.updateTechnicianProfile = async (req, res, next) => {
  try {
    let query = { user: req.user.id };
    if (req.user.role === 'ADMIN' && req.body.technicianId) {
      query = { _id: req.body.technicianId };
    }

    let technician = await Technician.findOne(query);
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    const {
      company,
      experience,
      licenseNumber,
      licenseExpiry,
      skills,
      certifications,
      serviceRadius,
      location,
      availability
    } = req.body;

    if (company) technician.company = company;
    if (experience !== undefined) technician.experience = experience;
    if (licenseNumber) technician.licenseNumber = licenseNumber;
    if (licenseExpiry) technician.licenseExpiry = licenseExpiry;
    if (skills) technician.skills = skills;
    if (certifications) technician.certifications = certifications;
    if (serviceRadius !== undefined) technician.serviceRadius = serviceRadius;
    if (location) technician.location = { ...technician.location, ...location };
    if (availability !== undefined) technician.availability = availability;

    await technician.save();

    res.status(200).json({ success: true, technician });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload technician verification documents
// @route   POST /api/technicians/me/documents
// @access  Private (TECHNICIAN)
exports.uploadDocuments = async (req, res, next) => {
  try {
    const technician = await Technician.findOne({ user: req.user.id });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    if (req.files) {
      if (req.files.licenseDocument && req.files.licenseDocument[0]) {
        technician.documents.licenseDoc = `/uploads/documents/${req.files.licenseDocument[0].filename}`;
      }
      if (req.files.certifications && req.files.certifications[0]) {
        technician.documents.certDoc = `/uploads/documents/${req.files.certifications[0].filename}`;
      }
      if (req.files.identityDocument && req.files.identityDocument[0]) {
        technician.documents.idDoc = `/uploads/documents/${req.files.identityDocument[0].filename}`;
      }
    } else if (req.body.documents) {
      // Allow passing URLs directly (e.g. cloud / simulated)
      technician.documents = { ...technician.documents, ...req.body.documents };
    }

    // Set status to PENDING for admin review
    technician.verificationStatus = 'PENDING';
    await technician.save();

    res.status(200).json({
      success: true,
      message: 'Documents submitted successfully for administrator verification',
      documents: technician.documents,
      verificationStatus: technician.verificationStatus
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle availability
// @route   PATCH /api/technicians/me/availability
// @access  Private (TECHNICIAN)
exports.toggleAvailability = async (req, res, next) => {
  try {
    const technician = await Technician.findOne({ user: req.user.id });
    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician profile not found' });
    }

    technician.availability = req.body.availability !== undefined ? req.body.availability : !technician.availability;
    await technician.save();

    res.status(200).json({ success: true, availability: technician.availability });
  } catch (err) {
    next(err);
  }
};

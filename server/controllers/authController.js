const User = require('../models/User');
const Technician = require('../models/Technician');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res, technician = null) => {
  const token = user.getSignedJwtToken();
  const userData = user.toObject();
  delete userData.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
    technician
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, companyName, company, experience, licenseNumber, skills } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'PROPERTY_MANAGER',
      phone: phone || '',
      companyName: companyName || company || ''
    });

    let techProfile = null;
    // If technician, create baseline technician profile
    if (user.role === 'TECHNICIAN') {
      techProfile = await Technician.create({
        user: user._id,
        company: company || companyName || `${user.name} Services`,
        experience: experience || 3,
        licenseNumber: licenseNumber || `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
        skills: skills && skills.length ? skills : ['Passenger Elevators', 'Routine Inspection'],
        verificationStatus: 'PENDING'
      });
    }

    sendTokenResponse(user, 201, res, techProfile);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let technician = null;
    if (user.role === 'TECHNICIAN') {
      technician = await Technician.findOne({ user: user._id });
    }

    sendTokenResponse(user, 200, res, technician);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let technician = null;
    if (user.role === 'TECHNICIAN') {
      technician = await Technician.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      technician
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, companyName, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (companyName !== undefined) fieldsToUpdate.companyName = companyName;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    let technician = null;
    if (user.role === 'TECHNICIAN') {
      technician = await Technician.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      technician
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password placeholder
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  res.status(200).json({
    success: true,
    message: `Password reset instructions have been dispatched to ${email || 'your registered email'}. In demo mode, you can log in with demo accounts.`
  });
};

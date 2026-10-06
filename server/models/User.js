const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isMongooseConnected } = require('../config/db');
const { createInMemoryModel } = require('../config/inMemoryStore');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['ADMIN', 'PROPERTY_MANAGER', 'TECHNICIAN'],
    default: 'PROPERTY_MANAGER'
  },
  phone: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'liftcare_default_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
const InMemoryUser = createInMemoryModel('User');

const UserProxy = new Proxy(MongooseUser, {
  get(target, prop) {
    if (isMongooseConnected()) {
      return target[prop];
    }
    return InMemoryUser[prop] !== undefined ? InMemoryUser[prop] : target[prop];
  }
});

module.exports = UserProxy;

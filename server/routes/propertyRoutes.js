const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProperties)
  .post(authorize('PROPERTY_MANAGER', 'ADMIN'), createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(authorize('PROPERTY_MANAGER', 'ADMIN'), updateProperty)
  .delete(authorize('PROPERTY_MANAGER', 'ADMIN'), deleteProperty);

module.exports = router;

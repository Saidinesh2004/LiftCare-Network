const express = require('express');
const router = express.Router();
const {
  getRequests,
  getRequestById,
  createRequest,
  createEmergencyRequest,
  assignTechnician,
  updateJobStatus,
  acceptJob
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getRequests)
  .post(authorize('PROPERTY_MANAGER', 'ADMIN'), createRequest);

router.post('/emergency', authorize('PROPERTY_MANAGER', 'ADMIN'), createEmergencyRequest);

router.route('/:id')
  .get(getRequestById);

router.put('/:id/assign', authorize('PROPERTY_MANAGER', 'ADMIN'), assignTechnician);
router.put('/:id/status', updateJobStatus);
router.put('/:id/accept', authorize('TECHNICIAN'), acceptJob);

module.exports = router;

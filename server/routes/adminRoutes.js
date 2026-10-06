const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getPendingVerifications,
  reviewTechnician
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/analytics', getAnalytics);
router.get('/verifications', getPendingVerifications);
router.put('/verifications/:id', reviewTechnician);

module.exports = router;

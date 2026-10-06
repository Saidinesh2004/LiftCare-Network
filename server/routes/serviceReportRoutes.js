const express = require('express');
const router = express.Router();
const {
  createServiceReport,
  getReportByRequestId,
  getReportById,
  reviewReport,
  getAllReports
} = require('../controllers/serviceReportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllReports)
  .post(authorize('TECHNICIAN'), createServiceReport);

router.get('/request/:requestId', getReportByRequestId);
router.get('/:id', getReportById);
router.put('/:id/review', authorize('PROPERTY_MANAGER', 'ADMIN'), reviewReport);

module.exports = router;

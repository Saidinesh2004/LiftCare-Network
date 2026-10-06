const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  getTechnicians,
  getTechnicianById,
  getMyTechnicianProfile,
  updateTechnicianProfile,
  uploadDocuments,
  toggleAvailability
} = require('../controllers/technicianController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getTechnicians);
router.get('/me/profile', authorize('TECHNICIAN'), getMyTechnicianProfile);
router.put('/me/profile', authorize('TECHNICIAN', 'ADMIN'), updateTechnicianProfile);
router.patch('/me/availability', authorize('TECHNICIAN'), toggleAvailability);

router.post(
  '/me/documents',
  authorize('TECHNICIAN'),
  upload.fields([
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'certifications', maxCount: 1 },
    { name: 'identityDocument', maxCount: 1 }
  ]),
  uploadDocuments
);

router.get('/:id', getTechnicianById);

module.exports = router;

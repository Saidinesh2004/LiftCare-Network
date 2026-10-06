const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  updateEquipmentStatus,
  addHistoryEvent,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getEquipment)
  .post(authorize('PROPERTY_MANAGER', 'ADMIN'), createEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(authorize('PROPERTY_MANAGER', 'ADMIN'), updateEquipment)
  .delete(authorize('PROPERTY_MANAGER', 'ADMIN'), deleteEquipment);

router.patch('/:id/status', updateEquipmentStatus);
router.post('/:id/history', addHistoryEvent);

module.exports = router;

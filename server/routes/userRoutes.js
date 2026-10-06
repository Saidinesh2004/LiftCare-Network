const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, toggleUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('ADMIN'), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/toggle-status', authorize('ADMIN'), toggleUserStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { admitPatient, dischargePatient, getActiveAdmissions } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.post('/admit', protect, admitPatient);
router.put('/discharge/:id', protect, dischargePatient);
router.get('/active', protect, getActiveAdmissions);

module.exports = router;

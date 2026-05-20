const express = require('express');
const router = express.Router();
const { getBeds, addBed, updateBedStatus } = require('../controllers/bedController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBeds)
  .post(protect, adminOnly, addBed);

router.route('/:id')
  .put(protect, updateBedStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const doctors = [
  { id: 1, name: 'Dr. Rajesh Sharma', specialty: 'General Medicine' },
  { id: 2, name: 'Dr. Priya Patel', specialty: 'Cardiology' },
  { id: 3, name: 'Dr. Anil Kumar', specialty: 'Orthopedics' },
  { id: 4, name: 'Dr. Sneha Gupta', specialty: 'Pediatrics' },
  { id: 5, name: 'Dr. Vikram Singh', specialty: 'Neurology' },
  { id: 6, name: 'Dr. Meena Iyer', specialty: 'Gynecology' },
  { id: 7, name: 'Dr. Arjun Reddy', specialty: 'Surgery' },
  { id: 8, name: 'Dr. Kavita Desai', specialty: 'Dermatology' },
  { id: 9, name: 'Dr. Suresh Nair', specialty: 'ENT' },
  { id: 10, name: 'Dr. Fatima Khan', specialty: 'Psychiatry' },
  { id: 11, name: 'Dr. Rohit Verma', specialty: 'Pulmonology' },
  { id: 12, name: 'Dr. Ananya Joshi', specialty: 'Oncology' },
];

router.get('/', protect, (req, res) => {
  res.json(doctors);
});

module.exports = router;

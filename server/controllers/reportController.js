const db = require('../config/db');

// @route   GET /api/reports
const getDashboardStats = async (req, res) => {
  try {
    const bedsResult = await db.query('SELECT status, type FROM beds');
    const beds = bedsResult.rows;

    const totalBeds = beds.length;
    const availableBeds = beds.filter((b) => b.status === 'Available').length;
    const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
    
    const icuBeds = beds.filter((b) => b.type === 'ICU');
    const totalIcuBeds = icuBeds.length;
    const occupiedIcuBeds = icuBeds.filter((b) => b.status === 'Occupied').length;

    const emergencyBeds = beds.filter((b) => b.type === 'Emergency');
    const totalEmergencyBeds = emergencyBeds.length;
    const occupiedEmergencyBeds = emergencyBeds.filter((b) => b.status === 'Occupied').length;

    // Analytics data for Recharts (dummy structure based on current beds)
    // In a real app, this would aggregate historical data.
    const wardOccupancy = [
      { name: 'General', occupied: beds.filter(b => b.type === 'General' && b.status === 'Occupied').length, total: beds.filter(b => b.type === 'General').length },
      { name: 'ICU', occupied: occupiedIcuBeds, total: totalIcuBeds },
      { name: 'Emergency', occupied: occupiedEmergencyBeds, total: totalEmergencyBeds },
      { name: 'Maternity', occupied: beds.filter(b => b.type === 'Maternity' && b.status === 'Occupied').length, total: beds.filter(b => b.type === 'Maternity').length },
    ];

    // Dummy Monthly Admissions
    const monthlyAdmissions = [
      { month: 'Jan', admissions: 120 },
      { month: 'Feb', admissions: 150 },
      { month: 'Mar', admissions: 180 },
      { month: 'Apr', admissions: 130 },
      { month: 'May', admissions: 160 },
      { month: 'Jun', admissions: 190 },
    ];

    res.json({
      totalBeds,
      availableBeds,
      occupiedBeds,
      totalIcuBeds,
      occupiedIcuBeds,
      totalEmergencyBeds,
      occupiedEmergencyBeds,
      wardOccupancy,
      monthlyAdmissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };

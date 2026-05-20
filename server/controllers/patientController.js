const db = require('../config/db');

// @route   POST /api/patients/admit
const admitPatient = async (req, res) => {
  const { name, age, gender, disease, doctor_name, bed_id } = req.body;
  
  try {
    // Start transaction
    await db.query('BEGIN');

    // 1. Insert Patient
    const patientResult = await db.query(
      'INSERT INTO patients (name, age, gender, disease, doctor_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, age, gender, disease, doctor_name]
    );
    const patient_id = patientResult.rows[0].id;

    // 2. Insert Admission
    await db.query(
      'INSERT INTO admissions (patient_id, bed_id, status) VALUES ($1, $2, $3)',
      [patient_id, bed_id, 'Admitted']
    );

    // 3. Update Bed Status
    await db.query(
      "UPDATE beds SET status = 'Occupied' WHERE id = $1",
      [bed_id]
    );

    await db.query('COMMIT');
    
    req.io.emit('patient_admitted');
    req.io.emit('bed_updated');

    res.status(201).json({ message: 'Patient admitted successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/patients/discharge/:id
// :id is the admission id or patient id. Let's assume bed_id is passed or we look it up via admission.
const dischargePatient = async (req, res) => {
  const { id } = req.params; // admission id

  try {
    await db.query('BEGIN');

    // Find admission to get bed_id
    const admissionResult = await db.query(
      'SELECT * FROM admissions WHERE id = $1',
      [id]
    );
    const admission = admissionResult.rows[0];

    if (!admission || admission.status === 'Discharged') {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Active admission not found' });
    }

    // Update Admission
    await db.query(
      "UPDATE admissions SET status = 'Discharged', discharge_date = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    // Update Bed Status
    await db.query(
      "UPDATE beds SET status = 'Available' WHERE id = $1",
      [admission.bed_id]
    );

    await db.query('COMMIT');

    req.io.emit('patient_discharged');
    req.io.emit('bed_updated');

    res.json({ message: 'Patient discharged successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getActiveAdmissions = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.id as admission_id, p.name, p.age, p.gender, p.disease, p.doctor_name, 
             a.admission_date, b.id as bed_id, w.name as ward_name
      FROM admissions a
      JOIN patients p ON a.patient_id = p.id
      JOIN beds b ON a.bed_id = b.id
      JOIN wards w ON b.ward_id = w.id
      WHERE a.status = 'Admitted'
      ORDER BY a.admission_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { admitPatient, dischargePatient, getActiveAdmissions };

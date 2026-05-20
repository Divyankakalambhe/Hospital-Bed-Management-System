const db = require('./config/db');

const seedAdmissions = async () => {
  try {
    console.log('Seeding dummy patients and active admissions...');

    // 1. Get 4 occupied beds
    const bedsRes = await db.query("SELECT id FROM beds WHERE status = 'Occupied' LIMIT 4");
    if (bedsRes.rows.length < 4) {
      console.log('Fewer than 4 occupied beds found. Making sure at least 4 beds are occupied.');
      // Find any available beds and set them to occupied
      await db.query(`
        UPDATE beds SET status = 'Occupied' 
        WHERE id IN (SELECT id FROM beds WHERE status = 'Available' LIMIT 4)
      `);
    }

    const occupiedBeds = (await db.query("SELECT id FROM beds WHERE status = 'Occupied' LIMIT 4")).rows;
    console.log('Occupied beds to assign:', occupiedBeds.map(b => b.id));

    // 2. Dummy Patient Data
    const dummyPatients = [
      { name: 'Aarav Mehta', age: 34, gender: 'Male', disease: 'Dengue Fever', doctor_name: 'Dr. Rajesh Sharma' },
      { name: 'Priya Sharma', age: 29, gender: 'Female', disease: 'Acute Appendicitis', doctor_name: 'Dr. Arjun Reddy' },
      { name: 'Vikram Malhotra', age: 62, gender: 'Male', disease: 'Cardiovascular Disease', doctor_name: 'Dr. Priya Patel' },
      { name: 'Ananya Deshmukh', age: 45, gender: 'Female', disease: 'Pneumonia', doctor_name: 'Dr. Rohit Verma' }
    ];

    for (let i = 0; i < dummyPatients.length; i++) {
      const patient = dummyPatients[i];
      const bed = occupiedBeds[i];

      // Clean up previous admissions/patients linked to this bed if any to avoid duplication
      await db.query("DELETE FROM admissions WHERE bed_id = $1", [bed.id]);

      // Insert Patient
      const patientRes = await db.query(
        'INSERT INTO patients (name, age, gender, disease, doctor_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [patient.name, patient.age, patient.gender, patient.disease, patient.doctor_name]
      );
      const patientId = patientRes.rows[0].id;

      // Insert Admission
      await db.query(
        'INSERT INTO admissions (patient_id, bed_id, status, admission_date) VALUES ($1, $2, $3, NOW() - INTERVAL \'' + (i + 1) + ' day\')',
        [patientId, bed.id, 'Admitted']
      );
    }

    console.log('Successfully seeded 4 patients and linked them to occupied beds.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admissions:', error);
    process.exit(1);
  }
};

seedAdmissions();

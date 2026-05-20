const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to database, seeding data...');

    // 1. Create Default Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      `INSERT INTO users (email, password, role, name) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
      ['admin@smartbed.com', hashedPassword, 'Admin', 'Super Admin']
    );

    // 2. Insert Wards
    const wardsResult = await client.query(`
      INSERT INTO wards (name, type, total_beds) 
      VALUES 
        ('General Ward A', 'General', 20),
        ('ICU 1', 'ICU', 10),
        ('Emergency 1', 'Emergency', 15),
        ('Maternity 1', 'Maternity', 10)
      RETURNING id, type;
    `);

    // 3. Insert Beds
    for (const ward of wardsResult.rows) {
      let bedCount = ward.type === 'General' ? 20 : ward.type === 'ICU' ? 10 : ward.type === 'Emergency' ? 15 : 10;
      for (let i = 1; i <= bedCount; i++) {
        await client.query(`
          INSERT INTO beds (ward_id, status, type)
          VALUES ($1, $2, $3)
        `, [ward.id, i % 3 === 0 ? 'Occupied' : 'Available', ward.type]);
      }
    }

    console.log('Dummy data seeded successfully.');
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

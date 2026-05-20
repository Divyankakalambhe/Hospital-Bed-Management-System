const db = require('../config/db');

// @route   GET /api/beds
const getBeds = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.id, b.status, b.type as bed_type, w.name as ward_name, w.type as ward_type, b.created_at
      FROM beds b
      JOIN wards w ON b.ward_id = w.id
      ORDER BY b.id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   POST /api/beds
const addBed = async (req, res) => {
  const { ward_id, type } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO beds (ward_id, type) VALUES ($1, $2) RETURNING *',
      [ward_id, type]
    );
    // Emit socket event
    req.io.emit('bed_updated');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/beds/:id
const updateBedStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      'UPDATE beds SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    // Emit socket event
    req.io.emit('bed_updated');
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBeds, addBed, updateBedStatus };

const db = require('./config/db');

async function run() {
  // Set 3 beds to Cleaning
  await db.query(`UPDATE beds SET status = 'Cleaning' WHERE id IN (SELECT id FROM beds WHERE status = 'Available' ORDER BY id LIMIT 3)`);
  // Set 2 beds to Maintenance
  await db.query(`UPDATE beds SET status = 'Maintenance' WHERE id IN (SELECT id FROM beds WHERE status = 'Available' ORDER BY id LIMIT 2)`);
  // Set 4 beds to Reserved
  await db.query(`UPDATE beds SET status = 'Reserved' WHERE id IN (SELECT id FROM beds WHERE status = 'Available' ORDER BY id LIMIT 4)`);

  const r = await db.query(`SELECT status, COUNT(*) as count FROM beds GROUP BY status ORDER BY status`);
  console.log('Bed status counts:', r.rows);
  process.exit(0);
}

run();

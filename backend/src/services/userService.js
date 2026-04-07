import pool from '../config/db.js';

export async function getUsersByRole(role) {
  const [rows] = await pool.query(
    'SELECT id, name, email FROM users WHERE role = ? ORDER BY name ASC',
    [role]
  );
  return rows;
}

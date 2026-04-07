import pool from '../config/db.js';
import { AppError } from '../middleware/errorMiddleware.js';

export async function listActiveTreatments() {
  const [rows] = await pool.query(
    `SELECT id, name, rate
     FROM treatments
     WHERE active = 1
     ORDER BY name ASC`
  );
  return rows;
}

export async function listAllTreatments() {
  const [rows] = await pool.query(
    `SELECT id, name, rate, active
     FROM treatments
     ORDER BY name ASC`
  );
  return rows;
}

export async function createTreatment({ name, rate }) {
  const [result] = await pool.query(
    'INSERT INTO treatments (name, rate, active) VALUES (?, ?, 1)',
    [name.trim(), rate ?? null]
  );

  return { id: result.insertId, name: name.trim(), rate: rate ?? null, active: 1 };
}

export async function updateTreatment(treatmentId, { name, rate, active }) {
  const [existing] = await pool.query('SELECT id FROM treatments WHERE id = ? LIMIT 1', [treatmentId]);
  if (!existing.length) {
    throw new AppError('Treatment not found.', 404);
  }

  await pool.query(
    `UPDATE treatments
     SET name = COALESCE(?, name),
         rate = ?,
         active = COALESCE(?, active)
     WHERE id = ?`,
    [name ? name.trim() : null, rate ?? null, typeof active === 'boolean' ? Number(active) : null, treatmentId]
  );

  const [rows] = await pool.query('SELECT id, name, rate, active FROM treatments WHERE id = ? LIMIT 1', [treatmentId]);
  return rows[0];
}

export async function removeTreatment(treatmentId) {
  const [result] = await pool.query('DELETE FROM treatments WHERE id = ?', [treatmentId]);
  if (!result.affectedRows) {
    throw new AppError('Treatment not found.', 404);
  }
  return { id: treatmentId };
}

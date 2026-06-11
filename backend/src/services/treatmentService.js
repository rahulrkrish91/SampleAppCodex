import pool from '../config/db.js';
import { AppError } from '../middleware/errorMiddleware.js';

const DEFAULT_TREATMENTS = [
  'Dental Exams and Cleaning',
  'Dental Filings',
  'Root Canal',
  'Crowns and Bridges',
  'Dentures',
  'Dental Implants',
  'Scaning',
  'Teeth Whitening',
  'Dental Veeners',
  'Braces and Aligners',
  'Tooth Extraction',
  'Periodontal Treatment',
];

export async function listActiveTreatments() {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, rate
       FROM treatments
       WHERE active = 1
       ORDER BY name ASC`
    );
    return rows;
  } catch (error) {
    if (!['ER_NO_SUCH_TABLE'].includes(error.code)) {
      throw error;
    }

    return DEFAULT_TREATMENTS.map((name, index) => ({
      id: index + 1,
      name,
      rate: null,
    }));
  }
}

export async function listAllTreatments() {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, rate, active
       FROM treatments
       ORDER BY name ASC`
    );
    return rows;
  } catch (error) {
    if (!['ER_NO_SUCH_TABLE'].includes(error.code)) {
      throw error;
    }

    return DEFAULT_TREATMENTS.map((name, index) => ({
      id: index + 1,
      name,
      rate: null,
      active: 1,
    }));
  }
}

export async function createTreatment({ name, rate }) {
  let result;
  try {
    [result] = await pool.query(
      'INSERT INTO treatments (name, rate, active) VALUES (?, ?, 1)',
      [name.trim(), rate ?? null]
    );
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new AppError('Treatments table is missing. Please run the latest database schema.', 500);
    }
    throw error;
  }

  return { id: result.insertId, name: name.trim(), rate: rate ?? null, active: 1 };
}

export async function updateTreatment(treatmentId, { name, rate, active }) {
  let existing;
  try {
    [existing] = await pool.query('SELECT id FROM treatments WHERE id = ? LIMIT 1', [treatmentId]);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new AppError('Treatments table is missing. Please run the latest database schema.', 500);
    }
    throw error;
  }
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
  let result;
  try {
    [result] = await pool.query('DELETE FROM treatments WHERE id = ?', [treatmentId]);
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new AppError('Treatments table is missing. Please run the latest database schema.', 500);
    }
    throw error;
  }
  if (!result.affectedRows) {
    throw new AppError('Treatment not found.', 404);
  }
  return { id: treatmentId };
}

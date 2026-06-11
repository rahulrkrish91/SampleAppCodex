import pool from '../config/db.js';
import { AppError } from '../middleware/errorMiddleware.js';

async function ensureRole(userId, role) {
  const [rows] = await pool.query('SELECT id FROM users WHERE id = ? AND role = ? LIMIT 1', [userId, role]);
  if (rows.length === 0) {
    throw new AppError(`Invalid ${role} id: ${userId}`, 400);
  }
}

export async function createAppointment({ patientId, doctorId, clinicId, treatmentId, appointmentTime }) {
  await ensureRole(patientId, 'patient');
  await ensureRole(doctorId, 'doctor');
  await ensureRole(clinicId, 'clinic');
  try {
    const [treatments] = await pool.query(
      'SELECT id, name, rate FROM treatments WHERE id = ? AND active = 1 LIMIT 1',
      [treatmentId]
    );

    if (!treatments.length) {
      throw new AppError('Invalid treatment selection.', 400);
    }

    const selectedTreatment = treatments[0];

    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, clinic_id, treatment_id, treatment_rate, appointment_time, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [patientId, doctorId, clinicId, selectedTreatment.id, selectedTreatment.rate, appointmentTime, selectedTreatment.name]
    );

    return {
      id: result.insertId,
      patientId,
      doctorId,
      clinicId,
      treatmentId: selectedTreatment.id,
      treatmentName: selectedTreatment.name,
      treatmentRate: selectedTreatment.rate,
      appointmentTime,
      status: 'scheduled',
    };
  } catch (error) {
    if (!['ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_TABLE'].includes(error.code)) {
      throw error;
    }

    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, clinic_id, appointment_time, reason, status)
       VALUES (?, ?, ?, ?, ?, 'scheduled')`,
      [patientId, doctorId, clinicId, appointmentTime, `Treatment ${treatmentId}`]
    );

    return {
      id: result.insertId,
      patientId,
      doctorId,
      clinicId,
      treatmentId,
      treatmentName: `Treatment ${treatmentId}`,
      treatmentRate: null,
      appointmentTime,
      status: 'scheduled',
    };
  }
}

export async function getPatientAppointments(patientId) {
  let rows;
  try {
    [rows] = await pool.query(
      `SELECT a.id, a.appointment_time, a.reason, a.status, a.virtual_requested, a.treatment_rate,
              t.name AS treatment_name,
              d.name AS doctor_name, c.name AS clinic_name,
              CASE WHEN a.status = 'confirmed' THEN 1 ELSE 0 END AS is_confirmed
       FROM appointments a
       JOIN treatments t ON t.id = a.treatment_id
       JOIN users d ON d.id = a.doctor_id
       JOIN users c ON c.id = a.clinic_id
       WHERE a.patient_id = ? AND a.appointment_time >= NOW()
       ORDER BY a.appointment_time ASC`,
      [patientId]
    );
  } catch (error) {
    if (!['ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_TABLE'].includes(error.code)) {
      throw error;
    }

    [rows] = await pool.query(
      `SELECT a.id, a.appointment_time, a.reason, a.status, a.virtual_requested,
              a.reason AS treatment_name,
              NULL AS treatment_rate,
              d.name AS doctor_name, c.name AS clinic_name,
              CASE WHEN a.status = 'confirmed' THEN 1 ELSE 0 END AS is_confirmed
       FROM appointments a
       JOIN users d ON d.id = a.doctor_id
       JOIN users c ON c.id = a.clinic_id
       WHERE a.patient_id = ? AND a.appointment_time >= NOW()
       ORDER BY a.appointment_time ASC`,
      [patientId]
    );
  }

  return rows;
}

export async function getPatientPrescriptions(patientId) {
  const [rows] = await pool.query(
    `SELECT p.id, p.appointment_id, p.medication_name, p.dosage, p.instructions, p.issued_at,
            d.name AS doctor_name
     FROM prescriptions p
     JOIN users d ON d.id = p.doctor_id
     WHERE p.patient_id = ?
     ORDER BY p.issued_at DESC`,
    [patientId]
  );

  return rows;
}

export async function getDoctorAppointments(doctorId) {
  let rows;
  try {
    [rows] = await pool.query(
      `SELECT a.id, a.appointment_time, a.reason, a.status, a.virtual_requested, a.treatment_rate,
              t.name AS treatment_name,
              p.name AS patient_name, c.name AS clinic_name
       FROM appointments a
       JOIN treatments t ON t.id = a.treatment_id
       JOIN users p ON p.id = a.patient_id
       JOIN users c ON c.id = a.clinic_id
       WHERE a.doctor_id = ?
       ORDER BY a.appointment_time ASC`,
      [doctorId]
    );
  } catch (error) {
    if (!['ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_TABLE'].includes(error.code)) {
      throw error;
    }

    [rows] = await pool.query(
      `SELECT a.id, a.appointment_time, a.reason, a.status, a.virtual_requested,
              a.reason AS treatment_name, NULL AS treatment_rate,
              p.name AS patient_name, c.name AS clinic_name
       FROM appointments a
       JOIN users p ON p.id = a.patient_id
       JOIN users c ON c.id = a.clinic_id
       WHERE a.doctor_id = ?
       ORDER BY a.appointment_time ASC`,
      [doctorId]
    );
  }
  return rows;
}

export async function getClinicAppointments(clinicId) {
  let rows;
  try {
    [rows] = await pool.query(
      `SELECT a.id, a.appointment_time, a.reason, a.status, a.virtual_requested, a.treatment_rate,
              t.name AS treatment_name,
              p.name AS patient_name, d.name AS doctor_name
       FROM appointments a
       JOIN treatments t ON t.id = a.treatment_id
       JOIN users p ON p.id = a.patient_id
       JOIN users d ON d.id = a.doctor_id
       WHERE a.clinic_id = ?
       ORDER BY a.appointment_time ASC`,
      [clinicId]
    );
  } catch (error) {
    if (!['ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_TABLE'].includes(error.code)) {
      throw error;
    }

    [rows] = await pool.query(
      `SELECT a.id, a.appointment_time, a.reason, a.status, a.virtual_requested,
              a.reason AS treatment_name, NULL AS treatment_rate,
              p.name AS patient_name, d.name AS doctor_name
       FROM appointments a
       JOIN users p ON p.id = a.patient_id
       JOIN users d ON d.id = a.doctor_id
       WHERE a.clinic_id = ?
       ORDER BY a.appointment_time ASC`,
      [clinicId]
    );
  }
  return rows;
}

export async function requestVirtualConsultation({ appointmentId, patientNotes }, requesterId) {
  const [appointments] = await pool.query('SELECT id, patient_id FROM appointments WHERE id = ? LIMIT 1', [appointmentId]);
  if (!appointments.length) {
    throw new AppError('Appointment not found.', 404);
  }

  if (appointments[0].patient_id !== requesterId) {
    throw new AppError('You can only request virtual consultation for your appointment.', 403);
  }

  await pool.query(
    `UPDATE appointments
     SET virtual_requested = 1, patient_notes = ?, status = 'virtual-requested'
     WHERE id = ?`,
    [patientNotes || null, appointmentId]
  );

  return { appointmentId, virtualRequested: true };
}

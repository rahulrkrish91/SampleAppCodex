import pool from '../config/db.js';

export async function createAppointment({ patientId, doctorId, clinicId, appointmentTime, reason }) {
  const [result] = await pool.query(
    `INSERT INTO appointments (patient_id, doctor_id, clinic_id, appointment_time, reason, status)
     VALUES (?, ?, ?, ?, ?, 'scheduled')`,
    [patientId, doctorId, clinicId, appointmentTime, reason]
  );

  return { id: result.insertId, patientId, doctorId, clinicId, appointmentTime, reason, status: 'scheduled' };
}

export async function getPatientAppointments(patientId) {
  const [rows] = await pool.query(
    `SELECT a.id, a.appointment_time, a.reason, a.status,
            d.name AS doctor_name, c.name AS clinic_name
     FROM appointments a
     JOIN users d ON d.id = a.doctor_id
     JOIN users c ON c.id = a.clinic_id
     WHERE a.patient_id = ? AND a.appointment_time >= NOW()
     ORDER BY a.appointment_time ASC`,
    [patientId]
  );

  return rows;
}

export async function requestVirtualConsultation({ appointmentId, patientNotes }) {
  await pool.query(
    `UPDATE appointments
     SET virtual_requested = 1, patient_notes = ?, status = 'virtual-requested'
     WHERE id = ?`,
    [patientNotes || null, appointmentId]
  );

  return { appointmentId, virtualRequested: true };
}

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({ doctorId: '', clinicId: '', appointmentTime: '', reason: '' });
  const [virtualAppointmentId, setVirtualAppointmentId] = useState('');

  async function loadDashboardData() {
    if (!user) return;

    const [{ data: dashboardData }, { data: doctorsData }, { data: clinicsData }] = await Promise.all([
      api.get(`/appointments/patient/${user.id}`),
      api.get('/users/doctors'),
      api.get('/users/clinics'),
    ]);

    setAppointments(dashboardData.appointments || []);
    setPrescriptions(dashboardData.prescriptions || []);
    setDoctors(doctorsData.doctors || []);
    setClinics(clinicsData.clinics || []);
  }

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const bookAppointment = async (event) => {
    event.preventDefault();
    await api.post('/appointments', { ...form, patientId: user.id });
    setForm({ doctorId: '', clinicId: '', appointmentTime: '', reason: '' });
    await loadDashboardData();
  };

  const requestVirtual = async (event) => {
    event.preventDefault();
    await api.post('/appointments/virtual-consultation', { appointmentId: Number(virtualAppointmentId) });
    setVirtualAppointmentId('');
    await loadDashboardData();
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <section className="card">
        <h3>Schedule appointment</h3>
        <form onSubmit={bookAppointment}>
          <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
            <option value="">Select doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
          <select value={form.clinicId} onChange={(e) => setForm({ ...form, clinicId: e.target.value })} required>
            <option value="">Select clinic</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
            ))}
          </select>
          <input type="datetime-local" value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} required />
          <input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <button type="submit">Book</button>
        </form>
      </section>

      <section className="card">
        <h3>Upcoming appointments</h3>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>
              <strong>{new Date(appointment.appointment_time).toLocaleString()}</strong> | Dr. {appointment.doctor_name} |{' '}
              {appointment.is_confirmed ? 'Confirmed' : 'Pending confirmation'}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Prescriptions</h3>
        {prescriptions.length === 0 ? (
          <p>No prescriptions available yet.</p>
        ) : (
          <ul>
            {prescriptions.map((prescription) => (
              <li key={prescription.id}>
                <strong>{prescription.medication_name}</strong> ({prescription.dosage}) by Dr. {prescription.doctor_name}
                <br />
                {prescription.instructions || 'No extra instructions'}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3>Request virtual consultation</h3>
        <form onSubmit={requestVirtual}>
          <input placeholder="Appointment ID" value={virtualAppointmentId} onChange={(e) => setVirtualAppointmentId(e.target.value)} />
          <button type="submit">Request</button>
        </form>
      </section>
    </div>
  );
}

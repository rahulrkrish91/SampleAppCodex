import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import M3Button from '../components/M3Button';
import M3Card from '../components/M3Card';

export default function DashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({ doctorId: '', clinicId: '', treatmentId: '', appointmentTime: '' });
  const [virtualAppointmentId, setVirtualAppointmentId] = useState('');

  async function loadDashboardData() {
    if (!user) return;

    const [{ data: dashboardData }, { data: doctorsData }, { data: clinicsData }, { data: treatmentsData }] = await Promise.all([
      api.get(`/appointments/patient/${user.id}`),
      api.get('/users/doctors'),
      api.get('/users/clinics'),
      api.get('/treatments'),
    ]);

    setAppointments(dashboardData.appointments || []);
    setPrescriptions(dashboardData.prescriptions || []);
    setDoctors(doctorsData.doctors || []);
    setClinics(clinicsData.clinics || []);
    setTreatments(treatmentsData.treatments || []);
  }

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const bookAppointment = async (event) => {
    event.preventDefault();
    await api.post('/appointments', { ...form, patientId: user.id });
    setForm({ doctorId: '', clinicId: '', treatmentId: '', appointmentTime: '' });
    await loadDashboardData();
  };

  const requestVirtual = async (event) => {
    event.preventDefault();
    await api.post('/appointments/virtual-consultation', { appointmentId: Number(virtualAppointmentId) });
    setVirtualAppointmentId('');
    await loadDashboardData();
  };

  return (
    <div className="grid gap-5">
      <h2>Patient Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      <M3Card>
        <h3 className="mb-3 text-2xl font-semibold text-m3Primary">Schedule appointment</h3>
        <form onSubmit={bookAppointment} className="grid gap-3">
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
          <select value={form.treatmentId} onChange={(e) => setForm({ ...form, treatmentId: e.target.value })} required>
            <option value="">Select treatment</option>
            {treatments.map((treatment) => (
              <option key={treatment.id} value={treatment.id}>
                {treatment.name} {treatment.rate !== null ? `($${Number(treatment.rate).toFixed(2)})` : ''}
              </option>
            ))}
          </select>
          <input type="datetime-local" value={form.appointmentTime} onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} required />
          <M3Button type="submit">Book</M3Button>
        </form>
      </M3Card>

      <M3Card>
        <h3 className="mb-3 text-2xl font-semibold text-m3Primary">Upcoming appointments</h3>
        <div className="grid gap-3">
          {appointments.map((appointment) => (
            <M3Card key={appointment.id} className="bg-m3SurfaceTint/35">
              <p><strong>{new Date(appointment.appointment_time).toLocaleString()}</strong></p>
              <p>Dr. {appointment.doctor_name}</p>
              <p>Treatment: {appointment.treatment_name}</p>
              <p>Rate: {appointment.treatment_rate !== null ? `$${Number(appointment.treatment_rate).toFixed(2)}` : 'N/A'}</p>
              <p>{appointment.is_confirmed ? 'Confirmed' : 'Pending confirmation'}</p>
            </M3Card>
          ))}
        </div>
      </M3Card>

      <M3Card>
        <h3 className="mb-3 text-2xl font-semibold text-m3Primary">Prescriptions</h3>
        {prescriptions.length === 0 ? (
          <p>No prescriptions available yet.</p>
        ) : (
          <div className="grid gap-3">
            {prescriptions.map((prescription) => (
              <M3Card key={prescription.id} className="bg-m3SurfaceTint/35">
                <p><strong>{prescription.medication_name}</strong> ({prescription.dosage})</p>
                <p>Doctor: {prescription.doctor_name}</p>
                <p>{prescription.instructions || 'No extra instructions'}</p>
              </M3Card>
            ))}
          </div>
        )}
      </M3Card>

      <M3Card>
        <h3 className="mb-3 text-2xl font-semibold text-m3Primary">Request virtual consultation</h3>
        <form onSubmit={requestVirtual} className="grid gap-3">
          <input placeholder="Appointment ID" value={virtualAppointmentId} onChange={(e) => setVirtualAppointmentId(e.target.value)} />
          <M3Button variant="outlined" type="submit">Request</M3Button>
        </form>
      </M3Card>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/appointments/doctor/me').then(({ data }) => setAppointments(data.appointments));
  }, []);

  return (
    <section className="card">
      <h2>Doctor Dashboard</h2>
      <ul>
        {appointments.map((item) => (
          <li key={item.id}>
            #{item.id} - {item.patient_name} at {item.clinic_name} ({item.status})
          </li>
        ))}
      </ul>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ClinicDashboardPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/appointments/clinic/me').then(({ data }) => setAppointments(data.appointments));
  }, []);

  return (
    <section className="card">
      <h2>Clinic Dashboard</h2>
      <ul>
        {appointments.map((item) => (
          <li key={item.id}>
            #{item.id} - Dr. {item.doctor_name} with {item.patient_name} ({item.status})
          </li>
        ))}
      </ul>
    </section>
  );
}

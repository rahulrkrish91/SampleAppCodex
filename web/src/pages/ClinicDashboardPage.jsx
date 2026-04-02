import React, { useEffect, useState } from 'react';
import api from '../services/api';
import M3Card from '../components/M3Card';

export default function ClinicDashboardPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/appointments/clinic/me').then(({ data }) => setAppointments(data.appointments));
  }, []);

  return (
    <M3Card>
      <h2 className="mb-4">Clinic Dashboard</h2>
      <div className="grid gap-3">
        {appointments.map((item) => (
          <M3Card key={item.id} className="bg-m3SurfaceTint/35">
            #{item.id} - Dr. {item.doctor_name} with {item.patient_name} ({item.status})
          </M3Card>
        ))}
      </div>
    </M3Card>
  );
}

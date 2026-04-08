import React, { useEffect, useState } from 'react';
import api from '../services/api';
import M3Card from '../components/M3Card';
import M3Button from '../components/M3Button';

export default function ClinicDashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [newTreatment, setNewTreatment] = useState({ name: '', rate: '' });
  const [editingTreatment, setEditingTreatment] = useState(null);

  async function load() {
    const [{ data: appointmentData }, { data: treatmentData }] = await Promise.all([
      api.get('/appointments/clinic/me'),
      api.get('/treatments/admin'),
    ]);
    setAppointments(appointmentData.appointments || []);
    setTreatments(treatmentData.treatments || []);
  }

  useEffect(() => {
    load();
  }, []);

  const addTreatment = async (event) => {
    event.preventDefault();
    await api.post('/treatments', {
      name: newTreatment.name,
      rate: newTreatment.rate === '' ? null : Number(newTreatment.rate),
    });
    setNewTreatment({ name: '', rate: '' });
    await load();
  };

  const saveTreatment = async (event) => {
    event.preventDefault();
    if (!editingTreatment) return;
    await api.put(`/treatments/${editingTreatment.id}`, {
      name: editingTreatment.name,
      rate: editingTreatment.rate === '' ? null : Number(editingTreatment.rate),
      active: Boolean(editingTreatment.active),
    });
    setEditingTreatment(null);
    await load();
  };

  const removeTreatment = async (treatmentId) => {
    await api.delete(`/treatments/${treatmentId}`);
    await load();
  };

  return (
    <div className="grid gap-4">
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

      <M3Card>
        <h3 className="mb-3 text-2xl font-semibold text-m3Primary">Treatment & Rate Administration</h3>
        <form className="mb-4 grid gap-3 md:grid-cols-3" onSubmit={addTreatment}>
          <input
            placeholder="Treatment name"
            value={newTreatment.name}
            onChange={(e) => setNewTreatment((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            placeholder="Rate (optional)"
            type="number"
            min="0"
            step="0.01"
            value={newTreatment.rate}
            onChange={(e) => setNewTreatment((prev) => ({ ...prev, rate: e.target.value }))}
          />
          <M3Button type="submit">Add Treatment</M3Button>
        </form>

        <div className="grid gap-3">
          {treatments.map((treatment) => (
            <M3Card key={treatment.id} className="bg-m3SurfaceTint/35">
              {editingTreatment?.id === treatment.id ? (
                <form className="grid gap-3 md:grid-cols-4" onSubmit={saveTreatment}>
                  <input
                    value={editingTreatment.name}
                    onChange={(e) => setEditingTreatment((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingTreatment.rate ?? ''}
                    onChange={(e) => setEditingTreatment((prev) => ({ ...prev, rate: e.target.value }))}
                  />
                  <select
                    value={editingTreatment.active ? '1' : '0'}
                    onChange={(e) => setEditingTreatment((prev) => ({ ...prev, active: e.target.value === '1' }))}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  <M3Button type="submit">Save</M3Button>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p>
                    <strong>{treatment.name}</strong> — {treatment.rate !== null ? `$${Number(treatment.rate).toFixed(2)}` : 'No rate'}
                    {' '}({treatment.active ? 'Active' : 'Inactive'})
                  </p>
                  <div className="flex gap-2">
                    <M3Button variant="outlined" type="button" onClick={() => setEditingTreatment(treatment)}>Edit</M3Button>
                    <M3Button variant="outlined" type="button" onClick={() => removeTreatment(treatment.id)}>Remove</M3Button>
                  </div>
                </div>
              )}
            </M3Card>
          ))}
        </div>
      </M3Card>
    </div>
  );
}

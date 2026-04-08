import React, { useContext, useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

export default function DashboardScreen() {
  const { session, logout } = useContext(AuthContext);
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({ doctorId: '', clinicId: '', treatmentId: '', appointmentTime: '' });
  const [virtualId, setVirtualId] = useState('');

  async function load() {
    if (!userId || !role) return;

    let url = `/appointments/patient/${userId}`;
    if (role === 'doctor') url = '/appointments/doctor/me';
    if (role === 'clinic') url = '/appointments/clinic/me';

    const requests = [api.get(url)];
    if (role === 'patient') {
      requests.push(api.get('/users/doctors'));
      requests.push(api.get('/users/clinics'));
      requests.push(api.get('/treatments'));
    }

    const responses = await Promise.all(requests);
    const dashboardData = responses[0].data;

    setAppointments(dashboardData.appointments || []);

    if (role === 'patient') {
      setPrescriptions(dashboardData.prescriptions || []);
      setDoctors(responses[1].data.doctors || []);
      setClinics(responses[2].data.clinics || []);
      setTreatments(responses[3].data.treatments || []);
    }
  }

  useEffect(() => {
    load();
  }, [userId, role]);

  const schedule = async () => {
    await api.post('/appointments', { ...appointmentForm, patientId: userId });
    setAppointmentForm({ doctorId: '', clinicId: '', treatmentId: '', appointmentTime: '' });
    await load();
  };

  const virtualRequest = async () => {
    await api.post('/appointments/virtual-consultation', { appointmentId: Number(virtualId) });
    await load();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{role?.toUpperCase()} Dashboard</Text>
      <Button title="Logout" onPress={logout} />

      {role === 'patient' && (
        <>
          <Text style={styles.label}>Doctor</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={appointmentForm.doctorId}
              onValueChange={(doctorId) => setAppointmentForm({ ...appointmentForm, doctorId })}
            >
              <Picker.Item label="Select doctor" value="" />
              {doctors.map((doctor) => (
                <Picker.Item key={doctor.id} label={doctor.name} value={String(doctor.id)} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Clinic</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={appointmentForm.clinicId}
              onValueChange={(clinicId) => setAppointmentForm({ ...appointmentForm, clinicId })}
            >
              <Picker.Item label="Select clinic" value="" />
              {clinics.map((clinic) => (
                <Picker.Item key={clinic.id} label={clinic.name} value={String(clinic.id)} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Treatment</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={appointmentForm.treatmentId}
              onValueChange={(treatmentId) => setAppointmentForm({ ...appointmentForm, treatmentId })}
            >
              <Picker.Item label="Select treatment" value="" />
              {treatments.map((treatment) => (
                <Picker.Item
                  key={treatment.id}
                  label={`${treatment.name}${treatment.rate !== null ? ` ($${Number(treatment.rate).toFixed(2)})` : ''}`}
                  value={String(treatment.id)}
                />
              ))}
            </Picker>
          </View>

          <TextInput style={styles.input} placeholder="2026-12-30T09:00:00.000Z" value={appointmentForm.appointmentTime} onChangeText={(appointmentTime) => setAppointmentForm({ ...appointmentForm, appointmentTime })} />
          <Button title="Schedule Appointment" onPress={schedule} />
        </>
      )}

      <Text style={styles.subtitle}>Upcoming Appointments</Text>
      {appointments.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text>Date: {new Date(item.appointment_time).toLocaleString()}</Text>
          <Text>Doctor: {item.doctor_name || 'N/A'}</Text>
          <Text>Treatment: {item.treatment_name || item.reason || 'N/A'}</Text>
          <Text>{item.is_confirmed ? 'Confirmed' : 'Pending confirmation'}</Text>
        </View>
      ))}

      {role === 'patient' && (
        <>
          <Text style={styles.subtitle}>Prescriptions</Text>
          {prescriptions.length === 0 ? (
            <View style={styles.card}>
              <Text>No prescriptions available yet.</Text>
            </View>
          ) : (
            prescriptions.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text>{item.medication_name} ({item.dosage})</Text>
                <Text>Doctor: {item.doctor_name}</Text>
                <Text>{item.instructions || 'No extra instructions'}</Text>
              </View>
            ))
          )}
        </>
      )}

      {role === 'patient' && (
        <>
          <TextInput style={styles.input} placeholder="Appointment ID for virtual consult" onChangeText={setVirtualId} />
          <Button title="Request Virtual Consultation" onPress={virtualRequest} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  label: { marginTop: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, padding: 8 },
  pickerWrap: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginTop: 8 },
});

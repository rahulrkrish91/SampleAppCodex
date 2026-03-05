import React, { useContext, useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

export default function DashboardScreen() {
  const { session, logout } = useContext(AuthContext);
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const [appointments, setAppointments] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({ doctorId: '', clinicId: '', appointmentTime: '', reason: '' });
  const [virtualId, setVirtualId] = useState('');

  async function load() {
    if (!userId || !role) return;

    let url = `/appointments/patient/${userId}`;
    if (role === 'doctor') url = '/appointments/doctor/me';
    if (role === 'clinic') url = '/appointments/clinic/me';

    const { data } = await api.get(url);
    setAppointments(data.appointments);
  }

  useEffect(() => {
    load();
  }, [userId, role]);

  const schedule = async () => {
    await api.post('/appointments', { ...appointmentForm, patientId: userId });
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
          <TextInput style={styles.input} placeholder="Doctor ID" onChangeText={(doctorId) => setAppointmentForm({ ...appointmentForm, doctorId })} />
          <TextInput style={styles.input} placeholder="Clinic ID" onChangeText={(clinicId) => setAppointmentForm({ ...appointmentForm, clinicId })} />
          <TextInput style={styles.input} placeholder="2026-12-30T09:00:00.000Z" onChangeText={(appointmentTime) => setAppointmentForm({ ...appointmentForm, appointmentTime })} />
          <TextInput style={styles.input} placeholder="Reason" onChangeText={(reason) => setAppointmentForm({ ...appointmentForm, reason })} />
          <Button title="Schedule Appointment" onPress={schedule} />
        </>
      )}

      <Text style={styles.subtitle}>Appointments</Text>
      {appointments.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text>#{item.id}</Text>
          <Text>Status: {item.status}</Text>
          <Text>{item.appointment_time}</Text>
        </View>
      ))}

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
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, padding: 8 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginTop: 8 },
});

import React, { useContext, useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

export default function DashboardScreen() {
  const { session } = useContext(AuthContext);
  const userId = session?.user?.id;
  const [appointments, setAppointments] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({ doctorId: '', clinicId: '', appointmentTime: '', reason: '' });
  const [virtualId, setVirtualId] = useState('');

  async function load() {
    if (!userId) return;
    const { data } = await api.get(`/appointments/patient/${userId}`);
    setAppointments(data.appointments);
  }

  useEffect(() => {
    load();
  }, [userId]);

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
      <Text style={styles.title}>Patient Dashboard</Text>
      <TextInput style={styles.input} placeholder="Doctor ID" onChangeText={(doctorId) => setAppointmentForm({ ...appointmentForm, doctorId })} />
      <TextInput style={styles.input} placeholder="Clinic ID" onChangeText={(clinicId) => setAppointmentForm({ ...appointmentForm, clinicId })} />
      <TextInput style={styles.input} placeholder="2026-12-30 09:00:00" onChangeText={(appointmentTime) => setAppointmentForm({ ...appointmentForm, appointmentTime })} />
      <TextInput style={styles.input} placeholder="Reason" onChangeText={(reason) => setAppointmentForm({ ...appointmentForm, reason })} />
      <Button title="Schedule Appointment" onPress={schedule} />

      <Text style={styles.subtitle}>Upcoming Appointments</Text>
      {appointments.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text>#{item.id} | Dr. {item.doctor_name}</Text>
          <Text>{item.appointment_time}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      ))}

      <TextInput style={styles.input} placeholder="Appointment ID for virtual consult" onChangeText={setVirtualId} />
      <Button title="Request Virtual Consultation" onPress={virtualRequest} />
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

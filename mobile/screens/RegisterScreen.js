import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [message, setMessage] = useState('');

  const register = async () => {
    try {
      await api.post('/auth/register', form);
      setMessage('Registered successfully. Please login.');
      navigation.navigate('Login');
    } catch (error) {
      setMessage(error.response?.data?.details?.join(', ') || error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dental Clinic Registration</Text>
      <TextInput style={styles.input} placeholder="Name" onChangeText={(name) => setForm({ ...form, name })} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={(email) => setForm({ ...form, email })} />
      <TextInput style={styles.input} placeholder="Password (min 8 chars)" secureTextEntry onChangeText={(password) => setForm({ ...form, password })} />
      <TextInput style={styles.input} placeholder="Role: patient|doctor|clinic" onChangeText={(role) => setForm({ ...form, role })} />
      <Button title="Register" onPress={register} />
      {!!message && <Text>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#bbb', padding: 8, borderRadius: 8 },
  title: { fontSize: 20, fontWeight: '600' },
});

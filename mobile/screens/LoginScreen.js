import React, { useContext, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import AuthContext from '../context/AuthContext';
import api, { setToken } from '../services/api';

export default function LoginScreen({ navigation }) {
  const { setSession } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const login = async () => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      setToken(data.token);
      setSession(data);
      navigation.navigate('Dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={(email) => setCredentials({ ...credentials, email })} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={(password) => setCredentials({ ...credentials, password })} />
      <Button title="Login" onPress={login} />
      {!!message && <Text>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#bbb', padding: 8, borderRadius: 8 },
  title: { fontSize: 20, fontWeight: '600' },
});

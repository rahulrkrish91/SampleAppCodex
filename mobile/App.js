import React, { useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import AuthContext from './context/AuthContext';
import api, { refreshWithToken, setToken } from './services/api';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) return;

      try {
        const refreshed = await refreshWithToken(refreshToken);
        setSession({ user: refreshed.user, refreshToken });
      } catch (error) {
        await SecureStore.deleteItemAsync('refreshToken');
      }
    };

    bootstrap();
  }, []);

  const logout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      // ignore logout errors
    }
    setToken(null);
    await SecureStore.deleteItemAsync('refreshToken');
    setSession(null);
  };

  const authContext = useMemo(
    () => ({
      session,
      setSession,
      logout,
    }),
    [session]
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={session ? 'Dashboard' : 'Register'}>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

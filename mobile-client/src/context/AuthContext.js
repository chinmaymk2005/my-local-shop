import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const data = await getCurrentUser(storedToken);
        setUser(data.user);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading token:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (mobile, password) => {
    const data = await loginUser(mobile, password);
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem('token', data.token);
    return data;
  };

  const register = async (name, mobile, password) => {
    const data = await registerUser(name, mobile, password, 'shop_owner');
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem('token', data.token);
    return data;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

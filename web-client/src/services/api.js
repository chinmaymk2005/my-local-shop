import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Auth APIs
export const loginUser = async (mobile, password) => {
  const response = await api.post('/auth/login', { mobile, password });
  return response.data;
};

export const registerUser = async (name, mobile, password, role) => {
  const response = await api.post('/auth/register', { name, mobile, password, role });
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Product APIs
export const getProducts = async (filters = {}) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Order APIs
export const createOrder = async (orderData, token) => {
  const response = await api.post('/orders', orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyOrders = async (token) => {
  const response = await api.get('/orders/my-orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;

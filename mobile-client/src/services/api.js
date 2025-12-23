import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Change for production

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

// Shop APIs
export const registerShop = async (shopData, token) => {
  const response = await api.post('/shops', shopData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyShop = async (token) => {
  const response = await api.get('/shops/my-shop', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Product APIs
export const getMyProducts = async (shopId, token) => {
  const response = await api.get(`/products?shopId=${shopId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Order APIs
export const getShopOrders = async (token) => {
  const response = await api.get('/orders/shop-orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const confirmOrder = async (orderId, token) => {
  const response = await api.put(`/orders/${orderId}/confirm`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const completeOrder = async (orderId, token) => {
  const response = await api.put(`/orders/${orderId}/complete`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;

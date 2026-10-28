import axios from 'axios';

const api = axios.create({baseURL: '/api'});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username: string, password: string) =>
  api.post('/login', {username, password});
export const logout = () => api.post('/logout');
export const getGoods = () => api.get('/goods');
export const getOrders = () => api.get('/orders');
export const createOrder = (data: unknown) => api.post('/orders', data);

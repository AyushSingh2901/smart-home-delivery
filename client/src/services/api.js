import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartHomeToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const endpoints = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
  services: () => api.get('/services'),
  providers: (params) => api.get('/providers', { params }),
  bookings: () => api.get('/bookings'),
  createBooking: (payload) => api.post('/bookings', payload),
  updateBooking: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  order: (bookingId) => api.post('/payments/order', { bookingId }),
  verifyPayment: (payload) => api.post('/payments/verify', payload),
  analytics: () => api.get('/admin/analytics'),
  users: () => api.get('/admin/users'),
  adminProviders: () => api.get('/admin/providers'),
  adminPayments: () => api.get('/admin/payments'),
  messages: (bookingId) => api.get(`/chat/${bookingId}`),
  sendMessage: (bookingId, payload) => api.post(`/chat/${bookingId}`, payload),
  reviews: (providerId) => api.get(`/reviews/provider/${providerId}`),
  createReview: (payload) => api.post('/reviews', payload)
};

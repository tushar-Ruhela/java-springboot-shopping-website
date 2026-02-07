import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productAPI = {
  getAllProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (categoryId) => api.get(`/products?categoryId=${categoryId}`),
  searchProducts: (keyword) => api.get(`/products?search=${keyword}`),
};

export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getOrdersByEmail: (email) => api.get(`/orders?email=${email}`),
  getAllOrders: (params) => api.get('/orders', { params }),
 searchProducts: (keyword) =>
  api.get('/products/search', {
    params: { keyword }
  }),
  getOrderStatistics: () => api.get('/orders/stats'),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) => api.patch(`/orders/${id}/payment-status`, { paymentStatus }),
  updateTracking: (id, trackingData) => api.patch(`/orders/${id}/tracking`, trackingData),
};

export default api;

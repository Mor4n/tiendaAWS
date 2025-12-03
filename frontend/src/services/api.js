import axios from 'axios';
import { API_CONFIG } from '../config';

// 🐛 DEBUG: Mostrar la URL del API
console.log('🔧 API Configuration:', {
  baseURL: API_CONFIG.baseUrl,
  timestamp: new Date().toISOString()
});

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Productos =====
export const getProducts = async (category = null) => {
  const url = category ? `/products?category=${category}` : '/products';
  console.log('📦 Fetching products from:', `${API_CONFIG.baseUrl}${url}`);
  try {
    const response = await api.get(url);
    console.log('✅ Products loaded:', response.data.length, 'items');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching products:', {
      message: error.message,
      url: `${API_CONFIG.baseUrl}${url}`,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

// ===== Órdenes =====
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getUserOrders = async (userId) => {
  // El userId se obtiene del token JWT en el backend, no necesitamos pasarlo
  const response = await api.get('/orders');
  return response.data;
};

export default api;

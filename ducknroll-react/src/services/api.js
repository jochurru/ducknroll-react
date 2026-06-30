import axios from 'axios';
import { auth } from './firebase';

// URL del backend: lee de las variables de entorno de Vite o por defecto apunta al servidor local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el token Bearer JWT de Firebase en cada petición
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        // Obtener el token de Firebase (forzando actualización si es necesario)
        const token = await currentUser.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('❌ Error en el interceptor de Axios al obtener JWT Token:', error.message);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import './config/firebase.js'; // Inicializa Firebase Admin SDK

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración avanzada de CORS para producción
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Si no hay origen (ej. Postman) o no se ha configurado FRONTEND_URL, permitir todo
    if (!origin || !process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    // Permitir localhost, dominios autorizados y subdominios de Vercel
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('No permitido por la política de CORS de Duck\'n Roll'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev')); // Logger para registrar las peticiones HTTP en consola

// Ruta de estado general (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      backend: 'online',
      firebaseAdmin: 'initialized'
    }
  });
});

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contacto', contactRoutes);
app.use('/api/ordenes', orderRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: `Ruta no encontrada - ${req.method} ${req.originalUrl}`
  });
});

// Manejo centralizado de errores globales (500)
app.use((err, req, res, next) => {
  console.error('❌ Error no controlado en el servidor:', err);
  res.status(500).json({
    error: 'Ocurrió un error interno en el servidor. Por favor, intenta de nuevo más tarde.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend Duck'n Roll corriendo en el puerto ${PORT}`);
});

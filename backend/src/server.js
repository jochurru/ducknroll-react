import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import './config/firebase.js'; // Inicializa Firebase Admin SDK

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors());
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

app.use('/api/productos', productRoutes);
app.use('/api/auth', authRoutes);

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

import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Sanitizar la clave privada reemplazando los caracteres literales \n por saltos de línea reales.
// Esto previene fallos comunes de formato al desplegar en Render u otros servidores.
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('🔥 Firebase Admin SDK inicializado correctamente usando variables de entorno.');
  } else {
    // Si corre en Google Cloud Run, inicializa de forma nativa sin pasar credenciales explícitas (usa ADC)
    admin.initializeApp();
    console.log('🔥 Firebase Admin SDK inicializado correctamente usando credenciales nativas (ADC).');
  }
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin SDK:', error.message);
}

export const db = admin.firestore();
export const auth = admin.auth();

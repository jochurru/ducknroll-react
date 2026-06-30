import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
apiKey: "AIzaSyBIb0ojroM5OguSOPlqG-JwxowSjIpW1PY",
authDomain: "ducknrollremeras.firebaseapp.com",
projectId: "ducknrollremeras",
storageBucket: "ducknrollremeras.firebasestorage.app",
messagingSenderId: "957094409993",
appId: "1:957094409993:web:4efe5b0f845ec548a085d8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);  
export default app;
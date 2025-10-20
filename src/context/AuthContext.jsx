import { createContext, useContext, useState, useEffect } from 'react';
import { 
signInWithEmailAndPassword, 
createUserWithEmailAndPassword,
signOut,
onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth debe usarse dentro de AuthProvider');
}
return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

// Escuchar cambios en el estado de autenticación
useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
});

// Cleanup: dejar de escuchar cuando el componente se desmonte
return () => unsubscribe();
}, []);

// Función para hacer login
const login = async (email, password) => {
try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
} catch (error) {
    console.error('Error en login:', error);
    throw error;
}
};

// Función para registrarse
const register = async (email, password) => {
try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
} catch (error) {
    console.error('Error en registro:', error);
    throw error;
}
};

// Función para hacer logout
const logout = async () => {
try {
    await signOut(auth);
} catch (error) {
    console.error('Error en logout:', error);
    throw error;
}
};

// Valor que se compartirá
const value = {
user,           // Usuario actual (null si no está logueado)
loading,        // Si está verificando autenticación
login,          // Función para login
register,       // Función para registrarse
logout,         // Función para logout
isAuthenticated: !!user  // Boolean: true si hay usuario
};

return (
<AuthContext.Provider value={value}>
    {!loading && children}
</AuthContext.Provider>
);
};
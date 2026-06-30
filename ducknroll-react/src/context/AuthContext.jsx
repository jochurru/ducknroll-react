import { createContext, useContext, useState, useEffect } from 'react';
import { 
signInWithEmailAndPassword, 
createUserWithEmailAndPassword,
signOut,
onAuthStateChanged,
GoogleAuthProvider,
signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';

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
const [isAdmin, setIsAdmin] = useState(false);
const [loading, setLoading] = useState(true);

// Escuchar cambios en el estado de autenticación
useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setLoading(true); // Forzar estado de carga a true para evitar inconsistencias durante la consulta HTTP
    setUser(currentUser);
    if (currentUser) {
        try {
            const token = await currentUser.getIdToken(true);
            // Agregar marca de tiempo (?t=) en la URL para evitar cache de navegador
            const response = await api.get(`/auth/check-admin?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            console.error('❌ Error al verificar privilegios de administrador:', error.message);
            setIsAdmin(false);
        }
    } else {
        setIsAdmin(false);
    }
    setLoading(false); // Liberar carga solo tras finalizar la consulta de rol
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

// Función para hacer login con Google
const loginWithGoogle = async () => {
try {
    const provider = new GoogleAuthProvider();
    // Forzar la selección de cuenta si lo desea el usuario
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
} catch (error) {
    console.error('Error en login con Google:', error);
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

// Función para obtener token JWT de sesión activo
const getToken = async () => {
if (!auth.currentUser) return null;
return await auth.currentUser.getIdToken(true);
};

// Valor que se compartirá
const value = {
user,           // Usuario actual (null si no está logueado)
isAdmin,        // Boolean: true si el usuario logueado es admin
loading,        // Si está verificando autenticación
login,          // Función para login
register,       // Función para registrarse
loginWithGoogle,// Función para login con Google
logout,         // Función para logout
getToken,       // Función para obtener token
isAuthenticated: !!user  // Boolean: true si hay usuario
};

return (
<AuthContext.Provider value={value}>
    {!loading && children}
</AuthContext.Provider>
);
};
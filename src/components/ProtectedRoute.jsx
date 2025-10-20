import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
const { isAuthenticated, loading } = useAuth();

// Mientras verifica la autenticación, mostrar loading
if (loading) {
return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando autenticación...</p>
    </div>
    </div>
);
}

// Si no está autenticado, redirigir al login
if (!isAuthenticated) {
return <Navigate to="/login" replace />;
}

// Si está autenticado, mostrar el contenido
return children;
};

export default ProtectedRoute;
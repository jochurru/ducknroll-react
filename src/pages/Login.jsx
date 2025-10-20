import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
const [isLogin, setIsLogin] = useState(true); // true = Login, false = Registro
const [formData, setFormData] = useState({
email: '',
password: ''
});
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const { login, register } = useAuth();
const navigate = useNavigate();

const handleChange = (e) => {
setFormData({
    ...formData,
    [e.target.name]: e.target.value
});
};

const handleSubmit = async (e) => {
e.preventDefault();
setError('');
setLoading(true);

try {
    if (isLogin) {
    // Login
    await login(formData.email, formData.password);
    navigate('/'); // Redirigir al home
    } else {
    // Registro
    await register(formData.email, formData.password);
    navigate('/'); // Redirigir al home
    }
} catch (err) {
    console.error('Error:', err);
    
    // Mensajes de error más amigables
    if (err.code === 'auth/invalid-credential') {
    setError('Email o contraseña incorrectos');
    } else if (err.code === 'auth/email-already-in-use') {
    setError('Este email ya está registrado');
    } else if (err.code === 'auth/weak-password') {
    setError('La contraseña debe tener al menos 6 caracteres');
    } else if (err.code === 'auth/invalid-email') {
    setError('Email inválido');
    } else {
    setError('Ocurrió un error. Intentá nuevamente.');
    }
} finally {
    setLoading(false);
}
};

return (
<div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-12 px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
    {/* Logo */}
    <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-dark">
        <span>🦆</span>
        <span>Duck'n Roll</span>
        </Link>
        <p className="text-gray-600 mt-2">
        {isLogin ? 'Iniciá sesión para continuar' : 'Creá tu cuenta'}
        </p>
    </div>

    {/* Tabs */}
    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
        onClick={() => {
            setIsLogin(true);
            setError('');
        }}
        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            isLogin
            ? 'bg-white text-primary shadow'
            : 'text-gray-600 hover:text-dark'
        }`}
        >
        Iniciar Sesión
        </button>
        <button
        onClick={() => {
            setIsLogin(false);
            setError('');
        }}
        className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            !isLogin
            ? 'bg-white text-primary shadow'
            : 'text-gray-600 hover:text-dark'
        }`}
        >
        Registrarse
        </button>
    </div>

    {/* Error message */}
    {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {error}
        </div>
    )}

    {/* Formulario */}
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
        </label>
        <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="tu@email.com"
        />
        </div>

        <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contraseña
        </label>
        <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
        />
        </div>

        <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
        {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
        </button>
    </form>

    {/* Link de vuelta */}
    <div className="mt-6 text-center">
        <Link to="/" className="text-primary hover:underline">
        Volver al inicio
        </Link>
    </div>
    </div>
</div>
);
};

export default Login;
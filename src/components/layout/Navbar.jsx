import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
const { user, logout, isAuthenticated } = useAuth();
const { getTotalItems } = useCart();

const handleLogout = async () => {
try {
    await logout();
} catch (error) {
    console.error('Error al cerrar sesión:', error);
}
};

return (
<nav className="bg-dark text-white shadow-lg">
    <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold hover:text-accent transition-colors">
        <span>🦆</span>
        <span>Duck'n Roll</span>
        </Link>

        {/* Links de navegación */}
        <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="hover:text-accent transition-colors">
            Inicio
        </Link>
        <Link to="/productos" className="hover:text-accent transition-colors">
            Productos
        </Link>
        <Link to="/contacto" className="hover:text-accent transition-colors">
            Contacto
        </Link>
        
        {/* Si está autenticado */}
        {isAuthenticated ? (
            <>
            <Link to="/admin" className="hover:text-accent transition-colors">
                Admin
            </Link>
            <button 
                onClick={handleLogout}
                className="hover:text-accent transition-colors"
            >
                Cerrar Sesión
            </button>
            <span className="text-sm text-gray-300">
                {user?.email}
            </span>
            </>
        ) : (
            <Link to="/login" className="hover:text-accent transition-colors">
            Login
            </Link>
        )}

        {/* Carrito */}
        <Link 
            to="/carrito" 
            className="relative hover:text-accent transition-colors"
        >
            🛒
            {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
            </span>
            )}
        </Link>
        </div>
    </div>
    </div>
</nav>
);
};

export default Navbar;
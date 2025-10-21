import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
const { user, logout, isAuthenticated } = useAuth();
const { getTotalItems } = useCart();
const [isMenuOpen, setIsMenuOpen] = useState(false);

const handleLogout = async () => {
try {
    await logout();
    setIsMenuOpen(false);
} catch (error) {
    console.error('Error al cerrar sesión:', error);
}
};

const closeMenu = () => {
setIsMenuOpen(false);
};

return (
<nav className="bg-secondary text-accent shadow-lg sticky top-0 z-50">
    <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link 
        to="/" 
        onClick={closeMenu}
        className="flex items-center space-x-2 text-xl font-bold hover:text-primary transition-colors"
        >
        <span>🦆</span>
        <span>Duck'n Roll</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="hover:text-primary transition-colors font-semibold">
            Inicio
        </Link>
        <Link to="/productos" className="hover:text-primary transition-colors font-semibold">
            Productos
        </Link>
        <Link to="/contacto" className="hover:text-primary transition-colors font-semibold">
            Contacto
        </Link>
        
        {isAuthenticated ? (
            <>
            <Link to="/admin" className="hover:text-primary transition-colors font-semibold">
                Admin
            </Link>
            <button 
                onClick={handleLogout}
                className="hover:text-primary transition-colors font-semibold"
            >
                Cerrar Sesión
            </button>
            <span className="text-sm text-gray-light">
                {user?.email}
            </span>
            </>
        ) : (
            <Link to="/login" className="hover:text-primary transition-colors font-semibold">
            Login
            </Link>
        )}

        {/* Carrito */}
        <Link 
            to="/carrito" 
            className="relative hover:text-primary transition-colors"
        >
            <span className="text-2xl">🛒</span>
            {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {getTotalItems()}
            </span>
            )}
        </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-accent hover:text-primary transition-colors focus:outline-none"
        aria-label="Toggle menu"
        >
        {isMenuOpen ? (
            // X icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ) : (
            // Hamburger icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        )}
        </button>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
        <div className="md:hidden border-t border-gray-custom">
        <div className="py-4 space-y-4">
            <Link 
            to="/" 
            onClick={closeMenu}
            className="block hover:text-primary transition-colors font-semibold"
            >
            Inicio
            </Link>
            <Link 
            to="/productos" 
            onClick={closeMenu}
            className="block hover:text-primary transition-colors font-semibold"
            >
            Productos
            </Link>
            <Link 
            to="/contacto" 
            onClick={closeMenu}
            className="block hover:text-primary transition-colors font-semibold"
            >
            Contacto
            </Link>
            
            {isAuthenticated ? (
            <>
                <Link 
                to="/admin" 
                onClick={closeMenu}
                className="block hover:text-primary transition-colors font-semibold"
                >
                Admin
                </Link>
                <div className="text-sm text-gray-light py-2">
                {user?.email}
                </div>
                <button 
                onClick={handleLogout}
                className="block w-full text-left hover:text-primary transition-colors font-semibold"
                >
                Cerrar Sesión
                </button>
            </>
            ) : (
            <Link 
                to="/login" 
                onClick={closeMenu}
                className="block hover:text-primary transition-colors font-semibold"
            >
                Login
            </Link>
            )}

            {/* Carrito Mobile */}
            <Link 
            to="/carrito" 
            onClick={closeMenu}
            className="flex items-center justify-between hover:text-primary transition-colors font-semibold"
            >
            <span>Carrito</span>
            <div className="flex items-center space-x-2">
                <span className="text-2xl">🛒</span>
                {getTotalItems() > 0 && (
                <span className="bg-primary text-dark text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {getTotalItems()}
                </span>
                )}
            </div>
            </Link>
        </div>
        </div>
    )}
    </div>
</nav>
);
};

export default Navbar;
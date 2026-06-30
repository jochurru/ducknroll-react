import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/images/logo1.png';

const Navbar = () => {
const { user, logout, isAuthenticated, isAdmin } = useAuth();
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
        className="flex items-center space-x-2 font-retro hover:opacity-80 transition-opacity"
        >
        <img 
            src={logo} 
            alt="Duck'n Roll Logo" 
            className="h-10 w-auto"
        />
        <span className="text-base sm:text-xl">Duck'n Roll</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
        <NavLink to="/" end className={({ isActive }) => `hover:text-primary transition-all duration-200 font-semibold nav-link-underline ${isActive ? 'nav-link-active' : ''}`}>
            Inicio
        </NavLink>
        <NavLink to="/productos" className={({ isActive }) => `hover:text-primary transition-all duration-200 font-semibold nav-link-underline ${isActive ? 'nav-link-active' : ''}`}>
            Productos
        </NavLink>
        <NavLink to="/contacto" className={({ isActive }) => `hover:text-primary transition-all duration-200 font-semibold nav-link-underline ${isActive ? 'nav-link-active' : ''}`}>
            Contacto
        </NavLink>
        
        {isAuthenticated ? (
            <>
            {isAdmin && (
              <Link to="/admin" className="hover:text-primary transition-colors font-semibold">
                  Admin
              </Link>
            )}
            <button 
                onClick={handleLogout}
                className="hover:text-primary transition-colors font-semibold"
            >
                Cerrar Sesión
            </button>
            <span className="text-sm text-gray-light font-semibold">
                Hola, {user?.displayName || user?.email?.split('@')[0]} 👋
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
            className={`relative hover:text-primary transition-all duration-300 hover:scale-115 flex items-center ${getTotalItems() > 0 ? 'animate-cart-bounce' : ''}`}
        >
            <span className="text-2xl hover:rotate-12 transition-transform duration-300">🛒</span>
            {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-secondary shadow scale-105">
                {getTotalItems()}
            </span>
            )}
        </Link>
        </div>

        {/* Mobile: Carrito visible siempre en la barra + Botón burger */}
        <div className="md:hidden flex items-center gap-4">
          <Link 
            to="/carrito" 
            onClick={closeMenu}
            className={`relative hover:text-primary transition-all duration-300 flex items-center ${getTotalItems() > 0 ? 'animate-cart-bounce' : ''}`}
          >
            <span className="text-2xl">🛒</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-secondary shadow scale-105">
                {getTotalItems()}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-accent hover:text-primary transition-colors focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
    </div>

    {/* Mobile Menu — overlay + panel deslizable */}
    {isMenuOpen && (
        <>
          {/* Overlay semitransparente */}
          <div 
            className="md:hidden fixed inset-0 bg-black/40 z-40 top-[64px]"
            onClick={closeMenu}
          />
          <div className="md:hidden border-t border-gray-custom relative z-50 bg-secondary">
          <div className="py-2">
              <NavLink 
              to="/" 
              end
              onClick={closeMenu}
              className={({ isActive }) => `flex items-center px-4 py-3.5 hover:text-primary hover:bg-white/5 transition-colors font-semibold ${isActive ? 'text-primary border-l-4 border-primary pl-3' : ''}`}
              >
              Inicio
              </NavLink>
              <NavLink 
              to="/productos" 
              onClick={closeMenu}
              className={({ isActive }) => `flex items-center px-4 py-3.5 hover:text-primary hover:bg-white/5 transition-colors font-semibold ${isActive ? 'text-primary border-l-4 border-primary pl-3' : ''}`}
              >
              Productos
              </NavLink>
              <NavLink 
              to="/contacto" 
              onClick={closeMenu}
              className={({ isActive }) => `flex items-center px-4 py-3.5 hover:text-primary hover:bg-white/5 transition-colors font-semibold ${isActive ? 'text-primary border-l-4 border-primary pl-3' : ''}`}
              >
              Contacto
              </NavLink>
              
              {isAuthenticated ? (
              <>
                  {isAdmin && (
                    <Link 
                    to="/admin" 
                    onClick={closeMenu}
                    className="flex items-center px-4 py-3.5 hover:text-primary hover:bg-white/5 transition-colors font-semibold"
                    >
                    Admin
                    </Link>
                  )}
                  <div className="px-4 py-3 text-sm text-gray-light font-semibold border-t border-gray-custom/30 mt-1">
                  Hola, {user?.displayName || user?.email?.split('@')[0]} 👋
                  </div>
                  <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3.5 hover:text-primary hover:bg-white/5 transition-colors font-semibold text-red-400"
                  >
                  Cerrar Sesión
                  </button>
              </>
              ) : (
              <Link 
                  to="/login" 
                  onClick={closeMenu}
                  className="flex items-center px-4 py-3.5 hover:text-primary hover:bg-white/5 transition-colors font-semibold"
              >
                  Login
              </Link>
              )}
          </div>
          </div>
        </>
    )}
    </div>
</nav>
);
};

export default Navbar;
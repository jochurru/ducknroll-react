import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/images/logo1.png';
import { toastSuccess, toastError } from '../../utils/sweetalert';

const Footer = () => {
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);

const handleSubscribe = async (e) => {
e.preventDefault();

if (!email) {
    toastError('Ingresá tu email');
    return;
}

setLoading(true);

setTimeout(() => {
    toastSuccess('¡Suscrito! Gracias por unirte 🎉');
    setEmail('');
    setLoading(false);
}, 1000);
};

return (
<footer className="bg-secondary text-accent py-12 mt-auto border-t-4 border-primary">
    <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1 - Logo y descripción */}
        <div>
        <div className="flex items-center space-x-2 mb-4">
            <img 
            src={logo} 
            alt="Duck'n Roll Logo" 
            className="h-14 w-auto"
            />
            <h3 className="text-xl font-bold text-primary font-retro">
            Duck'n Roll
            </h3>
        </div>
        <p className="text-gray-light font-sans text-sm">
            Remeras con diseños exclusivos de cultura retro y gaming.
        </p>
        </div>

        {/* Columna 2 - Enlaces */}
        <div>
        <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
        <ul className="space-y-2">
            <li>
            <Link to="/" className="text-gray-light hover:text-primary transition-colors font-sans text-sm">
                Inicio
            </Link>
            </li>
            <li>
            <Link to="/productos" className="text-gray-light hover:text-primary transition-colors font-sans text-sm">
                Productos
            </Link>
            </li>
            <li>
            <Link to="/contacto" className="text-gray-light hover:text-primary transition-colors font-sans text-sm">
                Contacto
            </Link>
            </li>
        </ul>
        </div>

        {/* Columna 3 - Redes Sociales con íconos */}
        <div>
        <h4 className="text-lg font-semibold mb-4 border-b border-gray-custom pb-2 font-sans">Seguinos</h4>
        <div className="flex space-x-4">
            <a 
            href="https://facebook.com/tucuenta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-custom hover:bg-primary hover:text-dark text-accent p-3 rounded-full transition-all duration-300 hover:scale-115 hover:-rotate-12 shadow-md hover:shadow-lg"
            aria-label="Facebook"
            >
            <FaFacebookF className="w-5 h-5" />
            </a>
            <a 
            href="https://instagram.com/tucuenta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-custom hover:bg-primary hover:text-dark text-accent p-3 rounded-full transition-all duration-300 hover:scale-115 hover:rotate-12 shadow-md hover:shadow-lg"
            aria-label="Instagram"
            >
            <FaInstagram className="w-5 h-5" />
            </a>
            <a 
            href="https://twitter.com/tucuenta" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-custom hover:bg-primary hover:text-dark text-accent p-3 rounded-full transition-all duration-300 hover:scale-115 hover:-rotate-12 shadow-md hover:shadow-lg"
            aria-label="Twitter"
            >
            <FaTwitter className="w-5 h-5" />
            </a>
            <a 
            href="https://wa.me/5491136745252" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-115 hover:rotate-12 shadow-md hover:shadow-lg"
            aria-label="WhatsApp"
            >
            <FaWhatsapp className="w-5 h-5" />
            </a>
        </div>
        </div>

        {/* Columna 4 - Newsletter */}
        <div>
        <h4 className="text-lg font-semibold mb-4 border-b border-gray-custom pb-2 font-sans">Newsletter</h4>
        <p className="text-gray-light font-sans text-sm mb-3">
            ¡Recibí ofertas exclusivas y novedades semanales!
        </p>
        <form onSubmit={handleSubscribe} className="flex gap-1 bg-white p-1 rounded-lg border focus-within:ring-2 focus-within:ring-primary">
            <input 
            type="email" 
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-3 py-2 text-dark font-sans text-sm focus:outline-none bg-transparent"
            />
            <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-dark px-4 py-2 rounded-md font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
            {loading ? '...' : 'Suscribirme'}
            </button>
        </form>
        </div>
    </div>

    <div className="border-t border-gray-custom mt-8 pt-8 text-center text-gray-light">
        <p className="font-sans text-sm">&copy; 2025 Duck'n Roll. Todos los derechos reservados.</p>
    </div>
    </div>
</footer>
);
};

export default Footer;
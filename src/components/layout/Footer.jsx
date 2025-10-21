import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo1.png';
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-secondary text-accent py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Columna 1 */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <img 
                                src={logo} 
                                alt="Duck'n Roll Logo" 
                                className="h-14 w-auto"
                            />
                            <h3 className="text-xl font-retro text-primary">
                                Duck'n Roll
                            </h3>
                        </div>
                        <p className="text-gray-light">
                            Remeras con diseños exclusivos de cultura retro y gaming.
                        </p>
                    </div>

                    {/* Columna 2 */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-light hover:text-primary transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/productos" className="text-gray-light hover:text-primary transition-colors">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/contacto" className="text-gray-light hover:text-primary transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3 */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Redes Sociales</h4>
                        <div className="flex space-x-4">
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-400 transition-colors"
                                aria-label="Facebook"
                            >
                                <FaFacebook />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-400 transition-colors"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-400 transition-colors"
                                aria-label="Twitter"
                            >
                                <FaXTwitter />
                            </a>
                            <a href="https://youtube.com"
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-2xl hover:text-yellow-400 transition-colors">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-custom mt-8 pt-8 text-center text-gray-light">
                    <p>&copy; 2025 Duck'n Roll. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
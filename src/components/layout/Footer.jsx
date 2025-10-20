const Footer = () => {
return (
<footer className="bg-dark text-white py-8 mt-auto">
    <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna 1 */}
        <div>
        <h3 className="text-xl font-bold mb-4 text-accent">
            🦆 Duck'n Roll
        </h3>
        <p className="text-gray-300">
            Remeras con diseños exclusivos de cultura retro y gaming.
        </p>
        </div>

        {/* Columna 2 */}
        <div>
        <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
        <ul className="space-y-2">
            <li>
            <a href="/productos" className="text-gray-300 hover:text-accent transition-colors">
                Productos
            </a>
            </li>
            <li>
            <a href="/contacto" className="text-gray-300 hover:text-accent transition-colors">
                Contacto
            </a>
            </li>
        </ul>
        </div>

        {/* Columna 3 */}
        <div>
        <h4 className="text-lg font-semibold mb-4">Redes Sociales</h4>
        <div className="flex space-x-4">
            <a href="#" className="text-2xl hover:text-accent transition-colors">
            📘
            </a>
            <a href="#" className="text-2xl hover:text-accent transition-colors">
            📷
            </a>
            <a href="#" className="text-2xl hover:text-accent transition-colors">
            🐦
            </a>
        </div>
        </div>
    </div>

    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 Duck'n Roll. Todos los derechos reservados.</p>
    </div>
    </div>
</footer>
);
};

export default Footer;
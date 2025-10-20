import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
const { getImagePath } = useProducts();
const { addToCart, isInCart } = useCart();

const handleQuickAdd = (e) => {
e.preventDefault(); // Evitar que el Link se active
addToCart(product, 1);
alert(`${product.nombre} agregado al carrito`);
};

return (
<Link to={`/producto/${product.id}`}>
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow h-full flex flex-col">
    {/* Imagen */}
    <div className="h-64 bg-gray-100 overflow-hidden relative group">
        <img
        src={getImagePath(product.imagen)}
        alt={product.nombre}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Duck%27n+Roll';
        }}
        />
        
        {/* Badge si está en el carrito */}
        {isInCart(product.id) && (
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            En carrito
        </div>
        )}
    </div>

    {/* Información */}
    <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2">
        {product.nombre}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
        {product.descripcion}
        </p>

        <div className="flex items-center justify-between mt-auto">
        <span className="text-2xl font-bold text-primary">
            ${product.precio}
        </span>
        <button
            onClick={handleQuickAdd}
            className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
        >
            Agregar
        </button>
        </div>
    </div>
    </div>
</Link>
);
};

export default ProductCard;
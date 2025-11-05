import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { toastSuccess } from '../utils/sweetalert';

const ProductDetailPage = () => {
const { id } = useParams();
const navigate = useNavigate();
const { getProduct, getImagePath } = useProducts();
const { addToCart, isInCart } = useCart();

const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [quantity, setQuantity] = useState(1);

useEffect(() => {
window.scrollTo(0, 0);
const fetchProduct = async () => {
try {
    setLoading(true);
    const data = await getProduct(id);
    setProduct(data);
} catch (error) {
    console.error('Error al cargar producto:', error);
} finally {
    setLoading(false);
}
};

fetchProduct();
}, [id, getProduct]);

const handleAddToCart = () => {
addToCart(product, quantity);
toastSuccess(`${quantity} ${product.nombre}${quantity > 1 ? 's' : ''} agregado${quantity > 1 ? 's' : ''} al carrito 🛒`);
};

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
</div>
);
}

if (!product) {
return (
<div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
    <h2 className="text-2xl font-bold text-dark mb-4">
        Producto no encontrado
    </h2>
    <Link to="/productos" className="text-primary hover:underline">
        Volver a productos
    </Link>
    </div>
</div>
);
}

return (
<div className="min-h-screen bg-gray-light py-12">
<div className="container mx-auto px-4">
    <div className="mb-8 text-gray-custom">
    <Link to="/" className="hover:text-primary">Inicio</Link>
    {' > '}
    <Link to="/productos" className="hover:text-primary">Productos</Link>
    {' > '}
    <span className="text-dark">{product.nombre}</span>
    </div>

    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="bg-gray-light rounded-lg overflow-hidden">
        <img
            src={getImagePath(product.imagen)}
            alt={product.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x500?text=Duck%27n+Roll';
            }}
        />
        </div>

        <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-dark mb-4 font-retro">
            {product.nombre}
        </h1>

        <p className="text-4xl font-bold text-primary mb-6 font-retro">
            ${product.precio}
        </p>

        <p className="text-gray-custom mb-8 leading-relaxed font-sans">
            {product.descripcion}
        </p>

        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-custom mb-2">
            Cantidad:
            </label>
            <div className="flex items-center space-x-4">
            <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-light hover:bg-gray-custom hover:text-white w-10 h-10 rounded-lg font-bold transition-colors"
            >
                -
            </button>
            <span className="text-xl font-semibold w-12 text-center">
                {quantity}
            </span>
            <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-light hover:bg-gray-custom hover:text-white w-10 h-10 rounded-lg font-bold transition-colors"
            >
                +
            </button>
            </div>
        </div>

        <div className="space-y-4">
            <button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary-dark text-dark py-3 rounded-lg font-bold transition-colors"
            >
            {isInCart(product.id) ? 'Agregar más al carrito' : 'Agregar al carrito'}
            </button>
            <button
            onClick={() => navigate('/productos')}
            className="w-full bg-gray-light hover:bg-gray-custom hover:text-white text-dark py-3 rounded-lg font-bold transition-colors"
            >
            Seguir comprando
            </button>
        </div>
        </div>
    </div>
    </div>
</div>
</div>
);
};

export default ProductDetailPage;
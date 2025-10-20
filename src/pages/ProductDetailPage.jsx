import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
const { id } = useParams(); // Obtener el ID de la URL
const navigate = useNavigate();
const { getProduct, getImagePath } = useProducts();
const { addToCart, isInCart } = useCart();

const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [quantity, setQuantity] = useState(1);

useEffect(() => {
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
// Mostrar mensaje o redirigir al carrito
alert(`${product.nombre} agregado al carrito`);
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
<div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
    {/* Breadcrumb */}
    <div className="mb-8 text-gray-600">
        <Link to="/" className="hover:text-primary">Inicio</Link>
        {' > '}
        <Link to="/productos" className="hover:text-primary">Productos</Link>
        {' > '}
        <span className="text-dark">{product.nombre}</span>
    </div>

    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Imagen */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
            src={getImagePath(product.imagen)}
            alt={product.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=Duck%27n+Roll';
            }}
            />
        </div>

        {/* Información */}
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-dark mb-4">
            {product.nombre}
            </h1>

            <p className="text-4xl font-bold text-primary mb-6">
            ${product.precio}
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
            {product.descripcion}
            </p>

            {/* Selector de cantidad */}
            <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantidad:
            </label>
            <div className="flex items-center space-x-4">
                <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold"
                >
                -
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                {quantity}
                </span>
                <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold"
                >
                +
                </button>
            </div>
            </div>

            {/* Botones */}
            <div className="space-y-4">
            <button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors"
            >
                {isInCart(product.id) ? 'Agregar más al carrito' : 'Agregar al carrito'}
            </button>
            <button
                onClick={() => navigate('/productos')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-dark py-3 rounded-lg font-bold transition-colors"
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
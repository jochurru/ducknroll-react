import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const Cart = () => {
const { cart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
const { getImagePath } = useProducts();
const navigate = useNavigate();

const handleCheckout = () => {
if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
}
navigate('/checkout');
};

if (cart.length === 0) {
return (
    <div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-dark mb-4">
            Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
            Agregá productos para empezar a comprar
            </p>
            <Link
            to="/productos"
            className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors inline-block"
            >
            Ver Productos
            </Link>
        </div>
        </div>
    </div>
    </div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold text-dark mb-8">
        🛒 Mi Carrito
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-6">
                {/* Imagen */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={getImagePath(item.imagen)}
                    alt={item.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=?';
                    }}
                />
                </div>

                {/* Información */}
                <div className="flex-grow">
                <Link
                    to={`/producto/${item.id}`}
                    className="text-xl font-bold text-dark hover:text-primary transition-colors"
                >
                    {item.nombre}
                </Link>
                <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                    {item.descripcion}
                </p>
                <p className="text-2xl font-bold text-primary mt-2">
                    ${item.precio}
                </p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex flex-col items-end space-y-4">
                <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Eliminar del carrito"
                >
                    🗑️
                </button>

                <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-2">
                    <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-white hover:bg-gray-200 rounded font-bold transition-colors"
                    >
                    -
                    </button>
                    <span className="w-8 text-center font-semibold">
                    {item.quantity}
                    </span>
                    <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-white hover:bg-gray-200 rounded font-bold transition-colors"
                    >
                    +
                    </button>
                </div>

                <p className="text-lg font-semibold text-dark">
                    Subtotal: ${(parseFloat(item.precio) * item.quantity).toFixed(2)}
                </p>
                </div>
            </div>
            </div>
        ))}

        {/* Botón limpiar carrito */}
        <button
            onClick={() => {
            if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
                clearCart();
            }
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 text-dark py-3 rounded-lg font-semibold transition-colors"
        >
            🗑️ Vaciar Carrito
        </button>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-dark mb-6">
            Resumen del Pedido
            </h2>

            <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
                <span>Productos ({getTotalItems()})</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="font-semibold text-green-600">GRATIS</span>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-dark">
                <span>Total</span>
                <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                </div>
            </div>
            </div>

            <button
            onClick={handleCheckout}
            className="w-full bg-primary hover:bg-red-600 text-white py-4 rounded-lg font-bold text-lg transition-colors mb-4"
            >
            Finalizar Compra
            </button>

            <Link
            to="/productos"
            className="block text-center text-primary hover:underline font-semibold"
            >
            Seguir comprando
            </Link>

            {/* Info adicional */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Envío gratis a todo el país</span>
            </div>
            <div className="flex items-center space-x-2">
                <span>🔒</span>
                <span>Compra 100% segura</span>
            </div>
            <div className="flex items-center space-x-2">
                <span>↩️</span>
                <span>Cambios y devoluciones gratis</span>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
</div>
);
};

export default Cart;
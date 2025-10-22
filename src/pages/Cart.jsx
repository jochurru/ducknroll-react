import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { showConfirm, toastSuccess } from '../utils/sweetalert';

const Cart = () => {
const { cart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
const { getImagePath } = useProducts();
const navigate = useNavigate();

const handleCheckout = () => {
if (cart.length === 0) {
    return;
}
navigate('/checkout');
};

const handleClearCart = async () => {
const result = await showConfirm(
    '¿Vaciar el carrito?',
    'Se eliminarán todos los productos del carrito'
);

if (result.isConfirmed) {
    clearCart();
    toastSuccess('Carrito vaciado');
}
};

if (cart.length === 0) {
return (
    <div className="min-h-screen bg-gray-50 py-8 px-3 sm:px-6">
    <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
            Tu carrito está vacío
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Agregá productos para empezar a comprar
        </p>
        <Link
            to="/productos"
            className="bg-primary hover:bg-red-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-bold transition-colors inline-block"
        >
            Ver Productos
        </Link>
        </div>
    </div>
    </div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-6">
    <div className="max-w-6xl mx-auto">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-6 sm:mb-8">
        🛒 Mi Carrito
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">

            {/* Imagen */}
            <div className="flex justify-center items-center w-full sm:w-24 h-48 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                src={getImagePath(item.imagen)}
                alt={item.nombre}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=?'; }}
                />
            </div>

            {/* Información */}
            <div className="flex-grow w-full sm:w-auto">
                <Link
                to={`/producto/${item.id}`}
                className="text-lg sm:text-xl font-bold text-dark hover:text-primary transition-colors line-clamp-1"
                >
                {item.nombre}
                </Link>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {item.descripcion}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-primary mt-2">
                ${item.precio}
                </p>
            </div>

            {/* Controles de cantidad y subtotal */}
            <div className="flex flex-col items-start sm:items-end space-y-2 sm:space-y-4">
                <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Eliminar del carrito"
                >
                🗑️
                </button>

                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 py-1 sm:px-3 sm:py-2">
                <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-200 rounded font-bold transition-colors"
                >
                    -
                </button>
                <span className="w-6 sm:w-8 text-center font-semibold">{item.quantity}</span>
                <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 sm:w-8 sm:h-8 bg-white hover:bg-gray-200 rounded font-bold transition-colors"
                >
                    +
                </button>
                </div>

                <p className="text-sm sm:text-lg font-semibold text-dark">
                Subtotal: ${(parseFloat(item.precio) * item.quantity).toFixed(2)}
                </p>
            </div>
            </div>
        ))}

    {/* Botón limpiar carrito */}
        <button
        onClick={handleClearCart}
        className="w-full bg-gray-light hover:bg-gray-custom hover:text-white text-dark py-3 rounded-lg font-semibold transition-colors"
        >
        🗑️ Vaciar Carrito
        </button>
    </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:mb-6">
            Resumen del Pedido
            </h2>

            <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Productos ({getTotalItems()})</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Envío</span>
                <span className="font-semibold text-green-600">GRATIS</span>
            </div>

            <div className="border-t border-gray-200 pt-2 sm:pt-4">
                <div className="flex justify-between text-base sm:text-xl font-bold text-dark">
                <span>Total</span>
                <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                </div>
            </div>
            </div>

            <button
            onClick={handleCheckout}
            className="w-full bg-primary hover:bg-red-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors mb-3"
            >
            Finalizar Compra
            </button>

            <Link
            to="/productos"
            className="block text-center text-primary hover:underline font-semibold text-sm sm:text-base mb-4"
            >
            Seguir comprando
            </Link>

            <div className="space-y-2 text-xs sm:text-sm text-gray-600 border-t border-gray-200 pt-3 sm:pt-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
                <span>✅</span>
                <span>Envío gratis a todo el país</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
                <span>🔒</span>
                <span>Compra 100% segura</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
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

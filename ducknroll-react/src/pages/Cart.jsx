import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { showConfirm, toastSuccess } from '../utils/sweetalert';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const { getImagePath } = useProducts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const handleClearCart = async () => {
    const result = await showConfirm(
      '¿Vaciar el carrito?',
      'Se eliminarán todos los productos seleccionados.'
    );

    if (result.isConfirmed) {
      clearCart();
      toastSuccess('Carrito vaciado 🗑️');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
            <div className="text-6xl mb-6 animate-bounce" style={{ animationDuration: '3s' }}>🛒</div>
            <h2 className="text-2xl font-bold text-dark mb-3 font-retro text-sm leading-relaxed">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-custom mb-8 font-sans text-sm md:text-base leading-relaxed">
              Parece que todavía no agregaste ninguna remera a tu selección. ¡Explorá nuestro catálogo para empezar!
            </p>
            <Link
              to="/productos"
              className="bg-primary hover:bg-primary-dark text-dark px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-sm inline-block"
            >
              Ver Productos 👕
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-dark mb-8 font-retro">
          🛒 Mi Carrito ({getTotalItems()})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div 
                key={`${item.id}-${item.talleSeleccionado || 'default'}`} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:shadow-md transition-shadow"
              >
                {/* Imagen */}
                <div className="flex justify-center items-center w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                  <img
                    src={getImagePath(item.imagen)}
                    alt={item.nombre}
                    className="max-w-[85%] max-h-[85%] object-contain"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=?'; }}
                  />
                </div>

                {/* Información del producto */}
                <div className="flex-grow text-center sm:text-left">
                  <Link
                    to={`/producto/${item.id}`}
                    className="text-lg font-bold text-dark hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.nombre}
                  </Link>
                  <p className="text-gray-500 text-xs mt-1 font-sans line-clamp-2">
                    {item.descripcion}
                  </p>
                  {item.talleSeleccionado && (
                    <span className="inline-block bg-primary/20 text-dark text-xs font-bold font-sans px-2.5 py-0.5 rounded-full mt-2 border border-primary/30">
                      👕 Talle: {item.talleSeleccionado}
                    </span>
                  )}
                  <p className="text-xl font-bold text-dark mt-2 font-retro text-xs">
                    ${parseFloat(item.precio).toLocaleString('es-AR')}
                  </p>
                </div>

                {/* Controles de cantidad y precio */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <button
                    onClick={() => removeFromCart(item.id, item.talleSeleccionado)}
                    className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform p-1 order-2 sm:order-1"
                    title="Eliminar del carrito"
                  >
                    🗑️
                  </button>

                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1 border border-gray-200 order-1 sm:order-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.talleSeleccionado, item.quantity - 1)}
                      className="w-8 h-8 bg-white hover:bg-gray-200 text-dark rounded-md font-bold transition-all active:scale-90 flex items-center justify-center shadow-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-dark font-sans text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.talleSeleccionado, item.quantity + 1)}
                      className="w-8 h-8 bg-white hover:bg-gray-200 text-dark rounded-md font-bold transition-all active:scale-90 flex items-center justify-center shadow-sm"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-base font-bold text-dark font-sans mt-2 order-3">
                    Subtotal: <span className="text-primary font-retro text-xs">${(parseFloat(item.precio) * item.quantity).toLocaleString('es-AR')}</span>
                  </p>
                </div>
              </div>
            ))}

            {/* Acciones del carrito */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleClearCart}
                className="text-gray-custom hover:text-red-600 transition-colors font-semibold text-sm flex items-center gap-1.5"
              >
                🗑️ Vaciar todo el carrito
              </button>
              <Link
                to="/productos"
                className="text-primary hover:underline font-bold text-sm"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-dark mb-6 border-b pb-4">
                Resumen de Compra
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-custom text-sm font-sans">
                  <span>Productos ({getTotalItems()})</span>
                  <span className="font-semibold text-dark">${getTotalPrice().toLocaleString('es-AR')}</span>
                </div>

                <div className="flex justify-between text-gray-custom text-sm font-sans">
                  <span>Envío</span>
                  <span className="font-bold text-green-600">GRATIS</span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-xl font-bold text-dark">
                    <span>Total</span>
                    <span className="text-primary font-retro">${getTotalPrice().toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary-dark text-dark py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] retro-shadow-sm shadow-md"
              >
                Finalizar Compra 💳
              </button>

              <div className="space-y-3 text-xs text-gray-500 border-t border-gray-100 pt-6 mt-6 font-sans">
                <div className="flex items-center space-x-2">
                  <span>🚚</span>
                  <span className="font-semibold text-dark">Envío gratis prioritario a todo el país</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔒</span>
                  <span className="font-semibold text-dark">Transacciones seguras y encriptadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>↩️</span>
                  <span className="font-semibold text-dark">Cambios y devoluciones sin cargo por 30 días</span>
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

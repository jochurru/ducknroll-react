import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const Confirmation = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState(location.state?.orderId || '');
  const [orderData, setOrderData] = useState(location.state?.orderData || null);
  const [loading, setLoading] = useState(!location.state?.orderId);
  const [error, setError] = useState('');

  useEffect(() => {
    // Si ya viene de la navegación interna con el state
    if (location.state?.orderId) {
      clearCart();
      return;
    }

    // Si viene redireccionado de Mercado Pago
    const searchParams = new URLSearchParams(location.search);
    const idFromUrl = searchParams.get('orderId');

    if (idFromUrl) {
      setOrderId(idFromUrl);
      const fetchOrderDetails = async () => {
        try {
          const response = await api.get(`/ordenes/${idFromUrl}`);
          setOrderData(response.data);
          clearCart(); // Limpiamos carrito sólo al verificar que la orden ya existe en la BD
        } catch (err) {
          console.error('❌ Error al buscar la orden en confirmación:', err);
          setError('Tu pago fue procesado. Si el resumen no carga, revisá tu correo.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [location, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-200 max-w-sm flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <h2 className="text-lg font-bold text-dark font-sans">
            Cargando confirmación...
          </h2>
          <p className="text-gray-custom mt-2 font-sans text-xs">
            Buscando los detalles de tu compra.
          </p>
        </div>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-200 max-w-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-dark mb-4 font-retro text-xs leading-relaxed">
            No se encontró información del pedido
          </h2>
          <p className="text-gray-custom mb-6 font-sans text-sm">
            No pudimos recuperar los detalles del pedido solicitado. Si acabas de comprar, verifica tu bandeja de entrada o escribinos a WhatsApp.
          </p>
          <Link to="/" className="bg-primary hover:bg-primary-dark text-dark px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 text-center relative overflow-hidden">
          {/* Confeti estético flotante */}
          <div className="absolute top-0 inset-x-0 h-2 bg-primary"></div>

          {/* Ícono de éxito animado */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner animate-pulse">
            🎉
          </div>

          <h1 className="text-3xl font-bold text-dark mb-4 font-sans">
            ¡Pedido Confirmado!
          </h1>

          <p className="text-gray-custom mb-8 font-sans text-sm md:text-base leading-relaxed">
            ¡Muchas gracias por tu compra! Tu pedido ha sido registrado con éxito y ya estamos preparando tus remeras.
          </p>

          {/* ID del pedido */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-center shadow-inner">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Número de Pedido</p>
            <p className="text-2xl font-bold text-dark font-retro">#{orderId}</p>
          </div>

          {/* Detalles de la compra */}
          <div className="text-left mb-8 space-y-4 font-sans text-sm border-b pb-6 border-gray-100">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500">Enviar a:</span>
              <span className="font-semibold text-dark truncate max-w-[200px]">
                {orderData?.cliente?.nombre} {orderData?.cliente?.apellido}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-gray-500">Email:</span>
              <span className="font-semibold text-dark truncate max-w-[200px]">{orderData?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">Total abonado:</span>
              <span className="font-bold text-primary font-retro text-base">
                ${parseFloat(orderData?.total).toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Información de envío */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left flex items-start gap-3">
            <span className="text-2xl">📧</span>
            <p className="text-xs text-blue-800 leading-normal font-sans">
              Te enviamos una confirmación por correo a <strong>{orderData?.email}</strong>. Si no lo recibís en unos minutos, revisá tu carpeta de correo no deseado (Spam).
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <Link
              to="/productos"
              className="block w-full bg-primary hover:bg-primary-dark text-dark py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] retro-shadow-sm shadow-md"
            >
              Seguir Comprando 👕
            </Link>
            <Link
              to="/"
              className="block w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-custom py-4 rounded-xl font-bold text-base transition-all duration-200"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
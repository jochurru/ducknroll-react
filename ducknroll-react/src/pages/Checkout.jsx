import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { sendOrderEmail } from '../services/email';
import Swal from 'sweetalert2';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' }, replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: user?.email || '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    notas: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        email: formData.email,
        cliente: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal
        },
        productos: cart.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: parseFloat(item.precio),
          cantidad: item.quantity,
          subtotal: parseFloat(item.precio) * item.quantity
        })),
        total: getTotalPrice(),
        notas: formData.notas,
        fecha: new Date().toISOString()
      };

      await sendOrderEmail(orderData);

      const newOrderId = `DK${Date.now()}`;

      clearCart();

      // MOSTRAR SWEETALERT2 CON ANIMACIÓN
      await Swal.fire({
        icon: 'success',
        title: '¡Pedido Confirmado!',
        html: `
          <div class="text-center">
            <p class="text-gray-600 mb-2">Tu pedido ha sido procesado exitosamente</p>
            <p class="text-sm text-gray-500 mb-4">
              Número de pedido: <span class="font-bold" style="color: #FFC700;">#${newOrderId}</span>
            </p>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-green-800">
                Te enviamos un email de confirmación con todos los detalles de tu compra 📧
              </p>
            </div>
            <p class="text-gray-500 text-sm">
              ¡Muchas gracias por confiar en Duck'n Roll! 🦆
            </p>
          </div>
        `,
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'Ver detalles del pedido',
        allowOutsideClick: false,
        customClass: {
          popup: 'rounded-2xl shadow-xl border border-gray-150',
          title: 'font-retro text-xl pt-4',
          confirmButton: 'font-bold px-6 py-3 rounded-lg text-dark transition-all hover:scale-105 active:scale-95'
        },
        showClass: {
          popup: 'animate-fadeIn'
        }
      });

      navigate('/confirmacion', { 
        state: { 
          orderId: newOrderId,
          orderData 
        } 
      });

    } catch (error) {
      console.error('Error al procesar pedido:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar',
        text: 'Hubo un error al enviar tu pedido. Por favor, intentá nuevamente.',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-2xl shadow-xl',
          title: 'font-retro text-lg',
          confirmButton: 'font-bold px-6 py-3 rounded-lg text-dark'
        }
      });
      
      setError('Hubo un error al procesar tu pedido. Por favor, intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 text-sm text-gray-custom font-sans flex items-center gap-2">
          <Link to="/carrito" className="hover:text-primary transition-colors">🛒 Volver al carrito</Link>
        </div>

        <h1 className="text-3xl font-bold text-dark mb-8 font-retro">
          💳 Finalizar Compra
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-sans text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
              {/* Datos personales */}
              <div>
                <h2 className="text-xl font-bold text-dark mb-4 pb-2 border-b border-gray-100 font-sans">
                  1. Datos Personales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                      placeholder="Juan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                      placeholder="Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección de envío */}
              <div>
                <h2 className="text-xl font-bold text-dark mb-4 pb-2 border-b border-gray-100 font-sans">
                  2. Dirección de Envío
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                      Dirección Completa *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                      placeholder="Calle Falsa 123, Depto 4B"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                        placeholder="Ciudad Autónoma de Buenos Aires"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                        placeholder="C1425AAA"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas adicionales */}
              <div>
                <h2 className="text-xl font-bold text-dark mb-4 pb-2 border-b border-gray-100 font-sans">
                  3. Notas Adicionales (Opcional)
                </h2>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm resize-none"
                  placeholder="Instrucciones especiales para el cartero (ej: tocar timbre de al lado, dejar en portería)..."
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-dark py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed retro-shadow-sm shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin text-lg">⏳</span>
                    Procesando compra...
                  </span>
                ) : (
                  '✅ Confirmar Compra'
                )}
              </button>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-24 space-y-6">
              <h2 className="text-xl font-bold text-dark mb-4 border-b pb-4">
                Resumen de Compra
              </h2>

              <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm items-start gap-4">
                    <span className="text-gray-custom font-sans text-xs flex-grow leading-snug">
                      {item.nombre} <strong className="text-dark">x{item.quantity}</strong>
                    </span>
                    <span className="font-semibold text-dark flex-shrink-0">
                      ${(parseFloat(item.precio) * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-gray-custom text-sm font-sans">
                  <span>Subtotal</span>
                  <span className="font-semibold text-dark">${getTotalPrice().toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-gray-custom text-sm font-sans">
                  <span>Envío</span>
                  <span className="font-bold text-green-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-dark border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span className="text-primary font-retro text-sm">${getTotalPrice().toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-6 space-y-3 text-xs text-gray-500 font-sans">
                <div className="flex items-center space-x-2">
                  <span>🔒</span>
                  <span className="font-semibold text-dark">Pago 100% Protegido</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📦</span>
                  <span className="font-semibold text-dark">Entrega garantizada por correo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
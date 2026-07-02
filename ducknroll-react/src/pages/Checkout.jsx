import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { sendOrderEmail } from '../services/email';
import Swal from 'sweetalert2';
import api from '../services/api';
import logo from '../assets/images/logo1.png';

const messages = [
  "Poniéndole Duck'n Roll a tu remera... 🦆",
  "Creando tu diseño... 🎨",
  "Rockeando tu estilo... 🎸",
  "Ajustando las costuras de la actitud... ✂️",
  "¡Todo listo! Tu remera ya está en camino... 🚚"
];

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

  // Estados para la pantalla de carga personalizada
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, 1500);
    } else {
      setCurrentMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return 95;
          }
          const diff = Math.random() * 12 + 4; // Incremento dinámico
          return Math.min(95, prev + diff);
        });
      }, 250);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

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
      const newOrderId = `DK${Date.now()}`;

      // Crear la preferencia de pago en el backend
      const response = await api.post('/payments/preferencia', {
        items: cart,
        cliente: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal
        },
        email: formData.email,
        notes: formData.notas,
        orderId: newOrderId
      });

      // Redirigir al checkout seguro de Mercado Pago (usando el sandbox de pruebas)
      const initPoint = response.data.sandbox_init_point || response.data.init_point;
      
      if (initPoint) {
        window.location.href = initPoint;
      } else {
        throw new Error('No se pudo obtener el enlace de pago de Mercado Pago.');
      }

    } catch (error) {
      console.error('Error al procesar pedido:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar',
        text: 'Hubo un error al iniciar el pago con Mercado Pago. Por favor, intentá nuevamente.',
        confirmButtonColor: '#FFD700',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-2xl shadow-xl',
          title: 'font-retro text-lg',
          confirmButton: 'font-bold px-6 py-3 rounded-lg text-dark'
        }
      });
      
      setError('Hubo un error al iniciar el pago. Por favor, intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 relative">
      {/* Pantalla de carga personalizada y animada */}
      {loading && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white text-dark rounded-3xl p-8 max-w-sm w-full border border-gray-150 shadow-2xl flex flex-col items-center justify-center text-center transform scale-100 transition-all duration-300">
            {/* Logo del pato flotando con brillo */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/25 rounded-full filter blur-xl animate-pulse"></div>
              <img 
                src={logo} 
                alt="Duck Logo" 
                className="h-24 w-auto relative animate-bounce select-none z-10" 
                style={{ animationDuration: '2.5s' }}
              />
            </div>
            
            {/* Título de la marca */}
            <h3 className="text-xl font-bold font-retro mb-2 text-dark">
              Duck'n Roll
            </h3>
            
            {/* Mensajes rotativos */}
            <p className="text-sm text-gray-custom font-sans h-10 flex items-center justify-center font-medium transition-all duration-300">
              {messages[currentMessageIndex]}
            </p>

            {/* Barra de progreso animada */}
            <div className="w-full bg-gray-100 rounded-full h-3.5 mt-4 mb-2 overflow-hidden p-0.5 border border-gray-200">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,199,0,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-custom uppercase tracking-wider font-sans">
              {Math.round(progress)}% procesado
            </span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-4 sm:mb-6 text-sm text-gray-custom font-sans flex items-center gap-2">
          <Link to="/carrito" className="hover:text-primary transition-colors">🛒 Volver al carrito</Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-6 sm:mb-8 font-retro">
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

          {/* Resumen del pedido - en mobile aparece PRIMERO */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 lg:sticky lg:top-24 space-y-6">
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
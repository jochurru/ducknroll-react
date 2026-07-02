import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.email) return;

    const fetchOrders = async () => {
      try {
        const response = await api.get(`/ordenes/usuario/${user.email}`);
        setOrders(response.data);
      } catch (err) {
        console.error('❌ Error al buscar órdenes del usuario:', err);
        setError('No pudimos cargar tu historial de pedidos. Por favor, intentá nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pagado':
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-green-100 text-green-800 border border-green-200 shadow-sm">
            Aprobado 💳
          </span>
        );
      case 'pendiente':
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
            Pendiente de Pago ⏳
          </span>
        );
      case 'entregado':
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
            Entregado 🚚
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-gray-100 text-gray-800 border border-gray-200 shadow-sm">
            {status || 'Procesando'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-200 max-w-sm flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <h2 className="text-lg font-bold text-dark font-sans">Cargando tus pedidos...</h2>
          <p className="text-gray-custom mt-2 text-xs font-sans">Buscando en nuestro backstage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-3 font-retro">
            Mis Pedidos
          </h1>
          <p className="text-gray-custom text-sm sm:text-base max-w-md mx-auto font-sans">
            Historial de tus remeras rockeadas y compras en Duck'n Roll.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-dark mb-3 font-sans">No tenés pedidos aún</h2>
            <p className="text-gray-custom text-sm mb-6 font-sans">
              ¡Tu placard está pidiendo actitud! Date una vuelta por el catálogo.
            </p>
            <Link
              to="/productos"
              className="inline-block bg-primary hover:bg-primary-dark text-dark px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm retro-shadow-sm"
            >
              Explorar Tienda 🛒
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Header de la tarjeta de orden */}
                <div className="bg-secondary text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-primary">
                  <div>
                    <span className="text-xs text-gray-light uppercase tracking-wider">Código de Pedido</span>
                    <h3 className="text-lg font-bold text-primary font-retro">#{order.id}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-light">
                      {order.fecha 
                        ? new Date(order.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                        : 'Fecha no disponible'}
                    </span>
                    {getStatusBadge(order.estado)}
                  </div>
                </div>

                {/* Body de la tarjeta de orden */}
                <div className="p-6">
                  {/* Lista de productos */}
                  <div className="divide-y divide-gray-100">
                    {order.productos?.map((product, index) => (
                      <div key={index} className="py-3 flex justify-between items-center gap-4 text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-dark truncate font-sans">{product.nombre}</p>
                          <p className="text-xs text-gray-custom mt-0.5">
                            Talle: <span className="font-semibold text-secondary">{product.talle || product.talleSeleccionado || '-'}</span>
                          </p>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <span className="text-gray-custom text-xs">x{product.cantidad}</span>
                          <span className="font-bold text-dark ml-4 font-sans">
                            ${Number(product.subtotal || 0).toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notas y Total */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {order.notas ? (
                      <div className="bg-yellow-50/50 border-l-2 border-primary rounded-r-lg p-2.5 max-w-md">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Notas del pedido:</span>
                        <p className="text-xs text-gray-custom italic mt-0.5">{order.notas}</p>
                      </div>
                    ) : (
                      <div />
                    )}
                    <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-6 self-end">
                      <span className="text-xs text-gray-custom font-bold uppercase tracking-wider">Total</span>
                      <span className="text-xl font-bold text-primary font-retro neon-text-yellow bg-secondary px-4 py-2 rounded-xl">
                        ${Number(order.total || 0).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

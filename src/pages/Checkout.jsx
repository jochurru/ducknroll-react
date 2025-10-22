import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { sendOrderEmail } from '../services/email';
import Swal from 'sweetalert2';

const Checkout = () => {
const { cart, getTotalPrice, clearCart } = useCart();
const { user } = useAuth();
const navigate = useNavigate();

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
    
    console.log('Pedido enviado correctamente');

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
            Número de pedido: <span class="font-bold" style="color: #FFD700;">#${newOrderId}</span>
        </p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-green-800">
            📧 Te enviamos un email de confirmación con todos los detalles
            </p>
        </div>
        <p class="text-gray-500 text-sm">
            ¡Muchas gracias por tu compra! 🦆
        </p>
        </div>
    `,
    confirmButtonColor: '#FFD700',
    confirmButtonText: 'Ver detalles del pedido',
    allowOutsideClick: false,
    customClass: {
        popup: 'rounded-lg',
        title: 'font-retro text-2xl',
        confirmButton: 'font-bold px-6 py-3 rounded-lg'
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
    
    // MOSTRAR ERROR CON SWEETALERT2
    Swal.fire({
    icon: 'error',
    title: 'Error al procesar',
    text: 'Hubo un error al procesar tu pedido. Por favor, intentá nuevamente.',
    confirmButtonColor: '#FFD700',
    confirmButtonText: 'Entendido',
    customClass: {
        title: 'font-retro text-xl',
        confirmButton: 'font-bold px-6 py-3 rounded-lg'
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
<div className="min-h-screen bg-gray-light py-12">
    <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold text-dark mb-8 font-retro">
        💳 Finalizar Compra
    </h1>

    {/* Mensaje de error */}
    {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
        </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            {/* Datos personales */}
            <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark mb-4">
                Datos Personales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2">
                    Nombre *
                </label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2">
                    Apellido *
                </label>
                <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2">
                    Email *
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2">
                    Teléfono *
                </label>
                <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+54 9 11 1234-5678"
                />
                </div>
            </div>
            </div>

            {/* Dirección de envío */}
            <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark mb-4">
                Dirección de Envío
            </h2>
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2">
                    Dirección *
                </label>
                <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Calle y número"
                />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-custom mb-2">
                    Ciudad *
                    </label>
                    <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-custom mb-2">
                    Código Postal *
                    </label>
                    <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                </div>
            </div>
            </div>

            {/* Notas adicionales */}
            <div className="mb-8">
            <h2 className="text-2xl font-bold text-dark mb-4">
                Notas Adicionales (opcional)
            </h2>
            <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Información adicional sobre tu pedido..."
            />
            </div>

            {/* Botón de envío */}
            <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-dark py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? (
                <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Procesando...
                </span>
            ) : (
                '✅ Confirmar Pedido'
            )}
            </button>
        </form>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-dark mb-6">
            Resumen del Pedido
            </h2>

            <div className="space-y-4 mb-6">
            {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-custom font-sans">
                    {item.nombre} x {item.quantity}
                </span>
                <span className="font-semibold">
                    ${(parseFloat(item.precio) * item.quantity).toFixed(2)}
                </span>
                </div>
            ))}
            </div>

            <div className="border-t border-gray-light pt-4 space-y-3">
            <div className="flex justify-between text-gray-custom">
                <span>Subtotal</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-custom">
                <span>Envío</span>
                <span className="font-semibold text-green-600">GRATIS</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-dark">
                <span>Total</span>
                <span className="text-primary font-retro">${getTotalPrice().toFixed(2)}</span>
            </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-light space-y-3 text-sm text-gray-custom">
            <div className="flex items-center space-x-2">
                <span>🔒</span>
                <span>Pago 100% seguro</span>
            </div>
            <div className="flex items-center space-x-2">
                <span>📦</span>
                <span>Envío gratis a todo el país</span>
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
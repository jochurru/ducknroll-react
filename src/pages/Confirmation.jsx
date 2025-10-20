import { useLocation, Link } from 'react-router-dom';

const Confirmation = () => {
const location = useLocation();
const { orderId, orderData } = location.state || {};

if (!orderId) {
return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-4">
        No se encontró información del pedido
        </h2>
        <Link to="/" className="text-primary hover:underline">
        Volver al inicio
        </Link>
    </div>
    </div>
);
}

return (
<div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
    <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Ícono de éxito */}
        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-3xl font-bold text-dark mb-4">
            ¡Pedido Confirmado!
        </h1>

        <p className="text-gray-600 mb-8">
            Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
        </p>

        {/* ID del pedido */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Número de Pedido</p>
            <p className="text-2xl font-bold text-primary">#{orderId}</p>
        </div>

        {/* Detalles */}
        <div className="text-left mb-8 space-y-4">
            <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold">{orderData?.email}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Total:</span>
            <span className="font-bold text-primary text-xl">
                ${orderData?.total?.toFixed(2)}
            </span>
            </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-800">
            📧 Te enviamos un email de confirmación a <strong>{orderData?.email}</strong> con los detalles de tu pedido.
            </p>
        </div>

        {/* Botones */}
        <div className="space-y-4">
            <Link
            to="/productos"
            className="block w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors"
            >
            Seguir Comprando
            </Link>
            <Link
            to="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-dark py-3 rounded-lg font-bold transition-colors"
            >
            Volver al Inicio
            </Link>
        </div>
        </div>
    </div>
    </div>
</div>
);
};

export default Confirmation;
import { useState } from 'react';

const Contact = () => {
const [formData, setFormData] = useState({
nombre: '',
email: '',
mensaje: ''
});

const [submitted, setSubmitted] = useState(false);

const handleChange = (e) => {
setFormData({
    ...formData,
    [e.target.name]: e.target.value
});
};

const handleSubmit = (e) => {
e.preventDefault();

// Aquí podrías enviar el formulario a una API o Firebase
console.log('Formulario enviado:', formData);

// Mostrar mensaje de éxito
setSubmitted(true);

// Resetear formulario
setFormData({
    nombre: '',
    email: '',
    mensaje: ''
});

// Ocultar mensaje después de 3 segundos
setTimeout(() => setSubmitted(false), 3000);
};

return (
<div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark mb-4">
            Contactanos
        </h1>
        <p className="text-gray-600 text-lg">
            ¿Tenés alguna pregunta? Escribinos y te respondemos a la brevedad.
        </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Información de contacto */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-dark mb-6">
            Información
            </h2>
            
            <div className="space-y-4">
            <div className="flex items-start space-x-3">
                <span className="text-2xl">📧</span>
                <div>
                <h3 className="font-semibold text-dark">Email</h3>
                <p className="text-gray-600">contacto@ducknroll.com</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                <h3 className="font-semibold text-dark">WhatsApp</h3>
                <p className="text-gray-600">+54 9 11 1234-5678</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <span className="text-2xl">📍</span>
                <div>
                <h3 className="font-semibold text-dark">Ubicación</h3>
                <p className="text-gray-600">Buenos Aires, Argentina</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <span className="text-2xl">⏰</span>
                <div>
                <h3 className="font-semibold text-dark">Horario</h3>
                <p className="text-gray-600">Lun a Vie: 9:00 - 18:00</p>
                </div>
            </div>
            </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-dark mb-6">
            Envianos un mensaje
            </h2>

            {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                ✅ Mensaje enviado correctamente. Te responderemos pronto!
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre
                </label>
                <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tu nombre"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
                </label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="tu@email.com"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensaje
                </label>
                <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Escribí tu mensaje aquí..."
                />
            </div>

            <button
                type="submit"
                className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors"
            >
                Enviar Mensaje
            </button>
            </form>
        </div>
        </div>
    </div>
    </div>
</div>
);
};

export default Contact;
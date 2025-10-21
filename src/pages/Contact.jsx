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

console.log('Formulario enviado:', formData);
setSubmitted(true);

setFormData({
    nombre: '',
    email: '',
    mensaje: ''
});

setTimeout(() => setSubmitted(false), 3000);
};

return (
<div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-0">
    <div className="max-w-5xl mx-auto">
    {/* Header */}
    <div className="text-center mb-8 sm:mb-12 px-2">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-retro text-dark mb-4 leading-tight break-words">
        Contactanos
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
        ¿Tenés alguna pregunta? Escribinos y te respondemos a la brevedad.
        </p>
    </div>

    {/* Grid principal */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-12">
        
        {/* Información de contacto */}
        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg text-center sm:text-left">
        <h2 className="text-lg sm:text-2xl font-bold text-dark mb-6">
            Información
        </h2>
        
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-3">
            <span className="text-2xl">📧</span>
            <div>
                <h3 className="font-semibold text-dark">Email</h3>
                <p className="text-gray-600 text-sm sm:text-base">contacto@ducknroll.com</p>
            </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-3">
            <span className="text-2xl">📱</span>
            <div>
                <h3 className="font-semibold text-dark">WhatsApp</h3>
                <p className="text-gray-600 text-sm sm:text-base">+54 9 11 1234-5678</p>
            </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-3">
            <span className="text-2xl">📍</span>
            <div>
                <h3 className="font-semibold text-dark">Ubicación</h3>
                <p className="text-gray-600 text-sm sm:text-base">Buenos Aires, Argentina</p>
            </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-3">
            <span className="text-2xl">⏰</span>
            <div>
                <h3 className="font-semibold text-dark">Horario</h3>
                <p className="text-gray-600 text-sm sm:text-base">Lun a Vie: 9:00 - 18:00</p>
            </div>
            </div>
        </div>
        </div>

        {/* Formulario */}
        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-lg sm:text-2xl font-bold text-dark mb-6">
            Envianos un mensaje
        </h2>

        {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-sm sm:text-base text-center sm:text-left">
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

    {/* Botón flotante WhatsApp */}
    <a
    href="https://wa.me/5491136745252"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-transform transform hover:scale-110 z-50"
    aria-label="Chat por WhatsApp"
    >
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-6 h-6 sm:w-7 sm:h-7"
    >
        <path d="M12.04 2C6.56 2 2.09 6.47 2.09 11.95c0 2.11.56 4.14 1.63 5.95L2 22l4.26-1.66c1.73.95 3.68 1.45 5.78 1.45 5.48 0 9.95-4.47 9.95-9.95S17.52 2 12.04 2zm0 18.15c-1.79 0-3.52-.48-5.03-1.38l-.36-.21-2.53.99.94-2.59-.23-.38a8.18 8.18 0 01-1.26-4.35c0-4.5 3.66-8.16 8.16-8.16s8.16 3.66 8.16 8.16-3.66 8.16-8.16 8.16zm4.47-6.04c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12s-.64.8-.78.96c-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.1-.5.1-.1.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.86-.2-.48-.41-.42-.56-.43l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.9 2.39 1.02 2.55.12.16 1.77 2.71 4.29 3.8.6.26 1.07.41 1.44.52.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.17.21-.56.21-1.04.15-1.14-.06-.1-.23-.16-.48-.28z" />
    </svg>
    </a>
</div>
);
};

export default Contact;

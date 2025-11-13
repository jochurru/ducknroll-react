import { useState, useEffect } from 'react';
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
const [formData, setFormData] = useState({
nombre: '',
email: '',
mensaje: ''
});

const [submitted, setSubmitted] = useState(false);

useEffect(() => {
window.scrollTo(0, 0);
}, []);

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
<div className="min-h-screen bg-gray-light py-12">
    <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark mb-4 font-retro">
            Contactanos
        </h1>
        <p className="text-gray-custom text-lg font-sans">
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
                <FaEnvelope className="text-primary text-xl mt-1" />
                <div>
                <h3 className="font-semibold text-dark">Email</h3>
                <p className="text-gray-custom font-sans">contacto@ducknroll.com</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <FaWhatsapp className="text-green-500 text-xl mt-1" />
                <div>
                <h3 className="font-semibold text-dark">WhatsApp</h3>
                <a 
                    href="https://wa.me/5491112345678"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-custom font-sans hover:text-primary transition-colors"
                >
                    +54 9 11 1234-5678
                </a>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary text-xl mt-1" />
                <div>
                <h3 className="font-semibold text-dark">Ubicación</h3>
                <p className="text-gray-custom font-sans">Buenos Aires, Argentina</p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <FaClock className="text-primary text-xl mt-1" />
                <div>
                <h3 className="font-semibold text-dark">Horario</h3>
                <p className="text-gray-custom font-sans">Lun a Vie: 9:00 - 18:00</p>
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
                <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                Nombre
                </label>
                <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                placeholder="Tu nombre"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                Email
                </label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                placeholder="tu@email.com"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                Mensaje
                </label>
                <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-sans"
                placeholder="Escribí tu mensaje aquí..."
                />
            </div>

            <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-dark py-3 rounded-lg font-bold transition-colors"
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
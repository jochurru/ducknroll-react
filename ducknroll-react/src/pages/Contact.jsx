import { useState, useEffect } from 'react';
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { toastSuccess, toastError } from '../utils/sweetalert';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contacto', {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje
      });

      toastSuccess('¡Mensaje enviado! Te responderemos muy pronto ✉️');
      setSubmitted(true);
      setFormData({ nombre: '', email: '', mensaje: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error al enviar contacto:', error);
      toastError(
        error?.response?.data?.error ||
        'No pudimos enviar tu mensaje. Intentá de nuevo o escribinos por WhatsApp.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark mb-4 font-retro">
            📞 Contacto
          </h1>
          <p className="text-gray-custom text-lg font-sans max-w-md mx-auto">
            ¿Tenés alguna consulta o necesitas ayuda con un talle? ¡Comunicate con nosotros!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Información de contacto */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-6 font-sans">
                Atención al Cliente
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-yellow-100 text-primary p-3 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-5 h-5 text-dark" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm font-sans">Email Oficial</h3>
                    <p className="text-gray-custom text-sm font-sans mt-0.5">contacto@ducknroll.com</p>
                  </div>
                </div>

                {/* Whatsapp */}
                <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 text-green-600 p-3 rounded-lg flex items-center justify-center">
                    <FaWhatsapp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm font-sans">WhatsApp Soporte</h3>
                    <a 
                      href="https://wa.me/5491136745252"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-custom text-sm font-sans hover:text-primary transition-colors font-semibold mt-0.5 block"
                    >
                      +54 9 11 3674-5252
                    </a>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-yellow-100 text-primary p-3 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-dark" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm font-sans">Ubicación</h3>
                    <p className="text-gray-custom text-sm font-sans mt-0.5">Buenos Aires, Argentina</p>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="bg-yellow-100 text-primary p-3 rounded-lg flex items-center justify-center">
                    <FaClock className="w-5 h-5 text-dark" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark text-sm font-sans">Horario de Atención</h3>
                    <p className="text-gray-custom text-sm font-sans mt-0.5">Lunes a Viernes de 9:00 a 18:00 hs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 text-xs text-gray-500 font-sans leading-relaxed">
              💡 <strong>¿Sabías qué?</strong> Podés realizar el cambio de tu prenda sin cargo durante los primeros 30 días si el talle no es el correcto.
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-dark mb-6 font-sans">
              Envianos un Mensaje
            </h2>

            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 text-sm font-sans">
                ✓ ¡Mensaje enviado con éxito! Te contactaremos a la brevedad.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm"
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-custom uppercase mb-2 font-sans">
                  Tu Mensaje
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-sans shadow-sm"
                  placeholder="Escribí tu consulta detalladamente aquí..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-dark py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] retro-shadow-sm shadow-md"
              >
                {loading ? 'Enviando...' : 'Enviar Mensaje ✉️'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
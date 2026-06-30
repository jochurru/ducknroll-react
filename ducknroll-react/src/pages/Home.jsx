import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import logo from '../assets/images/logo1.png';
import { FaPalette, FaTshirt, FaTruck } from 'react-icons/fa';

const Home = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 6);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Premium */}
      <section className="bg-secondary text-accent py-20 relative overflow-hidden border-b-4 border-primary">
        {/* Resplandor radial de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Badge Flotante Promocional */}
          <div className="inline-block bg-primary text-dark font-bold text-xs uppercase px-4 py-1.5 rounded-full mb-6 tracking-widest neon-glow-yellow">
            🚚 ¡Envío gratis en compras mayores a $20.000! 🚚
          </div>

          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="Duck'n Roll Logo" 
              className="h-52 w-auto animate-bounce hover:scale-105 transition-transform duration-300 pointer-events-auto cursor-pointer"
              style={{ animationDuration: '4s' }}
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-retro tracking-wide leading-tight neon-text-yellow text-primary">
            Duck'n Roll
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-light font-sans leading-relaxed">
            Remeras de alta gama con diseños exclusivos inspirados en la cultura retro, rock y el gaming. ¡Vestite con actitud!
          </p>

          <Link 
            to="/productos"
            className="bg-primary hover:bg-primary-dark text-dark px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 retro-shadow"
          >
            Explorar Catálogo 🚀
          </Link>

          {/* Estadísticas de Confianza en el Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto pt-10 border-t border-gray-custom">
            <div>
              <p className="text-3xl font-bold text-primary font-retro">+10k</p>
              <p className="text-xs text-gray-light font-sans mt-1">Prendas Vendidas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary font-retro">100%</p>
              <p className="text-xs text-gray-light font-sans mt-1">Algodón Premium</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary font-retro">4.9★</p>
              <p className="text-xs text-gray-light font-sans mt-1">Valoración Media</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary font-retro">24/7</p>
              <p className="text-xs text-gray-light font-sans mt-1">Soporte Express</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark font-retro">
              🔥 Destacados
            </h2>
            <p className="text-gray-custom font-sans max-w-md mx-auto">
              Nuestras prendas más vendidas y los diseños más solicitados de esta semana.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/productos"
              className="bg-secondary hover:bg-dark text-accent px-10 py-4 rounded-lg font-bold transition-all duration-300 retro-shadow-sm border border-gray-custom inline-block"
            >
              Ver Toda la Colección
            </Link>
          </div>
        </div>
      </section>

      {/* Sección Ventajas */}
      <section className="py-16 bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-dark font-retro">
            ¿Por qué Duck'n Roll?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <div className="p-8 bg-gray-50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-gray-200 group">
              <div className="w-16 h-16 bg-yellow-100 text-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-yellow-200">
                <FaPalette className="w-7 h-7 text-dark" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-sans text-dark">Diseños Exclusivos</h3>
              <p className="text-gray-custom font-sans text-sm leading-relaxed">
                Ilustraciones originales hechas por artistas independientes. Diseños retro y gaming que no vas a ver en otro lado.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-gray-200 group">
              <div className="w-16 h-16 bg-yellow-100 text-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-yellow-200">
                <FaTshirt className="w-7 h-7 text-dark" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-sans text-dark">Calidad Premium</h3>
              <p className="text-gray-custom font-sans text-sm leading-relaxed">
                Estampado de alta durabilidad sobre tela 100% de algodón peinado. Textura suave al tacto y calce impecable.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-gray-200 group">
              <div className="w-16 h-16 bg-yellow-100 text-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner border border-yellow-200">
                <FaTruck className="w-7 h-7 text-dark" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-sans text-dark">Envíos a Todo el País</h3>
              <p className="text-gray-custom font-sans text-sm leading-relaxed">
                Despacho inmediato a través de correo prioritario. Seguimiento online para que sepas en todo momento dónde está tu pedido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Testimonios (Social Proof) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark font-retro">
              💬 Lo Que Dicen
            </h2>
            <p className="text-gray-custom font-sans max-w-md mx-auto">
              Nuestra comunidad de patos rockeros y gamers nos respalda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200 relative flex flex-col justify-between">
              <div>
                <div className="text-primary text-xl mb-3">★★★★★</div>
                <p className="text-gray-custom font-sans text-sm italic mb-6">
                  "El diseño de la remera de Mario es espectacular, los colores son súper vivos y la tela de algodón se siente increíble al tacto. Llegó a Córdoba en 3 días. ¡Recomiendo!"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t pt-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-dark font-sans text-sm shadow-sm">
                  SG
                </div>
                <div>
                  <h4 className="font-bold text-sm text-dark font-sans">Seba G.</h4>
                  <p className="text-xs text-gray-500 font-sans">Comprador verificado</p>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200 relative flex flex-col justify-between">
              <div>
                <div className="text-primary text-xl mb-3">★★★★★</div>
                <p className="text-gray-custom font-sans text-sm italic mb-6">
                  "Súper conforme con la compra. La atención fue excelente, me guiaron con los talles y me quedó pintada. El estampado aguantó un montón de lavados y sigue intacto."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t pt-4">
                <div className="w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center font-bold font-sans text-sm shadow-sm">
                  LM
                </div>
                <div>
                  <h4 className="font-bold text-sm text-dark font-sans">Leo M.</h4>
                  <p className="text-xs text-gray-500 font-sans">Comprador verificado</p>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-200 relative flex flex-col justify-between">
              <div>
                <div className="text-primary text-xl mb-3">★★★★★</div>
                <p className="text-gray-custom font-sans text-sm italic mb-6">
                  "¡Me encantó la estética del packaging y el pato de hule de regalo! El diseño es de muy buena calidad. Se nota el amor que le ponen al proyecto. 10/10."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t pt-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-dark font-sans text-sm shadow-sm">
                  FR
                </div>
                <div>
                  <h4 className="font-bold text-sm text-dark font-sans">Flor R.</h4>
                  <p className="text-xs text-gray-500 font-sans">Comprador verificado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
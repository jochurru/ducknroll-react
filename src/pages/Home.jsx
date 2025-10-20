import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
const { products, loading } = useProducts();

// Mostrar solo los primeros 6 productos en el home
const featuredProducts = products.slice(0, 6);

return (
<div className="min-h-screen">
    {/* Hero Section */}
    <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
    <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
        🦆 Duck'n Roll
        </h1>
        <p className="text-xl md:text-2xl mb-8">
        Remeras con diseños exclusivos de cultura retro y gaming
        </p>
        <Link 
        to="/productos"
        className="bg-white text-dark px-8 py-3 rounded-lg font-bold text-lg hover:bg-accent hover:text-white transition-colors inline-block"
        >
        Ver todos los productos
        </Link>
    </div>
    </section>

    {/* Productos destacados */}
    <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-dark">
        Productos Destacados
        </h2>

        {loading ? (
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
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
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors inline-block"
        >
            Ver más productos
        </Link>
        </div>
    </div>
    </section>

    {/* Sección Sobre Nosotros */}
    <section className="py-16 bg-white">
    <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-dark">
        ¿Por qué Duck'n Roll?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-6">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Diseños Exclusivos</h3>
            <p className="text-gray-600">
            Cada remera tiene un diseño único inspirado en la cultura retro y gaming.
            </p>
        </div>
        <div className="p-6">
            <div className="text-5xl mb-4">👕</div>
            <h3 className="text-xl font-bold mb-2">Alta Calidad</h3>
            <p className="text-gray-600">
            100% algodón orgánico. Comodidad y durabilidad garantizada.
            </p>
        </div>
        <div className="p-6">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Envío Rápido</h3>
            <p className="text-gray-600">
            Enviamos a todo el país. Recibí tu remera en pocos días.
            </p>
        </div>
        </div>
    </div>
    </section>
</div>
);
};

export default Home;
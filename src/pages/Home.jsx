import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import logo from '../assets/images/logo1.png';

const Home = () => {
const { products, loading } = useProducts();
const featuredProducts = products.slice(0, 6);

useEffect(() => {
window.scrollTo(0, 0);
}, []);

return (
<div className="min-h-screen">
    {/* Hero Section */}
    <section className="bg-gradient-to-br from-primary to-primary-dark text-dark py-20">
    <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
        <img 
            src={logo} 
            alt="Duck'n Roll Logo" 
            className="h-52 w-auto"
        />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 font-retro">
        Duck'n Roll
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-sans">
        Remeras con diseños exclusivos de cultura retro y gaming
        </p>
        <Link 
        to="/productos"
        className="bg-secondary text-accent px-8 py-3 rounded-lg font-bold text-lg hover:bg-dark transition-colors inline-block"
        >
        Ver todos los productos
        </Link>
    </div>
    </section>

    {/* Productos destacados */}
    <section className="py-16 bg-gray-light">
    <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-dark font-retro">
        Productos Destacados
        </h2>

        {loading ? (
        // SKELETON LOADING
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
            <ProductCardSkeleton key={i} />
            ))}
        </div>
        ) : (
        // PRODUCTOS
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        )}

        <div className="text-center mt-12">
        <Link 
            to="/productos"
            className="bg-primary hover:bg-primary-dark text-dark px-8 py-3 rounded-lg font-bold transition-colors inline-block"
        >
            Ver más productos
        </Link>
        </div>
    </div>
    </section>

    {/* Sección Sobre Nosotros */}
    <section className="py-16 bg-white">
    <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-dark font-retro">
        ¿Por qué Duck'n Roll?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-6">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Diseños Exclusivos</h3>
            <p className="text-gray-custom font-sans">
            Cada remera tiene un diseño único inspirado en la cultura retro y gaming.
            </p>
        </div>
        <div className="p-6">
            <div className="text-5xl mb-4">👕</div>
            <h3 className="text-xl font-bold mb-2">Alta Calidad</h3>
            <p className="text-gray-custom font-sans">
            100% algodón orgánico. Comodidad y durabilidad garantizada.
            </p>
        </div>
        <div className="p-6">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Envío Rápido</h3>
            <p className="text-gray-custom font-sans">
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
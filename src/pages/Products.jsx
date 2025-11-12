import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

const Products = () => {
const { products, loading } = useProducts();
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
window.scrollTo(0, 0);
}, []);

const filteredProducts = products.filter(product =>
product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
<div className="min-h-screen bg-gray-light py-12">
    <div className="container mx-auto px-4">
    <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-dark mb-4 font-retro">
        Nuestros Productos
        </h1>
        <p className="text-gray-custom text-lg font-sans">
        Explorá nuestra colección completa de remeras
        </p>
    </div>

    <div className="max-w-xl mx-auto mb-12">
        <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary font-sans"
        />
    </div>

    {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
            <ProductCardSkeleton key={i} />
        ))}
        </div>
    ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-xl text-gray-custom font-sans">
            No se encontraron productos que coincidan con "{searchTerm}"
        </p>
        <button
            onClick={() => setSearchTerm('')}
            className="mt-6 bg-primary hover:bg-primary-dark text-dark px-6 py-2 rounded-lg font-bold transition-colors"
        >
            Limpiar búsqueda
        </button>
        </div>
    ) : (
        <>
        <div className="mb-6 text-gray-custom font-sans">
            Mostrando {filteredProducts.length} de {products.length} productos
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        </>
    )}
    </div>
</div>
);
};

export default Products;
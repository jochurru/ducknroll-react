import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
const { products, loading } = useProducts();
const [searchTerm, setSearchTerm] = useState('');

// Filtrar productos por búsqueda
const filteredProducts = products.filter(product =>
product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
<div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-12">
        <h1 className="text-4xl font-retro text-dark mb-4">
        Nuestros Productos
        </h1>
        <p className="text-gray-600 text-lg">
        Explorá nuestra colección completa de remeras
        </p>
    </div>

    {/* Buscador */}
    <div className="max-w-xl mx-auto mb-12">
        <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>

    {/* Lista de productos */}
    {loading ? (
        <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando productos...</p>
        </div>
    ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
        <p className="text-xl text-gray-600">
            No se encontraron productos que coincidan con "{searchTerm}"
        </p>
        </div>
    ) : (
        <>
        <div className="mb-6 text-gray-600">
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
import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

const Products = () => {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState('relevancia');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Función para categorizar dinámicamente según palabras clave
  const getProductCategory = (product) => {
    const text = (product.nombre + ' ' + product.descripcion).toLowerCase();
    if (text.includes('mario') || text.includes('zelda') || text.includes('gamer') || text.includes('sonic') || text.includes('pacman') || text.includes('game') || text.includes('nes') || text.includes('consol')) {
      return 'Gaming';
    }
    if (text.includes('rock') || text.includes('banda') || text.includes('music') || text.includes('metal') || text.includes('roll') || text.includes('guitar')) {
      return 'Rock';
    }
    if (text.includes('retro') || text.includes('classic') || text.includes('arcade') || text.includes('vintage') || text.includes('pixel') || text.includes('90')) {
      return 'Retro';
    }
    return 'Geek';
  };

  // 1. Filtrar productos por búsqueda y categoría
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'Todas') {
      return matchesSearch;
    }
    
    if (selectedCategory === 'Ofertas') {
      return matchesSearch && parseFloat(product.precio) <= 15000;
    }

    const category = getProductCategory(product);
    return matchesSearch && category === selectedCategory;
  });

  // 2. Ordenar productos filtrados
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'precio-asc') {
      return parseFloat(a.precio) - parseFloat(b.precio);
    }
    if (sortBy === 'precio-desc') {
      return parseFloat(b.precio) - parseFloat(a.precio);
    }
    if (sortBy === 'nombre-asc') {
      return a.nombre.localeCompare(b.nombre);
    }
    // Relevancia / Defecto (por ID)
    return parseFloat(a.id) - parseFloat(b.id);
  });

  const categories = ['Todas', 'Gaming', 'Rock', 'Retro', 'Ofertas'];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-dark mb-4 font-retro">
            Nuestros Productos
          </h1>
          <p className="text-gray-custom text-lg font-sans max-w-md mx-auto">
            Explorá nuestra colección completa de remeras retro-gaming y rockeras de alta gama.
          </p>
        </div>

        {/* Barra de Filtros, Buscador y Ordenación */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Buscador */}
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="Buscar remeras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm transition-all"
              />
            </div>

            {/* Ordenación */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-sm font-semibold text-gray-custom font-sans whitespace-nowrap">
                Ordenar por:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-sans shadow-sm bg-white"
              >
                <option value="relevancia">Relevancia</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre-asc">Nombre (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Categorías (Tags) */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-dark font-bold shadow-sm neon-glow-yellow scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-custom'
                }`}
              >
                {category === 'Todas' ? '🌐 Todas' : category === 'Ofertas' ? '🏷️ Ofertas' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Listado de Productos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow border border-gray-200 max-w-xl mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-bold text-dark font-retro mb-2">No encontramos remeras</p>
            <p className="text-gray-custom font-sans mb-6">
              Intentá buscando con otras palabras clave o limpiando los filtros actuales.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="bg-primary hover:bg-primary-dark text-dark px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm"
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between text-gray-custom font-sans max-w-5xl mx-auto text-sm px-2">
              <span>Mostrando {sortedProducts.length} de {products.length} remeras</span>
              {selectedCategory !== 'Todas' && (
                <span className="bg-gray-100 text-xs px-3 py-1 rounded-full">
                  Filtro: <strong>{selectedCategory}</strong>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {sortedProducts.map(product => (
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
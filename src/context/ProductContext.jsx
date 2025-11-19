/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, getProductById } from '../services/mockapi';

// Crear el contexto
const ProductContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useProducts = () => {
const context = useContext(ProductContext);
if (!context) {
throw new Error('useProducts debe usarse dentro de ProductProvider');
}
return context;
};

// Proveedor del contexto
export const ProductProvider = ({ children }) => {
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Cargar productos al montar el componente
useEffect(() => {
fetchProducts();
}, []);

// Función para cargar todos los productos
const fetchProducts = async () => {
try {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setError(null);
} catch (err) {
    console.error('Error al cargar productos:', err);
    setError('No se pudieron cargar los productos');
} finally {
    setLoading(false);
}
};

// Función para obtener un producto por ID
const getProduct = async (id) => {
try {
    // Primero buscar en el estado local
    const localProduct = products.find(p => p.id === id);
    if (localProduct) return localProduct;

    // Si no está, hacer petición a la API
    const product = await getProductById(id);
    return product;
} catch (err) {
    console.error('Error al obtener producto:', err);
    throw err;
}
};

// Función para obtener imagen (local o Firebase)
const getImagePath = (imagePath) => {
if (!imagePath) return null;

// Si es URL completa de Firebase
if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
}

// Si es ruta local, extraer el nombre del archivo
try {
    const fileName = imagePath.split('/').pop();
    return new URL(`../assets/images/${fileName}`, import.meta.url).href;
} catch (_error) {
    console.error('Error cargando imagen:', imagePath);
    return null;
}
};

// Valor que se compartirá en toda la app
const value = {
products,
loading,
error,
fetchProducts,
getProduct,
getImagePath
};

return (
<ProductContext.Provider value={value}>
    {children}
</ProductContext.Provider>
);
};
import axios from 'axios';

const SHEETDB_API = 'https://sheetdb.io/api/v1/xq4b11ihpz688';

// Función para obtener todos los productos
export const getProducts = async () => {
try {
const response = await axios.get(SHEETDB_API);
return response.data;
} catch (error) {
console.error('Error al obtener productos:', error);
throw error;
}
};

// Función para obtener un producto por ID
export const getProductById = async (id) => {
try {
const response = await axios.get(`${SHEETDB_API}/search?id=${id}`);
return response.data[0];
} catch (error) {
console.error('Error al obtener producto:', error);
throw error;
}
};

// Función mejorada para crear un nuevo producto
export const createProduct = async (productData) => {
try {
// Obtener todos los productos para calcular el próximo ID
const allProducts = await getProducts();

// Encontrar el ID más alto
const maxId = allProducts.reduce((max, product) => {
    const currentId = parseInt(product.id) || 0;
    return currentId > max ? currentId : max;
}, 0);

// Asignar el siguiente ID
const newId = maxId + 1;

// Agregar el ID al producto
const productWithId = {
    id: newId.toString(),
    ...productData
};

// Crear el producto en SheetDB
const response = await axios.post(SHEETDB_API, {
    data: productWithId
});

console.log('Producto creado con ID:', newId);
return response.data;
} catch (error) {
console.error('Error al crear producto:', error);
throw error;
}
};
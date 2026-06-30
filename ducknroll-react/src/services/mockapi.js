import axios from 'axios';

// URL de MockAPI con "articles"
const API_URL = 'https://690299f3b208b24affe69130.mockapi.io/api/dbduck/articles';

// Función para obtener todos los productos
export const getProducts = async () => {
try {
const response = await axios.get(API_URL);
console.log('Productos obtenidos de MockAPI:', response.data);
return response.data;
} catch (error) {
console.error('Error al obtener productos:', error);
throw error;
}
};

// Función para obtener un producto por ID
export const getProductById = async (id) => {
try {
const response = await axios.get(`${API_URL}/${id}`);
return response.data;
} catch (error) {
console.error('Error al obtener producto:', error);
throw error;
}
};

// Función para crear un nuevo producto
export const createProduct = async (productData) => {
try {
// MockAPI genera el ID automáticamente
const response = await axios.post(API_URL, productData);
console.log('Producto creado:', response.data);
return response.data;
} catch (error) {
console.error('Error al crear producto:', error);
throw error;
}
};

// Función para actualizar un producto
export const updateProduct = async (id, productData) => {
try {
const response = await axios.put(`${API_URL}/${id}`, productData);
console.log('Producto actualizado:', response.data);
return response.data;
} catch (error) {
console.error('Error al actualizar producto:', error);
throw error;
}
};

// Función para eliminar un producto
export const deleteProduct = async (id) => {
try {
const response = await axios.delete(`${API_URL}/${id}`);
console.log('Producto eliminado:', id);
return response.data;
} catch (error) {
console.error('Error al eliminar producto:', error);
throw error;
}
};
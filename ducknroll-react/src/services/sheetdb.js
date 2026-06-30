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
const allProducts = await getProducts();

const maxId = allProducts.reduce((max, product) => {
    const currentId = parseInt(product.id) || 0;
    return currentId > max ? currentId : max;
}, 0);

const newId = maxId + 1;

const productWithId = {
    id: newId.toString(),
    ...productData
};

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

// NUEVA: Función para actualizar un producto
export const updateProduct = async (id, productData) => {
try {
const response = await axios.patch(
    `${SHEETDB_API}/id/${id}`,
    { data: productData }
);
console.log('Producto actualizado:', id);
return response.data;
} catch (error) {
console.error('Error al actualizar producto:', error);
throw error;
}
};

// NUEVA: Función para eliminar un producto
export const deleteProduct = async (id) => {
try {
const response = await axios.delete(`${SHEETDB_API}/id/${id}`);
console.log('Producto eliminado:', id);
return response.data;
} catch (error) {
console.error('Error al eliminar producto:', error);
throw error;
}
};
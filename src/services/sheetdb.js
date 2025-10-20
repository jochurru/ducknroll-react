import axios from 'axios';

const SHEETDB_API = 'https://sheetdb.io/api/v1/xq4b11ihpz688';

export const getProducts = async () => {
try {
const response = await axios.get(SHEETDB_API);
return response.data;
} catch (error) {
console.error('Error al obtener productos:', error);
throw error;
}
};

export const getProductById = async (id) => {
try {
const response = await axios.get(`${SHEETDB_API}/search?id=${id}`);
return response.data[0];
} catch (error) {
console.error('Error al obtener producto:', error);
throw error;
}
};

export const createProduct = async (productData) => {
try {
const response = await axios.post(SHEETDB_API, { data: productData });
return response.data;
} catch (error) {
console.error('Error al crear producto:', error);
throw error;
}
};
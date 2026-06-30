import api from './api';

/**
 * Sube una imagen al backend (el cual la sube de forma segura a Cloudinary)
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - URL segura de Cloudinary devuelta por el backend
 */
export const uploadImage = async (file) => {
  try {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('La imagen no debe superar los 5MB');
    }

    // Crear un FormData
    const formData = new FormData();
    formData.append('imagen', file);

    console.log('Subiendo imagen a Cloudinary a través del servidor...');
    
    // Llamar al backend
    const response = await api.post('/productos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Imagen subida exitosamente:', response.data.imageUrl);
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    const errorMessage = error.response?.data?.error || error.message || 'Error al subir la imagen';
    throw new Error(errorMessage);
  }
};
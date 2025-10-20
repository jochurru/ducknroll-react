import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Sube una imagen a Firebase Storage
 * @param {File} file - Archivo de imagen
 * @param {string} folder - Carpeta donde guardar (default: 'images')
 * @returns {Promise<string>} - URL de la imagen subida
 */
export const uploadImage = async (file, folder = 'images') => {
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

// Crear nombre único para el archivo
const timestamp = Date.now();
const fileName = `${timestamp}_${file.name.replace(/\s/g, '-')}`;

// Crear referencia en Storage
const storageRef = ref(storage, `${folder}/${fileName}`);

// Subir archivo
console.log('Subiendo imagen...');
await uploadBytes(storageRef, file);

// Obtener URL de descarga
const downloadURL = await getDownloadURL(storageRef);
console.log('Imagen subida exitosamente:', downloadURL);

return downloadURL;
} catch (error) {
console.error('Error al subir imagen:', error);
throw error;
}
};
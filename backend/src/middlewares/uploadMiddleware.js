import multer from 'multer';

// Guardar el archivo temporalmente en la memoria (buffer)
const storage = multer.memoryStorage();

// Validar que el archivo sea una imagen
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen válida (JPEG, PNG, WEBP, etc.)'), false);
  }
};

// Configurar multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Middleware helper para capturar el error de multer limpiamente
export const uploadSingleImage = (fieldName) => {
  const uploadMiddleware = upload.single(fieldName);
  
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          error: err.message || 'Error al procesar la carga de la imagen' 
        });
      }
      next();
    });
  };
};

// Middleware básico de multer exportado para uso directo en rutas
export default upload;

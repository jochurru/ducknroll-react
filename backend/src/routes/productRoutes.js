import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadImageController,
  migrateImagesToCloudinary
} from '../controllers/productsController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rutas Públicas (Cualquier visitante puede ver los productos)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rutas Protegidas (Solo Administradores Autenticados)
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);
router.post('/upload', requireAuth, requireAdmin, uploadSingleImage('imagen'), uploadImageController);
router.post('/migrate-images-to-cloudinary', requireAuth, requireAdmin, migrateImagesToCloudinary);

export default router;

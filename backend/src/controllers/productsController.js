import { db } from '../config/firebase.js';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';

const MOCKAPI_URL = 'https://690299f3b208b24affe69130.mockapi.io/api/dbduck/articles';

/**
 * Obtener todos los productos de Firestore.
 * Si la colección está vacía, realiza una migración inicial automática desde MockAPI.
 */
export const getAllProducts = async (req, res) => {
  try {
    const snapshot = await db.collection('productos').get();
    let products = [];

    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Migración automática si Firestore no tiene productos cargados
    if (products.length === 0) {
      console.log('🔄 Firestore se encuentra vacío. Iniciando migración inicial desde MockAPI...');
      try {
        const response = await axios.get(MOCKAPI_URL);
        const mockProducts = response.data;

        const batch = db.batch();
        mockProducts.forEach(prod => {
          const docRef = db.collection('productos').doc(prod.id.toString());
          batch.set(docRef, {
            nombre: prod.nombre,
            precio: Number(prod.precio) || 0,
            imagen: prod.imagen,
            descripcion: prod.descripcion || '',
            createdAt: new Date().toISOString()
          });
        });

        await batch.commit();
        console.log('✅ Migración automática masiva completada con éxito.');

        // Volver a leer Firestore para retornar la lista recién migrada
        const newSnapshot = await db.collection('productos').get();
        products = [];
        newSnapshot.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
        });
      } catch (migrationError) {
        console.error('⚠️ Error durante la migración de datos:', migrationError.message);
        // Retornamos array vacío si la migración externa falla, para no quebrar la app
      }
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('❌ Error en getAllProducts:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener la lista de productos.' });
  }
};

/**
 * Obtener un producto específico de Firestore por su ID de documento.
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('productos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'El producto solicitado no existe.' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error(`❌ Error en getProductById (ID: ${req.params.id}):`, error);
    res.status(500).json({ error: 'Error interno del servidor al buscar el producto.' });
  }
};

/**
 * Crear un nuevo producto en la colección 'productos' de Firestore.
 * Requiere rol de Administrador.
 */
export const createProduct = async (req, res) => {
  try {
    const { nombre, precio, imagen, descripcion, etiqueta } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || precio === undefined || !imagen) {
      return res.status(400).json({
        error: 'Petición inválida. Los campos "nombre", "precio" e "imagen" son obligatorios.'
      });
    }

    const newProduct = {
      nombre,
      precio: Number(precio),
      imagen,
      descripcion: descripcion || '',
      etiqueta: etiqueta || '',
      createdAt: new Date().toISOString()
    };

    // Agregar producto con ID auto-generado por Firestore
    const docRef = await db.collection('productos').add(newProduct);

    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error('❌ Error en createProduct:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar el producto.' });
  }
};

/**
 * Actualizar un producto existente en Firestore.
 * Requiere rol de Administrador.
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, imagen, descripcion, etiqueta } = req.body;

    const docRef = db.collection('productos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'No se puede actualizar. El producto no existe.' });
    }

    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (precio !== undefined) updateData.precio = Number(precio);
    if (imagen !== undefined) updateData.imagen = imagen;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (etiqueta !== undefined) updateData.etiqueta = etiqueta;
    updateData.updatedAt = new Date().toISOString();

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error(`❌ Error en updateProduct (ID: ${req.params.id}):`, error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el producto.' });
  }
};

/**
 * Eliminar un producto de Firestore.
 * Requiere rol de Administrador.
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('productos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'No se puede eliminar. El producto no existe.' });
    }

    await docRef.delete();
    res.status(200).json({ message: 'Producto eliminado correctamente de la base de datos.', id });
  } catch (error) {
    console.error(`❌ Error en deleteProduct (ID: ${req.params.id}):`, error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el producto.' });
  }
};

/**
 * Subir una imagen a Cloudinary.
 * Recibe el archivo en req.file (buffer), lo sube mediante stream y retorna el secure_url.
 */
export const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen.' });
    }

    // Subida mediante stream a Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ducknroll',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          console.error('❌ Error al subir imagen a Cloudinary:', error);
          return res.status(500).json({ error: 'Error al subir la imagen a la nube.' });
        }
        
        // Retornamos el secure_url
        res.status(200).json({ 
          imageUrl: result.secure_url 
        });
      }
    );

    // Escribimos el buffer del archivo en el stream de Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('❌ Error en uploadImageController:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la carga.' });
  }
};

/**
 * Migración masiva de imágenes de productos existentes a Cloudinary.
 * Filtra los productos cuyas imágenes no pertenezcan a Cloudinary y las sube una a una.
 */
export const migrateImagesToCloudinary = async (req, res) => {
  try {
    console.log('🔄 Iniciando migración masiva de imágenes a Cloudinary...');
    const snapshot = await db.collection('productos').get();
    const products = [];

    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Filtrar productos que no estén en Cloudinary
    const legacyProducts = products.filter(
      prod => prod.imagen && !prod.imagen.includes('cloudinary.com')
    );

    console.log(`📦 Encontrados ${legacyProducts.length} productos con imágenes legadas.`);

    let migrados = 0;
    const batch = db.batch();

    for (const prod of legacyProducts) {
      try {
        console.log(`☁️ Subiendo a Cloudinary: ${prod.nombre} (${prod.imagen})`);
        
        let sourceToUpload = prod.imagen;

        // Si la imagen es una ruta local en el frontend
        if (!prod.imagen.startsWith('http')) {
          // Extraer el nombre del archivo (ej: remera2.png o remera%201.png)
          const fileName = decodeURIComponent(prod.imagen.split('/').pop());
          const localPath = path.resolve('../ducknroll-react/src/assets/images', fileName);

          if (fs.existsSync(localPath)) {
            sourceToUpload = localPath;
            console.log(`📂 Imagen local detectada en frontend: ${localPath}`);
          } else {
            console.warn(`⚠️ Archivo local no encontrado en frontend: ${localPath}`);
            continue; // Si el archivo no existe, pasamos de largo para evitar error de Cloudinary
          }
        }
        
        // Subida de imagen (URL remota o ruta absoluta de archivo local)
        const uploadResult = await cloudinary.uploader.upload(sourceToUpload, {
          folder: 'ducknroll',
          resource_type: 'image'
        });

        const docRef = db.collection('productos').doc(prod.id);
        batch.update(docRef, {
          imagen: uploadResult.secure_url,
          updatedAt: new Date().toISOString()
        });

        migrados++;
      } catch (uploadError) {
        console.error(`⚠️ Error al migrar imagen de "${prod.nombre}":`, uploadError.message || uploadError);
        // Continuamos con el siguiente para no quebrar toda la migración
      }
    }

    if (migrados > 0) {
      await batch.commit();
      console.log(`✅ Se migraron exitosamente ${migrados} imágenes a Cloudinary.`);
    }

    res.status(200).json({
      message: 'Proceso de migración a Cloudinary finalizado.',
      procesados: legacyProducts.length,
      migradosConExito: migrados
    });
  } catch (error) {
    console.error('❌ Error en migrateImagesToCloudinary:', error);
    res.status(500).json({ error: 'Error interno del servidor durante la migración de imágenes.' });
  }
};

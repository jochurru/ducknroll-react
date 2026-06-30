import { auth, db } from '../config/firebase.js';

/**
 * Middleware para requerir autenticación en rutas protegidas.
 * Valida el token JWT enviado en la cabecera Authorization.
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso denegado. Se requiere un token de sesión válido en la cabecera de Autorización.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar token con el SDK de administración de Firebase
    const decodedToken = await auth.verifyIdToken(token);
    
    // Guardar los datos del usuario decodificado en el objeto req
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('❌ Error de validación de token JWT:', error.message);
    return res.status(401).json({
      error: 'Sesión inválida o expirada. Por favor, vuelve a iniciar sesión.'
    });
  }
};

/**
 * Middleware para requerir rol de Administrador.
 * Consulta Firestore en tiempo real para verificar el rol del usuario antes de permitir el paso.
 * Debe ejecutarse después de requireAuth.
 */
export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Acceso denegado. Usuario no autenticado.'
    });
  }

  const { uid, email } = req.user;
  const userEmail = email ? email.toLowerCase() : '';

  try {
    // Consultar el rol del usuario en la colección 'usuarios' de Firestore
    const userDoc = await db.collection('usuarios').doc(uid).get();

    if (!userDoc.exists) {
      console.warn(`⚠️ Intento de acceso administrativo por usuario sin registro en Firestore: ${userEmail}`);
      return res.status(403).json({
        error: 'Acceso prohibido. Se requieren privilegios de administrador.'
      });
    }

    const role = userDoc.data().role || 'user';
    const isAdmin = role === 'admin';

    if (!isAdmin) {
      console.warn(`⚠️ Intento de acceso no autorizado a ruta administrativa por parte de: ${userEmail} (Rol: ${role})`);
      return res.status(403).json({
        error: 'Acceso prohibido. Se requieren privilegios de administrador para realizar esta acción.'
      });
    }

    // Si es admin, continúa a la ruta
    next();
  } catch (error) {
    console.error('❌ Error en requireAdmin middleware:', error.message);
    return res.status(500).json({
      error: 'Error interno del servidor al validar permisos del usuario.'
    });
  }
};

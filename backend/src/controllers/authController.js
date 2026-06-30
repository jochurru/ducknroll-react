import { db } from '../config/firebase.js';

/**
 * Controlador para verificar si el usuario tiene rol de Administrador.
 * Si el usuario no existe en la colección 'usuarios' de Firestore, lo registra automáticamente
 * con el rol 'user' por defecto. Si ya existe, lee su rol de la base de datos.
 */
export const checkAdminStatus = async (req, res) => {
  try {
    if (!req.user) {
      console.log('🔍 [Auth check-admin] No se encontró información de usuario decodificada.');
      return res.status(200).json({ isAdmin: false });
    }

    const { uid, email, name, picture } = req.user;
    const userEmail = email ? email.toLowerCase() : '';

    const userDocRef = db.collection('usuarios').doc(uid);
    const userDoc = await userDocRef.get();

    let role = 'user';

    if (!userDoc.exists) {
      // Registro automático del usuario en Firestore la primera vez que se loguea
      console.log(`📝 [Auth check-admin] Registrando nuevo usuario en Firestore: ${userEmail} (UID: ${uid})`);
      const newUser = {
        email: userEmail,
        nombre: name || '',
        photoURL: picture || '',
        role: 'user', // Rol básico por defecto
        createdAt: new Date().toISOString()
      };
      await userDocRef.set(newUser);
    } else {
      // Leer el rol almacenado en Firestore
      role = userDoc.data().role || 'user';
    }

    // Es admin únicamente si su rol en la base de datos de Firestore es 'admin'
    const isAdmin = role === 'admin';

    console.log(`🔍 [Auth check-admin] Evaluando usuario: ${userEmail}`);
    console.log(`   - Rol en Firestore: ${role}`);
    console.log(`   - Resultado final isAdmin: ${isAdmin}`);

    // Configurar cabeceras anti-caché estrictas
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });

    return res.status(200).json({ isAdmin });
  } catch (error) {
    console.error('❌ Error en checkAdminStatus:', error);
    return res.status(500).json({ error: 'Error interno al verificar privilegios del usuario.' });
  }
};

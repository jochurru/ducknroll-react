# 🦆 Duck'n Roll

E-commerce de remeras retro y gaming desarrollado con React y Vite.

![Deploy Status](https://img.shields.io/badge/deploy-vercel-black?style=flat-square)
![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple?style=flat-square&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-orange?style=flat-square&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.18-38bdf8?style=flat-square&logo=tailwindcss)

## 🌐 Demo en Vivo

Visita la aplicación en: [https://ducknroll-react.vercel.app/](https://ducknroll-react.vercel.app/)

## 📝 Descripción

Duck'n Roll es un e-commerce especializado en remeras con diseños retro y de gaming. El proyecto fue desarrollado como parte del programa Talento Tech React.

## ✨ Características

- 🛍️ Catálogo de productos con diseños retro y gaming
- 🛒 Carrito de compras interactivo
- 🔥 Integración con Firebase para backend
- 📱 Diseño responsive con Tailwind CSS
- 🔄 Navegación fluida con React Router
- ⚡ Carga rápida con Vite
- 🎨 Interfaz moderna y amigable
- 🔔 Notificaciones elegantes con SweetAlert2
- 🎯 Iconos personalizados con React Icons

## 🚀 Tecnologías

### Frontend
- **React 19.1.1** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite 7.1.7** - Build tool y dev server ultrarrápido
- **React Router DOM 7.9.4** - Enrutamiento para aplicaciones React
- **Tailwind CSS 3.4.18** - Framework de CSS utility-first
- **React Icons 5.5.0** - Biblioteca de iconos para React

### Backend & Servicios
- **Firebase 12.4.0** - Plataforma de desarrollo que incluye:
  - Firebase Authentication - Autenticación de usuarios
  - Cloud Firestore - Base de datos NoSQL en tiempo real
  - Firebase Storage - Almacenamiento de archivos
- **Axios 1.12.2** - Cliente HTTP para realizar peticiones

### UI/UX
- **SweetAlert2 11.26.3** - Librería para alertas y notificaciones personalizadas

### Herramientas de Desarrollo
- **ESLint** - Linter para mantener código limpio
- **PostCSS & Autoprefixer** - Procesamiento de CSS

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/jochurru/ducknroll-react.git
```

2. Navega al directorio del proyecto:
```bash
cd ducknroll-react
```

3. Instala las dependencias:
```bash
npm install
```

## 💻 Uso

### Modo Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build de Producción

Para crear una build de producción:

```bash
npm run build
```

### Preview de Producción

Para previsualizar la build de producción:

```bash
npm run preview
```

### Linting

Para ejecutar ESLint:

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
ducknroll-react/
├── public/          # Archivos estáticos
├── src/             # Código fuente
│   ├── components/  # Componentes React
│   ├── assets/      # Imágenes y recursos
│   ├── firebase/    # Configuración de Firebase
│   └── App.jsx      # Componente principal
├── index.html       # Punto de entrada HTML
├── package.json     # Dependencias y scripts
├── vite.config.js   # Configuración de Vite
├── tailwind.config.js # Configuración de Tailwind
└── postcss.config.js  # Configuración de PostCSS
```

## ⚙️ Configuración de Firebase

Este proyecto utiliza Firebase para:
- 🔐 **Authentication** - Gestión de usuarios y autenticación
- 🗄️ **Firestore** - Base de datos en tiempo real
- 📦 **Storage** - Almacenamiento de archivos e imágenes

### Configuración Inicial

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita los servicios necesarios:
   - Authentication (Email/Password, Google, etc.)
   - Firestore Database
   - Storage

3. Crea un archivo `src/firebase/config.js` con la siguiente estructura:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
```

4. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=tu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=tu_app_id_aqui
```

5. Agrega `.env` a tu `.gitignore`:

```gitignore
# Variables de entorno
.env
.env.local
.env.production
```

### Configuración en Vercel

Para desplegar en Vercel, agrega las variables de entorno en:
- Dashboard de Vercel → Tu Proyecto → Settings → Environment Variables

### Reglas de Seguridad Recomendadas

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ejemplo: solo usuarios autenticados pueden leer/escribir
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

> ⚠️ **Importante:** 
> - NUNCA subas credenciales al repositorio
> - Configura reglas de seguridad apropiadas en Firebase
> - Usa variables de entorno para todas las credenciales sensibles
> - Revisa regularmente los logs de uso de Firebase

## 🔌 Plugins Disponibles

Este proyecto utiliza configuración estándar de Vite con React. Puedes optar por:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)** - Usa Babel para Fast Refresh (actual)
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)** - Usa SWC para Fast Refresh (alternativa más rápida)

## 🎨 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Crea una build de producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |

## 🌟 Características de Vite

- ⚡ Hot Module Replacement (HMR) instantáneo
- 📦 Build optimizada con Rollup
- 🔧 Configuración mínima lista para usar
- 🚀 Servidor de desarrollo ultrarrápido

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👨‍💻 Autor

**Jonatan Gaston Churruarin**

- GitHub: [@jochurru](https://github.com/jochurru)

## 📄 Licencia

Este proyecto fue desarrollado como parte del programa Talento Tech React.

## 🙏 Agradecimientos

- Talento Tech por la oportunidad de desarrollar este proyecto
- La comunidad de React y Vite por sus excelentes herramientas

---

⭐ Si te gustó este proyecto, dale una estrella en GitHub!

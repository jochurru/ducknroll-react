# 🦆 Duck'n Roll — E-commerce Full Stack

Aplicación web de e-commerce desarrollada con React y Node.js, pensada para gestionar catálogo, navegación de productos y una experiencia de compra moderna.

El proyecto evolucionó desde una práctica de frontend hacia una solución full-stack, incorporando backend propio, servicios externos e integración con herramientas de autenticación, almacenamiento y pagos.

---

## 🚀 Funcionalidades

- Catálogo de productos
- Navegación por distintas secciones
- Diseño responsive
- Carrito de compras
- Gestión de estado desde React
- Integración con backend propio
- Consumo de APIs
- Autenticación con Firebase
- Carga y gestión de imágenes
- Integración con Mercado Pago
- Envío de notificaciones por correo

---

## 🛠️ Stack tecnológico

### Frontend

![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Firebase
- SweetAlert2
- React Icons

### Backend

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)

- Node.js
- Express
- Firebase Admin
- Cloudinary
- Multer
- Nodemailer
- Mercado Pago
- CORS
- Morgan

---

## 🧱 Arquitectura

El repositorio contiene frontend y backend dentro del mismo proyecto.

```text
ducknroll-react/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── ducknroll-react/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── firebase.json
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🌐 Frontend

La interfaz está desarrollada como SPA con React y Vite.

Incluye:

- navegación mediante React Router;
- estructura basada en componentes;
- manejo de estado;
- consumo de servicios;
- diseño responsive con Tailwind CSS;
- integración con Firebase;
- configuración para despliegue en Vercel y Firebase.

---

## ⚙️ Backend

El backend está desarrollado con Node.js y Express.

La API utiliza una arquitectura separada por:

- configuración;
- controladores;
- rutas;
- middlewares;
- servicios externos.

También integra servicios para:

- autenticación y administración mediante Firebase;
- almacenamiento de imágenes con Cloudinary;
- carga de archivos con Multer;
- envío de emails con Nodemailer;
- integración con Mercado Pago.

---

## ▶️ Ejecución local

### Frontend

```bash
cd ducknroll-react
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## 📌 Estado del proyecto

Proyecto funcional desarrollado como parte de mi formación en React y posteriormente ampliado con backend e integraciones externas.

Actualmente representa una práctica completa de arquitectura full-stack, integración de servicios y desarrollo de una aplicación web orientada a e-commerce.

---

## 👨‍💻 Autor

**Jonatan Churruarin**

[LinkedIn](https://www.linkedin.com/in/jonatan-churruarin/)

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { createProduct } from '../services/sheetdb';
import { uploadImage } from '../services/storage';

const Admin = () => {
const { user, logout } = useAuth();
const { products, fetchProducts, getImagePath } = useProducts();

const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
nombre: '',
precio: '',
imagen: '',
descripcion: ''
});
const [selectedFile, setSelectedFile] = useState(null);
const [previewUrl, setPreviewUrl] = useState(null);
const [loading, setLoading] = useState(false);
const [uploading, setUploading] = useState(false);
const [message, setMessage] = useState({ type: '', text: '' });

const handleChange = (e) => {
setFormData({
    ...formData,
    [e.target.name]: e.target.value
});
};

// Manejar selección de archivo
const handleFileChange = (e) => {
const file = e.target.files[0];
if (file) {
    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
    setMessage({ type: 'error', text: '❌ Por favor seleccioná una imagen válida' });
    return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
    setMessage({ type: 'error', text: '❌ La imagen no debe superar los 5MB' });
    return;
    }

    setSelectedFile(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
    setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setMessage({ type: '', text: '' });
}
};

// Subir imagen a Firebase
const handleUploadImage = async () => {
if (!selectedFile) {
    setMessage({ type: 'error', text: '❌ Seleccioná una imagen primero' });
    return;
}

setUploading(true);
setMessage({ type: '', text: '' });

try {
    const imageUrl = await uploadImage(selectedFile);
    setFormData({ ...formData, imagen: imageUrl });
    setMessage({ type: 'success', text: '✅ Imagen subida exitosamente' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
} catch (error) {
    console.error('Error:', error);
    setMessage({ type: 'error', text: `❌ ${error.message}` });
} finally {
    setUploading(false);
}
};

const handleSubmit = async (e) => {
e.preventDefault();

// Validar que haya imagen
if (!formData.imagen) {
    setMessage({ type: 'error', text: '❌ Debés subir una imagen o ingresar una URL' });
    return;
}

setLoading(true);
setMessage({ type: '', text: '' });

try {
    await createProduct(formData);
    await fetchProducts();
    
    setMessage({ type: 'success', text: '✅ Producto agregado correctamente' });
    
    // Resetear formulario
    setFormData({
    nombre: '',
    precio: '',
    imagen: '',
    descripcion: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(false);
    
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
} catch (error) {
    console.error('Error al agregar producto:', error);
    setMessage({ type: 'error', text: '❌ Error al agregar producto' });
} finally {
    setLoading(false);
}
};

const handleLogout = async () => {
try {
    await logout();
} catch (error) {
    console.error('Error al cerrar sesión:', error);
}
};

return (
<div className="min-h-screen bg-gray-50 py-12">
    <div className="container mx-auto px-4">
    {/* Header */}
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-dark mb-2">
            Panel de Administración
            </h1>
            <p className="text-gray-600">
            Bienvenido, <span className="font-semibold">{user?.email}</span>
            </p>
        </div>
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
            Cerrar Sesión
        </button>
        </div>
    </div>

    {/* Mensaje de éxito/error */}
    {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
        message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
        {message.text}
        </div>
    )}

    {/* Estadísticas */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-gray-600 text-sm font-semibold">Total Productos</p>
            <p className="text-3xl font-bold text-dark mt-1">{products.length}</p>
            </div>
            <div className="text-5xl">📦</div>
        </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-gray-600 text-sm font-semibold">Productos Locales</p>
            <p className="text-3xl font-bold text-dark mt-1">
                {products.filter(p => !p.imagen?.startsWith('http')).length}
            </p>
            </div>
            <div className="text-5xl">🖼️</div>
        </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-gray-600 text-sm font-semibold">Firebase Storage</p>
            <p className="text-3xl font-bold text-dark mt-1">
                {products.filter(p => p.imagen?.startsWith('http')).length}
            </p>
            </div>
            <div className="text-5xl">☁️</div>
        </div>
        </div>
    </div>

    {/* Botón para agregar producto */}
    <div className="mb-8">
        <button
        onClick={() => setShowForm(!showForm)}
        className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
        {showForm ? '❌ Cancelar' : '➕ Agregar Nuevo Producto'}
        </button>
    </div>

    {/* Formulario para agregar producto */}
    {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-dark mb-6">
            Nuevo Producto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Producto *
                </label>
                <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Remera Mario"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio *
                </label>
                <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="9900"
                />
            </div>
            </div>

            {/* Sección de imagen mejorada */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
                Imagen del Producto *
            </label>

            {/* Tabs para elegir método */}
            <div className="flex space-x-4 mb-4">
                <button
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className="flex-1 bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                📤 Subir desde PC
                </button>
            </div>

            {/* Input de archivo (oculto) */}
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Preview de imagen */}
            {previewUrl && (
                <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300"
                />
                <div className="mt-3 flex space-x-3">
                    <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={uploading || formData.imagen}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {uploading ? '⏳ Subiendo...' : formData.imagen ? '✅ Subida' : '☁️ Subir a Firebase'}
                    </button>
                    <button
                    type="button"
                    onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setFormData({ ...formData, imagen: '' });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-dark px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                    🗑️ Eliminar
                    </button>
                </div>
                </div>
            )}

            {/* Mostrar URL si ya se subió */}
            {formData.imagen && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 break-all">
                    ✅ URL: {formData.imagen}
                </p>
                </div>
            )}

            {/* Opción alternativa: URL manual */}
            <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">O ingresá una URL manualmente:</p>
                <input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://... o images/remera.png"
                />
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
            </label>
            <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descripción del producto, talles disponibles, material, etc."
            />
            </div>

            <button
            type="submit"
            disabled={loading || !formData.imagen}
            className="w-full bg-primary hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? 'Agregando...' : '✅ Agregar Producto'}
            </button>
        </form>
        </div>
    )}

    {/* Lista de productos */}
    <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-dark mb-6">
        Productos Existentes ({products.length})
        </h2>
        
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
            <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Imagen</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                    <img
                    src={getImagePath(product.imagen)}
                    alt={product.nombre}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64x64?text=?';
                    }}
                    />
                </td>
                <td className="py-3 px-4 text-gray-600">{product.id}</td>
                <td className="py-3 px-4 font-semibold text-dark">{product.nombre}</td>
                <td className="py-3 px-4 text-primary font-bold">${product.precio}</td>
                <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.imagen?.startsWith('http')
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                    {product.imagen?.startsWith('http') ? '☁️ Firebase' : '📁 Local'}
                    </span>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
    </div>
</div>
);
};

export default Admin;
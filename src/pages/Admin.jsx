import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { createProduct } from '../services/sheetdb';
import { uploadImage } from '../services/storage';
import { toastSuccess, toastError, showError } from '../utils/sweetalert';

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
    toastError('Por favor seleccioná una imagen válida');
    return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
    toastError('La imagen no debe superar los 5MB');
    return;
    }

    setSelectedFile(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
    setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
}
};

// Subir imagen a Firebase
const handleUploadImage = async () => {
if (!selectedFile) {
    toastError('Seleccioná una imagen primero');
    return;
}

setUploading(true);

try {
    const imageUrl = await uploadImage(selectedFile);
    setFormData({ ...formData, imagen: imageUrl });
    toastSuccess('Imagen subida exitosamente ☁️');
} catch (error) {
    console.error('Error:', error);
    showError('Error al subir imagen', error.message);
} finally {
    setUploading(false);
}
};

const handleSubmit = async (e) => {
e.preventDefault();

// Validar que haya imagen
if (!formData.imagen) {
    toastError('Debés subir una imagen o ingresar una URL');
    return;
}

setLoading(true);

try {
    await createProduct(formData);
    await fetchProducts();
    
    toastSuccess('Producto agregado correctamente 🎉');
    
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
} catch (error) {
    console.error('Error al agregar producto:', error);
    showError('Error', 'No se pudo agregar el producto');
} finally {
    setLoading(false);
}
};

const handleLogout = async () => {
try {
    await logout();
} catch (error) {
    console.error('Error al cerrar sesión:', error);
    toastError('Error al cerrar sesión');
}
};

return (
<div className="min-h-screen bg-gray-light py-12">
    <div className="container mx-auto px-4">
    {/* Header */}
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-dark mb-2 font-retro">
            Panel de Administración
            </h1>
            <p className="text-gray-custom font-sans">
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

    {/* Estadísticas */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-gray-custom text-sm font-semibold font-sans">Total Productos</p>
            <p className="text-3xl font-bold text-dark mt-1 font-retro">{products.length}</p>
            </div>
            <div className="text-5xl">📦</div>
        </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-gray-custom text-sm font-semibold font-sans">Productos Locales</p>
            <p className="text-3xl font-bold text-dark mt-1 font-retro">
                {products.filter(p => !p.imagen?.startsWith('http')).length}
            </p>
            </div>
            <div className="text-5xl">🖼️</div>
        </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-gray-custom text-sm font-semibold font-sans">Firebase Storage</p>
            <p className="text-3xl font-bold text-dark mt-1 font-retro">
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
        className="bg-primary hover:bg-primary-dark text-dark px-6 py-3 rounded-lg font-bold transition-colors"
        >
        {showForm ? '❌ Cancelar' : '➕ Agregar Nuevo Producto'}
        </button>
    </div>

    {/* Formulario para agregar producto */}
    {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-dark mb-6 font-retro">
            Nuevo Producto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                Nombre del Producto *
                </label>
                <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                placeholder="Ej: Remera Mario"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                Precio *
                </label>
                <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                placeholder="9900"
                />
            </div>
            </div>

            {/* Sección de imagen mejorada */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-semibold text-gray-custom mb-4 font-sans">
                Imagen del Producto *
            </label>

            {/* Botón para elegir archivo */}
            <div className="flex space-x-4 mb-4">
                <button
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className="flex-1 bg-primary hover:bg-primary-dark text-dark px-4 py-2 rounded-lg font-semibold transition-colors"
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
                <p className="text-sm text-gray-custom mb-2 font-sans">Vista previa:</p>
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
                    className="bg-gray-300 hover:bg-gray-custom hover:text-white text-dark px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                    🗑️ Eliminar
                    </button>
                </div>
                </div>
            )}

            {/* Mostrar URL si ya se subió */}
            {formData.imagen && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 break-all font-sans">
                    ✅ URL: {formData.imagen}
                </p>
                </div>
            )}

            {/* Opción alternativa: URL manual */}
            <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2 font-sans">O ingresá una URL manualmente:</p>
                <input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans"
                placeholder="https://... o images/remera.png"
                />
            </div>
            </div>

            <div>
            <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                Descripción *
            </label>
            <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-sans"
                placeholder="Descripción del producto, talles disponibles, material, etc."
            />
            </div>

            <button
            type="submit"
            disabled={loading || !formData.imagen}
            className="w-full bg-primary hover:bg-primary-dark text-dark py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {loading ? 'Agregando...' : '✅ Agregar Producto'}
            </button>
        </form>
        </div>
    )}

    {/* Lista de productos */}
    <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-dark mb-6 font-retro">
        Productos Existentes ({products.length})
        </h2>
        
        <div className="overflow-x-auto">
        <table className="w-full">
            <thead>
            <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-custom font-sans">Imagen</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-custom font-sans">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-custom font-sans">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-custom font-sans">Precio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-custom font-sans">Tipo</th>
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
                <td className="py-3 px-4 text-gray-custom font-sans">{product.id}</td>
                <td className="py-3 px-4 font-semibold text-dark font-sans">{product.nombre}</td>
                <td className="py-3 px-4 text-primary font-bold font-retro">${product.precio}</td>
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
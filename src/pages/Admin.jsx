import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { createProduct, updateProduct, deleteProduct } from '../services/sheetdb';
import { uploadImage } from '../services/storage';
import { toastSuccess, toastError, showError, showConfirm } from '../utils/sweetalert';

const Admin = () => {
const { user, logout } = useAuth();
const { products, fetchProducts, getImagePath } = useProducts();

const [showForm, setShowForm] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);
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
    if (!file.type.startsWith('image/')) {
    toastError('Por favor seleccioná una imagen válida');
    return;
    }

    if (file.size > 5 * 1024 * 1024) {
    toastError('La imagen no debe superar los 5MB');
    return;
    }

    setSelectedFile(file);
    
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

// Abrir formulario para editar
const handleEdit = (product) => {
setEditingProduct(product);
setFormData({
    nombre: product.nombre,
    precio: product.precio,
    imagen: product.imagen,
    descripcion: product.descripcion
});
setPreviewUrl(null);
setSelectedFile(null);
setShowForm(true);
window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Cancelar edición
const handleCancel = () => {
setShowForm(false);
setEditingProduct(null);
setFormData({
    nombre: '',
    precio: '',
    imagen: '',
    descripcion: ''
});
setSelectedFile(null);
setPreviewUrl(null);
};

// Enviar formulario (crear o editar)
const handleSubmit = async (e) => {
e.preventDefault();

if (!formData.imagen) {
    toastError('Debés subir una imagen o ingresar una URL');
    return;
}

setLoading(true);

try {
    if (editingProduct) {
    // EDITAR producto existente
    await updateProduct(editingProduct.id, formData);
    toastSuccess('Producto actualizado correctamente ✏️');
    } else {
    // CREAR producto nuevo
    await createProduct(formData);
    toastSuccess('Producto agregado correctamente 🎉');
    }
    
    await fetchProducts();
    handleCancel();
} catch (error) {
    console.error('Error:', error);
    showError('Error', editingProduct ? 'No se pudo actualizar el producto' : 'No se pudo agregar el producto');
} finally {
    setLoading(false);
}
};

// Eliminar producto
const handleDelete = async (product) => {
const result = await showConfirm(
    '¿Eliminar producto?',
    `¿Estás seguro de eliminar "${product.nombre}"? Esta acción no se puede deshacer.`
);

if (result.isConfirmed) {
    try {
    await deleteProduct(product.id);
    await fetchProducts();
    toastSuccess('Producto eliminado correctamente 🗑️');
    } catch (error) {
    console.error('Error:', error);
    showError('Error', 'No se pudo eliminar el producto');
    }
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
    {!showForm && (
        <div className="mb-8">
        <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary-dark text-dark px-6 py-3 rounded-lg font-bold transition-colors"
        >
            ➕ Agregar Nuevo Producto
        </button>
        </div>
    )}

    {/* Formulario para agregar/editar producto */}
    {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-dark mb-6 font-retro">
            {editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
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

            {/* Sección de imagen */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block text-sm font-semibold text-gray-custom mb-4 font-sans">
                Imagen del Producto *
            </label>

            <div className="flex space-x-4 mb-4">
                <button
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className="flex-1 bg-primary hover:bg-primary-dark text-dark px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                📤 Subir desde PC
                </button>
            </div>

            <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

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
                        if (!editingProduct) {
                        setFormData({ ...formData, imagen: '' });
                        }
                    }}
                    className="bg-gray-300 hover:bg-gray-custom hover:text-white text-dark px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                    🗑️ Eliminar
                    </button>
                </div>
                </div>
            )}

            {formData.imagen && !previewUrl && (
                <div className="mt-4">
                <p className="text-sm text-gray-custom mb-2 font-sans">Imagen actual:</p>
                <img 
                    src={getImagePath(formData.imagen)} 
                    alt="Actual" 
                    className="w-40 h-40 object-cover rounded-lg border-2 border-gray-300"
                />
                </div>
            )}

            {formData.imagen && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 break-all font-sans">
                    ✅ URL: {formData.imagen}
                </p>
                </div>
            )}

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

            <div className="flex space-x-4">
            <button
                type="submit"
                disabled={loading || !formData.imagen}
                className="flex-1 bg-primary hover:bg-primary-dark text-dark py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Guardando...' : (editingProduct ? '✅ Actualizar Producto' : '✅ Agregar Producto')}
            </button>
            <button
                type="button"
                onClick={handleCancel}
                className="px-6 bg-gray-300 hover:bg-gray-custom hover:text-white text-dark py-3 rounded-lg font-bold transition-colors"
            >
                Cancelar
            </button>
            </div>
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
                <th className="text-left py-3 px-4 font-semibold text-gray-custom font-sans">Acciones</th>
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
                <td className="py-3 px-4">
                    <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                        title="Editar producto"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => handleDelete(product)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                        title="Eliminar producto"
                    >
                        🗑️
                    </button>
                    </div>
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
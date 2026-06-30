import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import api from '../services/api';
import { uploadImage } from '../services/storage';
import { toastSuccess, toastError, showError, showConfirm } from '../utils/sweetalert';
import Swal from 'sweetalert2';

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
    const [adminSearchTerm, setAdminSearchTerm] = useState('');

    const filteredAdminProducts = products.filter(product =>
        product.nombre.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        product.id.toString().toLowerCase().includes(adminSearchTerm.toLowerCase())
    );

    const hasLegacyImages = products.some(p => p.imagen && !p.imagen.includes('cloudinary.com'));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    // Manejar precio (solo números)
    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setFormData({ ...formData, precio: value });
    };

    const handleFileChange = async (e) => {
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
            
            // Generar previsualización local inmediata
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            // Subir de forma automática a Cloudinary
            setUploading(true);
            try {
                const imageUrl = await uploadImage(file);
                setFormData(prev => ({ ...prev, imagen: imageUrl }));
                toastSuccess('Imagen subida de forma segura a Cloudinary ☁️');
            } catch (error) {
                console.error('Error al subir imagen:', error);
                showError('Error al subir imagen', error.message || 'No se pudo subir la imagen.');
                setPreviewUrl(null);
                setSelectedFile(null);
            } finally {
                setUploading(false);
            }
        }
    };

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

    const handleMigrateImages = async () => {
        const result = await showConfirm(
            '¿Migrar imágenes a Cloudinary?',
            'Este proceso transferirá todas las imágenes de los productos al almacenamiento en la nube de Cloudinary y actualizará los productos en Firestore de forma automática.'
        );

        if (result.isConfirmed) {
            setLoading(true);
            try {
                Swal.fire({
                    title: 'Migrando imágenes...',
                    html: 'Por favor, no cierres la ventana. Esto puede tomar unos segundos.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const response = await api.post('/productos/migrate-images-to-cloudinary');
                
                Swal.close();
                toastSuccess(`¡Migración finalizada! Se migraron ${response.data.migradosConExito} imágenes con éxito.`);
                await fetchProducts();
            } catch (error) {
                Swal.close();
                console.error('Error al migrar:', error);
                showError('Error de Migración', error.response?.data?.error || 'No se pudieron migrar las imágenes a Cloudinary.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.imagen) {
        toastError('Debés subir una imagen o ingresar una URL');
        return;
        }

        setLoading(true);

        try {
        if (editingProduct) {
            await api.put(`/productos/${editingProduct.id}`, formData);
            toastSuccess('Producto actualizado correctamente ✏️');
        } else {
            await api.post('/productos', formData);
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

    const handleDelete = async (product) => {
        const result = await showConfirm(
        '¿Eliminar producto?',
        `¿Estás seguro de eliminar "${product.nombre}"? Esta acción no se puede deshacer.`
        );
        
        if (result.isConfirmed) {
        try {
            await api.delete(`/productos/${product.id}`);
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
        <div className="min-h-screen bg-gray-light py-6 md:py-12">
        <div className="container mx-auto px-4">
            {/* Header - Responsive */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                <h1 className="text-xl md:text-3xl font-bold text-dark mb-2 font-retro">
                    Panel Admin
                </h1>
                <p className="text-sm md:text-base text-gray-custom font-sans">
                    <span className="font-semibold">{user?.email}</span>
                </p>
                </div>
                <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition-colors text-sm md:text-base"
                >
                Cerrar Sesión
                </button>
            </div>
            </div>

            {/* Estadísticas - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-custom text-xs md:text-sm font-semibold font-sans">Total Productos</p>
                    <p className="text-2xl md:text-3xl font-bold text-dark mt-1 font-retro">{products.length}</p>
                </div>
                <div className="text-3xl md:text-5xl">📦</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-custom text-xs md:text-sm font-semibold font-sans">Locales</p>
                    <p className="text-2xl md:text-3xl font-bold text-dark mt-1 font-retro">
                    {products.filter(p => !p.imagen?.startsWith('http')).length}
                    </p>
                </div>
                <div className="text-3xl md:text-5xl">🖼️</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-custom text-xs md:text-sm font-semibold font-sans">Firebase</p>
                    <p className="text-2xl md:text-3xl font-bold text-dark mt-1 font-retro">
                    {products.filter(p => p.imagen?.startsWith('http')).length}
                    </p>
                </div>
                <div className="text-3xl md:text-5xl">☁️</div>
                </div>
            </div>
            </div>

            {/* Botón agregar - Responsive */}
            {!showForm && (
            <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-4">
                <button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-dark px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shadow-md retro-shadow-sm"
                >
                ➕ Agregar Producto
                </button>
                {hasLegacyImages && (
                <button
                onClick={handleMigrateImages}
                disabled={loading}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                ☁️ Migrar Imágenes a Cloudinary
                </button>
                )}
            </div>
            )}

            {/* Formulario - Responsive */}
            {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-dark mb-4 md:mb-6 font-retro">
                {editingProduct ? '✏️ Editar' : '➕ Nuevo'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm md:text-base"
                        placeholder="Ej: Remera Mario"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                        Precio *
                    </label>
                    <input
                        type="text"
                        name="precio"
                        value={formData.precio}
                        onChange={handlePriceChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm md:text-base"
                        placeholder="10000"
                    />
                    {formData.precio && (
                        <p className="text-xs text-gray-500 mt-1">
                        Precio: ${parseInt(formData.precio).toLocaleString('es-AR')}
                        </p>
                    )}
                    </div>
                </div>

                {/* Imagen - Responsive */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 bg-gray-50">
                    <label className="block text-sm font-bold text-dark mb-4 font-sans uppercase tracking-wide">
                    Imagen del Producto *
                    </label>

                    <button
                    type="button"
                    disabled={uploading}
                    onClick={() => document.getElementById('fileInput').click()}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-dark px-4 py-3 rounded-lg font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] text-sm md:text-base mb-4 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                    📤 {uploading ? 'Cargando imagen...' : 'Subir desde PC'}
                    </button>

                    <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                    />

                    {uploading && (
                      <div className="flex flex-col items-center justify-center py-6 gap-2 text-sm text-gray-custom font-sans">
                        <span className="animate-spin text-2xl text-primary">⏳</span>
                        <span>Subiendo a Cloudinary de forma segura...</span>
                      </div>
                    )}

                    {previewUrl && !uploading && (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-xs text-gray-500 mb-2 font-sans">Vista Previa Seleccionada:</p>
                        <div className="relative w-36 h-36 mx-auto md:mx-0">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-contain rounded-lg border bg-white p-2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              if (!editingProduct) {
                                setFormData(prev => ({ ...prev, imagen: '' }));
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-650 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md text-xs font-bold transition-all hover:scale-110 active:scale-90"
                            title="Remover imagen"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    {formData.imagen && !previewUrl && !uploading && (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-xs text-gray-500 mb-2 font-sans">Imagen Actual Guardada:</p>
                        <div className="relative w-36 h-36 mx-auto md:mx-0">
                          <img 
                            src={getImagePath(formData.imagen)} 
                            alt="Actual" 
                            className="w-full h-full object-contain rounded-lg border bg-white p-2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, imagen: '' }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-650 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md text-xs font-bold transition-all hover:scale-110 active:scale-90"
                            title="Remover imagen"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    {formData.imagen && !uploading && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-800 break-all font-sans font-semibold">
                          ✓ URL: {formData.imagen}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs text-gray-500 mb-2 font-sans">O ingresar URL de imagen de forma manual:</p>
                      <input
                        type="text"
                        name="imagen"
                        value={formData.imagen}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm shadow-sm"
                        placeholder="https://example.com/imagen.jpg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-sans text-sm md:text-base"
                    placeholder="Descripción, talles, material..."
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                    type="submit"
                    disabled={loading || !formData.imagen}
                    className="flex-1 bg-primary hover:bg-primary-dark text-dark py-3 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm md:text-base"
                    >
                    {loading ? 'Guardando...' : (editingProduct ? '✅ Actualizar' : '✅ Agregar')}
                    </button>
                    <button
                    type="button"
                    onClick={handleCancel}
                    className="sm:w-auto px-6 bg-gray-300 hover:bg-gray-custom hover:text-white text-dark py-3 rounded-lg font-bold transition-colors text-sm md:text-base"
                    >
                    Cancelar
                    </button>
                </div>
                </form>
            </div>
            )}

            {/* Tabla - Responsive */}
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold text-dark font-retro">
                    Productos ({filteredAdminProducts.length})
                </h2>
                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o ID..."
                    value={adminSearchTerm}
                    onChange={(e) => setAdminSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm w-full md:w-72"
                />
            </div>
            
            {/* Vista mobile - Cards */}
            <div className="block md:hidden space-y-4">
                {filteredAdminProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-4 mb-3">
                    <img
                        src={getImagePath(product.imagen)}
                        alt={product.nombre}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=?';
                        }}
                    />
                    <div className="flex-1">
                        <h3 className="font-bold text-dark mb-1">{product.nombre}</h3>
                        <p className="text-primary font-bold font-retro">${product.precio}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                        product.imagen?.startsWith('http')
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                        {product.imagen?.startsWith('http') ? '☁️' : '📁'}
                        </span>
                    </div>
                    </div>
                    <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold"
                    >
                        ✏️ Editar
                    </button>
                    <button
                        onClick={() => handleDelete(product)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold"
                    >
                        🗑️ Eliminar
                    </button>
                    </div>
                </div>
                ))}
            </div>

            {/* Vista desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
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
                    {filteredAdminProducts.map((product) => (
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
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold"
                            >
                            ✏️
                            </button>
                            <button
                            onClick={() => handleDelete(product)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
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
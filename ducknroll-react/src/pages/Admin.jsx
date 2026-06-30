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
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        imagen: '',
        descripcion: '',
        etiqueta: '',
        categoria: 'general',
        material: '',
        talles: []
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

    const handleTalleChange = (talle) => {
        const currentTalles = formData.talles || [];
        if (currentTalles.includes(talle)) {
            setFormData({
                ...formData,
                talles: currentTalles.filter(t => t !== talle)
            });
        } else {
            setFormData({
                ...formData,
                talles: [...currentTalles, talle]
            });
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!formData.nombre || !formData.precio) {
                toastError('Por favor, completá el nombre y precio del producto');
                return;
            }
        } else if (currentStep === 2) {
            if (!formData.imagen) {
                toastError('Por favor, cargá una imagen o ingresá una URL');
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            descripcion: product.descripcion,
            etiqueta: product.etiqueta || '',
            categoria: product.categoria || 'general',
            material: product.material || '',
            talles: Array.isArray(product.talles) ? product.talles : []
        });
        setPreviewUrl(null);
        setSelectedFile(null);
        setCurrentStep(1);
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
            descripcion: '',
            etiqueta: '',
            categoria: 'general',
            material: '',
            talles: []
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setCurrentStep(1);
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
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-6 md:mb-8 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6 font-retro tracking-wide text-center md:text-left">
                {editingProduct ? '✏️ Editar Remera' : '➕ Nueva Remera'}
                </h2>

                {/* Stepper Progress Bar */}
                <div className="mb-10 max-w-xl mx-auto">
                    <div className="flex items-center justify-between relative">
                        {/* Línea de fondo */}
                        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                        {/* Línea activa */}
                        <div 
                          className="absolute left-0 top-1/2 h-1 bg-primary -translate-y-1/2 transition-all duration-500 z-0"
                          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                        ></div>

                        {/* Paso 1 */}
                        <div className="z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-sans transition-all duration-300 border-2 ${
                              currentStep >= 1 ? 'bg-primary text-dark border-primary shadow-md scale-110' : 'bg-white text-gray-400 border-gray-200'
                            }`}>
                              1
                            </div>
                            <span className={`text-xs font-bold font-sans mt-2 transition-colors duration-300 ${currentStep >= 1 ? 'text-dark' : 'text-gray-400'}`}>
                              Datos Básicos
                            </span>
                        </div>

                        {/* Paso 2 */}
                        <div className="z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-sans transition-all duration-300 border-2 ${
                              currentStep >= 2 ? 'bg-primary text-dark border-primary shadow-md scale-110' : 'bg-white text-gray-400 border-gray-200'
                            }`}>
                              2
                            </div>
                            <span className={`text-xs font-bold font-sans mt-2 transition-colors duration-300 ${currentStep >= 2 ? 'text-dark' : 'text-gray-400'}`}>
                              Imagen
                            </span>
                        </div>

                        {/* Paso 3 */}
                        <div className="z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-sans transition-all duration-300 border-2 ${
                              currentStep >= 3 ? 'bg-primary text-dark border-primary shadow-md scale-110' : 'bg-white text-gray-400 border-gray-200'
                            }`}>
                              3
                            </div>
                            <span className={`text-xs font-bold font-sans mt-2 transition-colors duration-300 ${currentStep >= 3 ? 'text-dark' : 'text-gray-400'}`}>
                              Ficha Técnica
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* PASO 1: INFORMACIÓN BÁSICA */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm md:text-base shadow-sm"
                            placeholder="Ej: Remera Delorean"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                            Precio ($) *
                        </label>
                        <input
                            type="text"
                            name="precio"
                            value={formData.precio}
                            onChange={handlePriceChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm md:text-base shadow-sm"
                            placeholder="20000"
                        />
                        {formData.precio && (
                            <p className="text-xs text-gray-500 mt-1 font-semibold">
                            Precio en Tienda: ${parseInt(formData.precio).toLocaleString('es-AR')}
                            </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                            Categoría / Género *
                        </label>
                        <select
                            name="categoria"
                            value={formData.categoria || 'general'}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm md:text-base bg-white shadow-sm"
                        >
                            <option value="general">General / Sin Categoría</option>
                            <option value="rock">🎸 Rock</option>
                            <option value="anime">🍙 Anime</option>
                            <option value="gaming">🎮 Gaming</option>
                            <option value="retro">👾 Retro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                            Etiqueta / Leyenda (Opcional)
                        </label>
                        <input
                            type="text"
                            name="etiqueta"
                            value={formData.etiqueta || ''}
                            onChange={handleChange}
                            list="etiqueta-suggestions"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm md:text-base shadow-sm"
                            placeholder="Ej: 🏷️ Oferta, 💎 Premium..."
                        />
                        <datalist id="etiqueta-suggestions">
                          <option value="🏷️ Oferta" />
                          <option value="💎 Premium" />
                          <option value="🔥 Nuevo" />
                          <option value="✨ Edición Limitada" />
                          <option value="👕 Últimas Unidades" />
                        </datalist>
                      </div>
                    </div>
                  </div>
                )}

                {/* PASO 2: CARGA DE MULTIMEDIA */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                        <label className="block text-sm font-bold text-dark mb-4 font-sans uppercase tracking-wide">
                        Imagen de la Prenda *
                        </label>

                        <button
                        type="button"
                        disabled={uploading}
                        onClick={() => document.getElementById('fileInput').click()}
                        className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-dark px-4 py-4 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] text-sm md:text-base mb-4 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                        📤 {uploading ? 'Cargando imagen...' : 'Subir Imagen desde PC'}
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
                            <span className="animate-spin text-3xl text-primary">⏳</span>
                            <span className="font-semibold">Subiendo de forma segura a Cloudinary...</span>
                          </div>
                        )}

                        {previewUrl && !uploading && (
                          <div className="mt-4 border-t pt-4">
                            <p className="text-xs text-gray-500 mb-2 font-sans">Vista Previa:</p>
                            <div className="relative w-40 h-40 mx-auto md:mx-0">
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
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md text-xs font-bold transition-all hover:scale-110 active:scale-90"
                                title="Remover imagen"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}

                        {formData.imagen && !previewUrl && !uploading && (
                          <div className="mt-4 border-t pt-4">
                            <p className="text-xs text-gray-500 mb-2 font-sans">Imagen Guardada Actual:</p>
                            <div className="relative w-40 h-40 mx-auto md:mx-0">
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
                              ✓ Enlace seguro: {formData.imagen}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 border-t pt-4">
                          <p className="text-xs text-gray-500 mb-2 font-sans">O ingresar enlace HTTP manual:</p>
                          <input
                            type="text"
                            name="imagen"
                            value={formData.imagen}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm shadow-sm"
                            placeholder="https://example.com/remera.jpg"
                          />
                        </div>
                    </div>
                  </div>
                )}

                {/* PASO 3: FICHA TÉCNICA */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                      Descripción de la prenda *
                      </label>
                      <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none font-sans text-sm md:text-base shadow-sm"
                      placeholder="Escribe detalles del estampado, estilo, etc..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-custom mb-2 font-sans">
                        Composición / Material (Opcional)
                        </label>
                        <input
                        type="text"
                        name="material"
                        value={formData.material || ''}
                        onChange={handleChange}
                        list="material-suggestions"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm md:text-base shadow-sm"
                        placeholder="Ej: 100% Algodón Peinado"
                        />
                        <datalist id="material-suggestions">
                          <option value="100% Algodón Peinado" />
                          <option value="100% Algodón Orgánico" />
                          <option value="Algodón y Poliéster" />
                          <option value="Poliéster Premium" />
                        </datalist>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="block text-sm font-bold text-dark mb-3 font-sans uppercase tracking-wide">
                        Talles Disponibles en Stock *
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {['S', 'M', 'L', 'XL', 'XXL'].map((talle) => {
                                const isChecked = formData.talles?.includes(talle);
                                return (
                                    <button
                                        type="button"
                                        key={talle}
                                        onClick={() => handleTalleChange(talle)}
                                        className={`w-12 h-12 rounded-lg font-bold font-sans transition-all flex items-center justify-center border-2 text-sm ${
                                            isChecked 
                                                ? 'bg-primary border-primary text-dark shadow-md scale-105' 
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                    >
                                        {talle}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-sans">
                          Tilda las casillas de los talles que tengan stock de esta remera. Al menos uno es recomendado.
                        </p>
                    </div>
                  </div>
                )}

                {/* BOTONES DE NAVEGACIÓN Y ENVÍO */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                    {currentStep > 1 && (
                      <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 sm:flex-none px-6 bg-gray-200 hover:bg-gray-300 text-dark py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base flex items-center justify-center gap-1"
                      >
                      ⬅️ Atrás
                      </button>
                    )}

                    {currentStep < 3 ? (
                      <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 bg-primary hover:bg-primary-dark text-dark py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base flex items-center justify-center gap-1 shadow-md retro-shadow-sm ml-auto"
                      >
                      Siguiente ➡️
                      </button>
                    ) : (
                      <button
                      type="submit"
                      disabled={loading || !formData.imagen}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-sm md:text-base shadow-md ml-auto"
                      >
                      {loading ? '⏳ Guardando...' : (editingProduct ? '✅ Guardar Cambios' : '✅ Crear Remera')}
                      </button>
                    )}

                    <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-6 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 text-sm md:text-base"
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
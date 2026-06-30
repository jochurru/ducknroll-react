import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { toastSuccess } from '../utils/sweetalert';
import { ProductDetailSkeleton } from '../components/Skeleton';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, getImagePath } = useProducts();
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
        
        // Inicializar el talle seleccionado dinámicamente
        const availableSizes = data && Array.isArray(data.talles) && data.talles.length > 0
          ? data.talles
          : ['S', 'M', 'L', 'XL', 'XXL'];
        setSelectedSize(availableSizes[0] || 'M');
      } catch (error) {
        console.error('Error al cargar producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProduct]);

  const selectedSizeStock = product && product.inventario && product.inventario[selectedSize] !== undefined
    ? Number(product.inventario[selectedSize])
    : 10;

  useEffect(() => {
    if (selectedSizeStock > 0 && quantity > selectedSizeStock) {
      setQuantity(selectedSizeStock);
    } else if (selectedSizeStock === 0) {
      setQuantity(0);
    } else if (quantity === 0 && selectedSizeStock > 0) {
      setQuantity(1);
    }
  }, [selectedSize, selectedSizeStock, quantity]);

  const handleAddToCart = () => {
    if (selectedSizeStock === 0) return;
    addToCart({ ...product, talleSeleccionado: selectedSize }, quantity);
    toastSuccess(`${quantity} remera(s) "${product.nombre}" (Talle: ${selectedSize}) agregada(s) al carrito 🛒`);
  };

  const productInCart = isInCart(id);
  const isPremium = product && parseFloat(product.precio) > 15000;
  
  // Soporte para etiqueta administrable
  const hasEtiquetaDefined = product && product.etiqueta !== undefined;
  const etiquetaToShow = product && (hasEtiquetaDefined ? product.etiqueta : (isPremium ? '💎 Premium' : '🏷️ Oferta'));
  const sizes = product && Array.isArray(product.talles) && product.talles.length > 0
    ? product.talles
    : ['S', 'M', 'L', 'XL', 'XXL'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-sm">
          <div className="text-6xl mb-4 animate-bounce">😢</div>
          <h2 className="text-2xl font-bold text-dark mb-4 font-retro text-sm leading-relaxed">
            Producto no encontrado
          </h2>
          <p className="text-gray-custom mb-6 font-sans">
            El producto solicitado no existe o fue dado de baja de nuestro catálogo.
          </p>
          <Link to="/productos" className="bg-primary hover:bg-primary-dark text-dark px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm">
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb estético */}
        <div className="mb-8 text-sm text-gray-custom font-sans flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span className="text-gray-400">/</span>
          <Link to="/productos" className="hover:text-primary transition-colors">Productos</Link>
          <span className="text-gray-400">/</span>
          <span className="text-dark font-semibold truncate">{product.nombre}</span>
        </div>

        {/* Ficha de producto */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12">
            {/* Columna Izquierda: Imagen */}
            <div className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-gray-100 relative shadow-inner">
              <img
                src={getImagePath(product.imagen)}
                alt={product.nombre}
                className="max-h-[450px] object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=Duck%27n+Roll';
                }}
              />
              {etiquetaToShow && (
                <span className={`absolute top-4 left-4 text-xs font-bold uppercase px-3 py-1.5 rounded-full shadow-md font-sans tracking-wide ${
                  etiquetaToShow.includes('Premium') || etiquetaToShow.includes('💎')
                    ? 'bg-secondary text-primary'
                    : 'bg-primary text-dark neon-glow-yellow'
                }`}>
                  {etiquetaToShow}
                </span>
              )}
            </div>

            {/* Columna Derecha: Lógica y Detalles */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-dark mb-4 font-sans leading-tight">
                  {product.nombre}
                </h1>

                <p className="text-3xl font-bold text-dark mb-6 font-retro border-b pb-4">
                  ${parseFloat(product.precio).toLocaleString('es-AR')}
                </p>

                <p className="text-gray-custom mb-6 leading-relaxed font-sans text-sm md:text-base">
                  {product.descripcion}
                </p>

                {/* Ficha Técnica: Categoría y Material */}
                <div className="flex flex-wrap gap-3 mb-6 text-sm">
                  {product.categoria && product.categoria !== 'general' && (
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-250 px-3 py-1.5 rounded-lg text-dark font-sans font-semibold shadow-sm">
                      <span>🏷️</span>
                      <span>Categoría: <span className="uppercase text-xs font-bold text-gray-custom">{product.categoria}</span></span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-250 px-3 py-1.5 rounded-lg text-dark font-sans font-semibold shadow-sm">
                      <span>🧵</span>
                      <span>Composición: <span className="text-gray-custom">{product.material}</span></span>
                    </div>
                  )}
                </div>

                {/* Selector de Talles Interactivo */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-dark mb-3 font-sans uppercase tracking-wide">
                    Seleccionar Talle:
                  </label>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg font-bold font-sans text-sm flex items-center justify-center border transition-all ${
                          selectedSize === size
                            ? 'bg-primary border-primary text-dark shadow-md scale-105'
                            : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-custom'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock por Talle Seleccionado */}
                <div className="mb-6">
                  {selectedSizeStock === 0 ? (
                    <div className="flex items-center gap-2 text-red-600 font-sans font-bold text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 w-max">
                      <span>❌</span>
                      <span>Sin Stock disponible en Talle {selectedSize}</span>
                    </div>
                  ) : selectedSizeStock <= 3 ? (
                    <div className="flex items-center gap-2 text-amber-600 font-sans font-bold text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-max animate-pulse">
                      <span>⚠️</span>
                      <span>¡Últimas {selectedSizeStock} unidades en Talle {selectedSize}!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-700 font-sans font-semibold text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-max">
                      <span>✓</span>
                      <span>Stock disponible: {selectedSizeStock} unidades ({selectedSize})</span>
                    </div>
                  )}
                </div>

                {/* Selector de Cantidad */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-dark mb-3 font-sans uppercase tracking-wide">
                    Cantidad:
                  </label>
                  <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1.5 w-max border border-gray-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || selectedSizeStock === 0}
                      className="bg-white hover:bg-gray-200 text-dark w-10 h-10 rounded-md font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold w-12 text-center text-dark font-sans">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= selectedSizeStock || selectedSizeStock === 0}
                      className="bg-white hover:bg-gray-200 text-dark w-10 h-10 rounded-md font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={selectedSizeStock === 0}
                  className="w-full bg-primary hover:bg-primary-dark text-dark py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] retro-shadow-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedSizeStock === 0 ? '❌ Sin stock disponible' : (productInCart ? 'Agregar más al carrito 🛒' : 'Agregar al carrito 🛒')}
                </button>
                <button
                  onClick={() => navigate('/productos')}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-custom py-4 rounded-xl font-bold text-base transition-all duration-200"
                >
                  Seguir comprando
                </button>
              </div>

              {/* Información y Garantías */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500 font-sans">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xl">🔒</span>
                  <span className="font-semibold text-dark">Pago Seguro</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xl">🚚</span>
                  <span className="font-semibold text-dark">Envío Express</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xl">↩️</span>
                  <span className="font-semibold text-dark">Cambio Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
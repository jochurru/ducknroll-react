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
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

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
            <div 
              onClick={() => setIsZoomOpen(true)}
              className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-gray-100 relative shadow-inner cursor-zoom-in group/image"
              title="Hacé clic para ampliar la imagen"
            >
              <img
                src={getImagePath(product.imagen)}
                alt={product.nombre}
                className="max-h-[280px] sm:max-h-[380px] md:max-h-[450px] object-contain mix-blend-multiply transition-all duration-300 group-hover/image:scale-[1.03]"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=Duck%27n+Roll';
                }}
              />
              
              {/* Indicador de Ampliación al posar el cursor */}
              <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 font-sans flex items-center gap-1.5 pointer-events-none">
                <span>🔍</span>
                <span>Ver de cerca</span>
              </div>

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
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-dark font-sans uppercase tracking-wide">
                      Seleccionar Talle:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(true)}
                      className="text-xs text-primary-dark hover:text-dark font-bold font-sans underline transition-colors"
                    >
                      📐 Ver Guía de Talles
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 rounded-lg font-bold font-sans text-sm flex items-center justify-center border transition-all ${
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
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100 flex flex-col max-h-[90vh] animate-scaleUp">
            {/* Botón cerrar */}
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-250 text-dark w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 font-bold z-10"
              title="Cerrar Guía"
            >
              ✕
            </button>

            {/* Contenido Modal */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <h3 className="text-xl md:text-2xl font-bold text-dark mb-4 font-retro tracking-wide text-center">
                📐 GUÍA PARA ELEGIR TU TALLE
              </h3>
              
              <p className="text-xs md:text-sm text-gray-custom mb-6 text-center max-w-2xl mx-auto leading-relaxed">
                No todos los cuerpos son iguales, por lo tanto no existe una referencia exacta para cada persona. 
                Te proporcionamos <strong>2 formas de medición</strong> para que puedas tener una referencia aproximada:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 md:p-5 rounded-xl mb-6">
                <div className="text-xs md:text-sm text-dark font-sans leading-relaxed flex items-start gap-2">
                  <span className="bg-primary text-dark font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">1</span>
                  <span><strong>Medir una remera propia</strong>: Colocá una prenda que te quede bien sobre una superficie plana. Medí el ancho (A) de axila a axila, y el alto (B) desde el cuello hasta el borde inferior.</span>
                </div>
                <div className="text-xs md:text-sm text-dark font-sans leading-relaxed flex items-start gap-2">
                  <span className="bg-primary text-dark font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">2</span>
                  <span><strong>Medir tu contorno</strong>: Medí la circunferencia horizontal de tu pecho con una cinta métrica a la altura de las axilas y comparalo con el contorno sugerido.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Ilustraciones SVG */}
                <div className="lg:col-span-5 flex flex-row lg:flex-col justify-center items-center gap-6">
                  {/* SVG Remera */}
                  <div className="flex flex-col items-center">
                    <svg viewBox="0 0 200 200" className="w-36 h-36 md:w-44 md:h-44 text-dark fill-current">
                      {/* Silueta de la remera */}
                      <path d="M 40,30 L 70,30 L 70,10 C 85,15 115,15 130,10 L 130,30 L 160,30 L 180,75 L 150,85 L 145,70 L 145,185 L 55,185 L 55,70 L 50,85 L 20,75 Z" fill="#1A1A1A" />
                      
                      {/* Línea A - Ancho */}
                      <line x1="55" y1="90" x2="145" y2="90" stroke="#FFC700" strokeWidth="2" strokeDasharray="3 3" />
                      <polygon points="55,90 60,86 60,94" fill="#FFC700" />
                      <polygon points="145,90 140,86 140,94" fill="#FFC700" />
                      <text x="100" y="83" fill="#FFC700" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">A (Ancho)</text>
                      
                      {/* Línea B - Alto */}
                      <line x1="100" y1="18" x2="100" y2="185" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
                      <polygon points="100,18 96,23 104,23" fill="#FFFFFF" />
                      <polygon points="100,185 96,180 104,180" fill="#FFFFFF" />
                      <text x="108" y="105" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="start" fontFamily="sans-serif">B (Alto)</text>
                    </svg>
                    <span className="text-2xs md:text-xs text-gray-500 font-bold font-sans mt-2">Medidas de la prenda</span>
                  </div>

                  {/* SVG Contorno Pecho */}
                  <div className="flex flex-col items-center">
                    <svg viewBox="0 0 200 200" className="w-36 h-36 md:w-44 md:h-44">
                      {/* Silueta de Torso humana */}
                      <path d="M 100,25 C 110,25 118,33 118,43 C 118,53 110,61 100,61 C 90,61 82,53 82,43 C 82,33 90,25 100,25 Z M 100,68 C 120,68 140,75 145,95 L 140,185 L 60,185 L 55,95 C 60,75 80,68 100,68 Z" fill="#E2E8F0" />
                      
                      {/* Línea curva pecho roja */}
                      <path d="M 68,110 Q 100,125 132,110" fill="none" stroke="#EF4444" strokeWidth="2.5" />
                      <polygon points="68,110 74,107 72,113" fill="#EF4444" />
                      <polygon points="132,110 126,107 128,113" fill="#EF4444" />
                      <text x="100" y="137" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Contorno Pecho</text>
                    </svg>
                    <span className="text-2xs md:text-xs text-gray-500 font-bold font-sans mt-2">Medida de tu cuerpo</span>
                  </div>
                </div>

                {/* Tabla de Medidas */}
                <div className="lg:col-span-7">
                  <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                    <table className="w-full text-left font-sans border-collapse">
                      <thead>
                        <tr className="bg-dark text-white text-xs md:text-sm font-bold">
                          <th className="p-3 md:p-4 text-center">TALLE</th>
                          <th className="p-3 md:p-4 text-center">A (ANCHO)</th>
                          <th className="p-3 md:p-4 text-center">B (ALTO)</th>
                          <th className="p-3 md:p-4 text-center">CONTORNO PECHO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 text-xs md:text-sm">
                        {[
                          { talle: 'S', ancho: '48 / 49 cm', alto: '70 / 71 cm', pecho: '96 / 99 cm' },
                          { talle: 'M', ancho: '51 / 52 cm', alto: '73 / 74 cm', pecho: '100 / 104 cm' },
                          { talle: 'L', ancho: '53 / 54 cm', alto: '74 / 75 cm', pecho: '105 / 108 cm' },
                          { talle: 'XL', ancho: '55 / 56 cm', alto: '76 / 77 cm', pecho: '109 / 113 cm' },
                          { talle: 'XXL', talleFiltro: 'XXL', ancho: '57 / 58 cm', alto: '78 / 79 cm', pecho: '114 / 118 cm' },
                          { talle: '3XL', ancho: '59 / 60 cm', alto: '79 / 80 cm', pecho: '119 / 124 cm' },
                        ].map((row) => (
                          <tr 
                            key={row.talle} 
                            className={`hover:bg-primary/10 transition-colors text-center font-semibold text-dark ${
                              selectedSize === row.talle || selectedSize === row.talleFiltro
                                ? 'bg-primary/25 font-bold' 
                                : ''
                            }`}
                          >
                            <td className="p-3 md:p-4 bg-gray-50 border-r border-gray-100 font-bold">{row.talle}</td>
                            <td className="p-3 md:p-4">{row.ancho}</td>
                            <td className="p-3 md:p-4">{row.alto}</td>
                            <td className="p-3 md:p-4 text-gray-custom">{row.pecho}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-2xs text-gray-400 mt-3 font-sans italic text-center lg:text-left">
                    * Las medidas expresadas en la tabla son aproximadas y pueden variar +/- 1 cm según el proceso de confección.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="bg-dark hover:bg-dark-light text-white px-5 py-2 rounded-lg font-bold font-sans text-xs md:text-sm transition-all hover:scale-105 active:scale-95 shadow"
              >
                Entendido 👍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom de Imagen */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn cursor-zoom-out"
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90 text-xl font-bold z-10 cursor-pointer"
            title="Cerrar"
          >
            ✕
          </button>
          
          {/* Contenedor de Imagen */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl max-h-[85vh] overflow-hidden flex items-center justify-center"
          >
            <img
              src={getImagePath(product.imagen)}
              alt={product.nombre}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white p-4 sm:p-8"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=Duck%27n+Roll';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
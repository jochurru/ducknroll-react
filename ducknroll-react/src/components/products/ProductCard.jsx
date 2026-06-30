import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { toastSuccess } from '../../utils/sweetalert';

const ProductCard = ({ product }) => {
  const { getImagePath } = useProducts();
  const { addToCart, isInCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toastSuccess(`${product.nombre} agregado al carrito 🛒`);
  };

  const productInCart = isInCart(product.id);
  const isPremium = parseFloat(product.precio) > 15000;
  
  // Soporte para etiqueta administrable
  const hasEtiquetaDefined = product.etiqueta !== undefined;
  const etiquetaToShow = hasEtiquetaDefined ? product.etiqueta : (isPremium ? '💎 Premium' : '🏷️ Oferta');

  return (
    <Link to={`/producto/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border border-gray-200">
        {/* Contenedor de Imagen con Efecto Zoom */}
        <div className="h-72 bg-gray-50 overflow-hidden relative">
          <img
            src={getImagePath(product.imagen)}
            alt={product.nombre}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-4"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Duck%27n+Roll';
            }}
          />

          {/* Badges Estéticos */}
          {etiquetaToShow && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full shadow-sm font-sans tracking-wide ${
                etiquetaToShow.includes('Premium') || etiquetaToShow.includes('💎')
                  ? 'bg-secondary text-primary'
                  : 'bg-primary text-dark neon-glow-yellow'
              }`}>
                {etiquetaToShow}
              </span>
            </div>
          )}

          {productInCart && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm font-sans flex items-center gap-1">
              <span>✓ En carrito</span>
            </div>
          )}
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors font-sans">
              {product.nombre}
            </h3>

            <p className="text-gray-custom text-sm mb-4 line-clamp-2 font-sans leading-relaxed">
              {product.descripcion}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xl font-bold text-dark font-retro">
              ${parseFloat(product.precio).toLocaleString('es-AR')}
            </span>
            
            <button
              onClick={handleQuickAdd}
              disabled={productInCart}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                productInCart 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-primary hover:bg-primary-dark text-dark shadow-sm hover:shadow'
              }`}
            >
              {productInCart ? 'En Carrito' : 'Agregar 🛒'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
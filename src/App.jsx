import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetailPage from './pages/ProductDetailPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/Scrolltotop';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Rutas públicas */}
          <Route index element={<Home />} />
          <Route path="productos" element={<Products />} />
          <Route path="producto/:id" element={<ProductDetailPage />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="confirmacion" element={<Confirmation />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
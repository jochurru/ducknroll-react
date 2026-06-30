import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
const { pathname, search } = useLocation();

useEffect(() => {
// Scroll instantáneo al inicio
window.scrollTo({
top: 0,
left: 0,
behavior: 'instant' // Cambiar de 'smooth' a 'instant' para que sea inmediato
});
}, [pathname, search]); // Detecta cambios en pathname Y search params

return null;
}
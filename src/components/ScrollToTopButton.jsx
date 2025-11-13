import { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
    setIsVisible(true);
    } else {
    setIsVisible(false);
    }
};

window.addEventListener('scroll', toggleVisibility);
return () => window.removeEventListener('scroll', toggleVisibility);
}, []);

const scrollToTop = () => {
window.scrollTo({
    top: 0,
    behavior: 'smooth'
});
};

return isVisible ? (
<button
    onClick={scrollToTop}
    className="fixed bottom-4 right-20 bg-primary hover:bg-primary-dark text-dark p-3 rounded-full shadow-lg transition-all z-50 font-bold text-xl"
    aria-label="Volver arriba"
>
    ⬆️
</button>
) : null;
};

export default ScrollToTopButton;
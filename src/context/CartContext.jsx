import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado
export const useCart = () => {
const context = useContext(CartContext);
if (!context) {
throw new Error('useCart debe usarse dentro de CartProvider');
}
return context;
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
const [cart, setCart] = useState([]);

// Cargar carrito del localStorage al iniciar
useEffect(() => {
const savedCart = localStorage.getItem('ducknroll-cart');
if (savedCart) {
    setCart(JSON.parse(savedCart));
}
}, []);

// Guardar carrito en localStorage cada vez que cambie
useEffect(() => {
localStorage.setItem('ducknroll-cart', JSON.stringify(cart));
}, [cart]);

// Agregar producto al carrito
const addToCart = (product, quantity = 1) => {
setCart(prevCart => {
    // Verificar si el producto ya está en el carrito
    const existingItem = prevCart.find(item => item.id === product.id);
    
    if (existingItem) {
    // Si existe, incrementar la cantidad
    return prevCart.map(item =>
        item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
    } else {
    // Si no existe, agregarlo
    return [...prevCart, { ...product, quantity }];
    }
});
};

// Remover producto del carrito
const removeFromCart = (productId) => {
setCart(prevCart => prevCart.filter(item => item.id !== productId));
};

// Actualizar cantidad de un producto
const updateQuantity = (productId, quantity) => {
if (quantity <= 0) {
    removeFromCart(productId);
    return;
}

setCart(prevCart =>
    prevCart.map(item =>
    item.id === productId ? { ...item, quantity } : item
    )
);
};

// Vaciar carrito
const clearCart = () => {
setCart([]);
};

// Calcular total de items
const getTotalItems = () => {
return cart.reduce((total, item) => total + item.quantity, 0);
};

// Calcular precio total
const getTotalPrice = () => {
return cart.reduce((total, item) => {
    const price = parseFloat(item.precio) || 0;
    return total + (price * item.quantity);
}, 0);
};

// Verificar si un producto está en el carrito
const isInCart = (productId) => {
return cart.some(item => item.id === productId);
};

// Valor que se compartirá
const value = {
cart,                // Array de productos
addToCart,           // Agregar producto
removeFromCart,      // Remover producto
updateQuantity,      // Actualizar cantidad
clearCart,           // Vaciar carrito
getTotalItems,       // Total de items
getTotalPrice,       // Precio total
isInCart             // Verificar si está en carrito
};

return (
<CartContext.Provider value={value}>
    {children}
</CartContext.Provider>
);
};
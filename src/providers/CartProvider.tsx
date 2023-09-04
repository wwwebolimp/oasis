import React, {createContext, ReactNode, useEffect, useState} from "react";

export interface CartItem {
    _id: string ;
    quantity?: number;
}

interface CartContextType {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    addToCart: (product: CartItem) => void;
    removeFromCart:(productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export {CartContext};

interface CartProviderProps {
    children: ReactNode;
}

const CART_STORAGE_KEY = "cart";
export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        if (cart.length > 0 && ls) { // Проверяем, что ls существует
            ls.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, ls]);

    useEffect(() => {
        if (ls && ls.getItem(CART_STORAGE_KEY)) {
            setCart(JSON.parse(ls.getItem(CART_STORAGE_KEY) || ""));
        }
    }, [ls]);

    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item._id === product._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: (item.quantity || 0) + 1 }
                        : item
                );
            } else {
                // Преобразуйте _id в строку, если он массив
                const productId = Array.isArray(product._id) ? product._id[0] : product._id;
                return [...prevCart, { _id: productId, quantity: product.quantity || 1 }];
            }
        });
    };
    const removeFromCart = (productId: string) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item._id !== productId);
            return updatedCart;
        });
    };



    const contextValue: CartContextType = {
        cart,
        setCart,
        addToCart,
        removeFromCart
    };

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
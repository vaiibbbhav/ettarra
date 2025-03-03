import React, { createContext, useContext } from "react";

interface CartItem {
  id: number;
  name: string;
  tagline: string;
  quantity: string;
  price: number;
  imgSrc: string;
  count: number;  
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'count'>) => void;  
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, count: number) => void;
  getTotalPrice: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = React.useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'count'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, count: i.count + 1 } : i
        );
      }
      return [...prevCart, { ...item, count: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, count: number) => {
    setCart((prevCart) =>
      prevCart.map((i) => (i.id === id ? { ...i, count } : i))
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.count, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((acc, item) => acc + item.count, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
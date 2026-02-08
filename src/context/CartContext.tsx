"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartStorage } from "@/lib/cart-storage";
import { CartItem, CartContextType } from "@/types/product";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load browser storage only after mount to keep SSR/CSR output deterministic.
    setItems(CartStorage.getAll());

    // Listen for updates
    const handleUpdate = () => setItems(CartStorage.getAll());
    window.addEventListener("cart:updated", handleUpdate);
    
    return () => window.removeEventListener("cart:updated", handleUpdate);
  }, []);

  const addItem = (item: CartItem) => CartStorage.add(item);
  const updateQuantity = (productId: string, quantity: number) => CartStorage.update(productId, quantity);
  const removeItem = (productId: string) => CartStorage.remove(productId);
  const clearCart = () => CartStorage.clear();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

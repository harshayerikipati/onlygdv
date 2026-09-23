import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [vendorId, setVendorId] = useState(null);

  function addItem(product) {
    if (vendorId && vendorId !== product.vendorId) {
      setItems([{ product, qty: 1 }]);
      setVendorId(product.vendorId);
      return;
    }
    setVendorId(product.vendorId);
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
    setVendorId(null);
  }

  const total = items.reduce((sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, vendorId, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

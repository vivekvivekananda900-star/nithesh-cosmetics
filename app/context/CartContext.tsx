"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  description?: string;
  deliveryFee?: number;
}

interface CartItem extends Product {
  deliveryFee: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

const CartContext =
  createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [hydrated, setHydrated] =
    useState(false);

  /* =========================
     LOAD CART
  ========================= */

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("cart");

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  /* =========================
     SAVE CART
  ========================= */

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart, hydrated]);

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (
    product: Product
  ) => {
    setCart((prev) => {
      const existing =
        prev.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          deliveryFee:
            product.deliveryFee ?? 0,
          quantity: 1,
        },
      ];
    });
  };

  /* =========================
     REMOVE ITEM
  ========================= */

  const removeFromCart = (
    id: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  /* =========================
     INCREASE QUANTITY
  ========================= */

  const increaseQuantity = (
    id: string
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  /* =========================
     DECREASE QUANTITY
  ========================= */

  const decreaseQuantity = (
    id: string
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  /* =========================
     CLEAR CART
  ========================= */

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
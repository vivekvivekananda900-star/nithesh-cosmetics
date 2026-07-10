"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";


interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  image?: string;
  description?: string;
}


interface CartItem extends Product {
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



  // Load cart
  useEffect(() => {

    const savedCart =
      localStorage.getItem("cart");


    if (savedCart) {

      setCart(
        JSON.parse(savedCart)
      );

    }

  }, []);





  // Save cart
  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);






  // Add to Cart
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
          quantity: 1,
        },

      ];


    });


  };







  // Remove item
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







  // Increase quantity
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








  // Decrease quantity
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







  // Clear cart
  const clearCart = () => {

    setCart([]);

    localStorage.removeItem(
      "cart"
    );

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
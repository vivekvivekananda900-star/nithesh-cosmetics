"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, addToCart, decreaseQty, clearCart } = useCart();
  const router = useRouter();

  // 💰 total price
  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>🛒 My Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((item: any) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              margin: "10px 0",
              padding: 10,
            }}
          >
            <img src={item.image} width={100} />

            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            {/* Quantity controls */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => decreaseQty(item.id)}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => addToCart(item)}>+</button>
            </div>
          </div>
        ))
      )}

      {/* Bottom section */}
      {cart.length > 0 && (
        <>
          <h2>Total: ₹{total}</h2>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={clearCart}>Clear Cart</button>

            {/* 🟢 CHECKOUT BUTTON */}
            <button
              onClick={() => router.push("/checkout")}
              style={{
                background: "green",
                color: "white",
                padding: 10,
              }}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
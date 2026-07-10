"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { db, auth } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { generateInvoice } from "@/app/lib/generateInvoice";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.qty,
    0
  );

  const placeOrder = async () => {
    if (!name || !address || !phone) {
      alert("Please fill all details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const docRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        email: user.email,
        customer: {
          name,
          phone,
          address,
        },
        items: cart,
        total,
        paymentMethod: "Cash on Delivery",
        status: "pending",
        createdAt: serverTimestamp(),
      });

      generateInvoice(
        docRef.id,
        {
          name,
          phone,
          address,
        },
        cart,
        total
      );

      alert(`Order placed successfully!\nOrder ID: ${docRef.id}`);

      clearCart();

      setName("");
      setPhone("");
      setAddress("");

      router.push("/my-orders");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Checkout 🧾</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 20,
          height: 100,
        }}
      />

      <h2>Order Summary</h2>

      {cart.map((item: any) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <span>
            {item.name} × {item.qty}
          </span>

          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <hr />

      <h2>Total: ₹{total}</h2>

      <button
        onClick={placeOrder}
        disabled={loading}
        style={{
          background: "green",
          color: "white",
          padding: 12,
          border: "none",
          width: "100%",
          marginTop: 20,
          cursor: "pointer",
          borderRadius: 8,
          fontSize: 16,
        }}
      >
        {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
      </button>
    </div>
  );
}
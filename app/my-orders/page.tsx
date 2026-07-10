"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    }

    setLoading(false);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order: any) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 20,
              borderRadius: 10,
            }}
          >
            <h3>Order ID: {order.id}</h3>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    order.status === "delivered"
                      ? "green"
                      : order.status === "shipped"
                      ? "blue"
                      : "orange",
                }}
              >
                {order.status}
              </span>
            </p>

            <p>
              <strong>Total:</strong> ₹{order.total}
            </p>

            <h4>Products</h4>

            {order.items?.map((item: any) => (
              <div key={item.id}>
                {item.name} × {item.qty} - ₹{item.price * item.qty}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
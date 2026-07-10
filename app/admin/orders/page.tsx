"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

interface Order {
  id: string;
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  items?: any[];
  total?: number;
  status?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Order[];

      setOrders(list);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🟢 UPDATE STATUS
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status,
      });

      fetchOrders();
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 Admin Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders
          .filter((order) => order.customer) // 🟢 SAFE FILTER
          .map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid gray",
                margin: 10,
                padding: 10,
                borderRadius: 8,
              }}
            >
              {/* 🟢 CUSTOMER INFO (SAFE) */}
              <h3>{order.customer?.name || "No Name"}</h3>
              <p>{order.customer?.phone || "No Phone"}</p>
              <p>{order.customer?.address || "No Address"}</p>

              {/* TOTAL */}
              <h4>Total: ₹{order.total || 0}</h4>

              {/* STATUS */}
              <p>
                Status:{" "}
                <b
                  style={{
                    color:
                      order.status === "delivered"
                        ? "green"
                        : order.status === "shipped"
                        ? "blue"
                        : "orange",
                  }}
                >
                  {order.status || "pending"}
                </b>
              </p>

              {/* ITEMS */}
              <details>
                <summary>View Items</summary>

                {order.items?.length ? (
                  order.items.map((item: any, i: number) => (
                    <p key={i}>
                      {item.name} × {item.qty}
                    </p>
                  ))
                ) : (
                  <p>No items</p>
                )}
              </details>

              {/* STATUS BUTTONS */}
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={() => updateStatus(order.id, "pending")}>
                  Pending
                </button>

                <button onClick={() => updateStatus(order.id, "shipped")}>
                  Shipped
                </button>

                <button onClick={() => updateStatus(order.id, "delivered")}>
                  Delivered
                </button>
              </div>
            </div>
          ))
      )}
    </div>
  );
}
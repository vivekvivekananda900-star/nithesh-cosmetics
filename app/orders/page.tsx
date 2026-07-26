"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

type Product = {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;
  user_id: string;
  customer_name: string;
  phone: string;
  address: string;
  products: Product[];
  total: number;
  Order_status: string;
  created_at: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">
          Loading Orders...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="sticky top-0 bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-center">
          📦 My Orders
        </h1>
      </div>

      <div className="p-4">

        {orders.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-8 text-center">

            <h2 className="text-2xl font-bold">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Start shopping to see your orders here.
            </p>

            <Link
              href="/products"
              className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md p-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <h2 className="font-bold text-lg">
                      #{order.id}
                    </h2>
                  </div>

                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {order.Order_status || "Pending"}
                  </span>

                </div>

                {/* Date */}
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(order.created_at).toLocaleString()}
                </p>

                {/* Address */}
                <div className="mt-4">
                  <p className="font-semibold">
                    Delivery Address
                  </p>

                  <p className="text-gray-600">
                    {order.address}
                  </p>
                </div>

                {/* Total */}
                <div className="mt-4 flex justify-between items-center">

                  <span className="font-semibold">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-orange-600">
                    ₹{order.total}
                  </span>

                </div>

                {/* Products */}
                <div className="mt-5 border-t pt-4">

                  <h3 className="font-bold mb-3">
                    Products
                  </h3>

                  {(order.products || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b"
                    >

                      <div className="flex items-center gap-3">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                            📦
                          </div>
                        )}

                        <div>

                          <p className="font-semibold">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="font-bold">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>
                  ))}

                </div>

                {/* Buttons */}
                <div className="mt-5">
                  <Link
                    href={`/orders/${order.id}`}
                    className="block w-full bg-orange-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                  >
                    🚚 Track Order
                  </Link>
                </div>

              </div>
            ))}
          </div>

        )}

      </div>

    </main>
  );
}
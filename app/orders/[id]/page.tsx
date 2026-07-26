"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  customer_name: string;
  phone: string;
  address: string;
  products: Product[];
  total: number;
  Order_status: string;
  created_at: string;
};

const steps = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function TrackOrderPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setOrder(data as Order);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">
          Loading Order...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold">
          Order Not Found
        </p>
      </main>
    );
  }

  const currentStep = steps.indexOf(order.Order_status);

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="bg-white shadow sticky top-0 p-4">
        <h1 className="text-2xl font-bold text-center">
          🚚 Track Order
        </h1>
      </div>

      <div className="p-4">
        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow p-5">

          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-lg font-bold">
                Order #{order.id}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
              {order.Order_status}
            </span>

          </div>

          <div className="mt-5">

            <p className="font-semibold">
              Customer
            </p>

            <p>{order.customer_name}</p>

            <p>{order.phone}</p>

            <p className="text-gray-600 mt-2">
              📍 {order.address}
            </p>

          </div>

          <div className="mt-5 border-t pt-4">

            <p className="text-xl font-bold text-orange-600">
              Total: ₹{order.total}
            </p>

          </div>

        </div>

        {/* Delivery Timeline */}

        <div className="bg-white rounded-2xl shadow p-5 mt-5">

          <h2 className="text-xl font-bold mb-6">
            🚚 Delivery Progress
          </h2>

          {steps.map((step, index) => (

            <div
              key={step}
              className="flex gap-4"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index <= currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  ✓
                </div>

                {index !== steps.length - 1 && (

                  <div
                    className={`w-1 h-12 ${
                      index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />

                )}

              </div>

              <div className="pb-8">

                <p className="font-semibold text-lg">
                  {step}
                </p>

                {index <= currentStep ? (
                  <p className="text-green-600 text-sm">
                    Completed
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Waiting...
                  </p>
                )}

              </div>

            </div>

          ))}
          </div>

        {/* Ordered Products */}
        <div className="bg-white rounded-2xl shadow p-5 mt-5">

          <h2 className="text-xl font-bold mb-4">
            📦 Ordered Products
          </h2>

          {(order.products || []).map((item, index) => (

            <div
              key={index}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >

              <div className="flex items-center gap-3">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}

                <div>
                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-gray-500 text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>

              </div>

              <p className="font-bold text-orange-600">
                ₹{item.price * item.quantity}
              </p>

            </div>

          ))}

        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">

          <a
            href="tel:+919676578296"
            className="bg-green-600 text-white text-center py-3 rounded-xl font-semibold"
          >
            📞 Call
          </a>

          <a
            href="https://wa.me/9676578296"
            target="_blank"
            className="bg-green-500 text-white text-center py-3 rounded-xl font-semibold"
          >
            💬 WhatsApp
          </a>

        </div>

        <Link
          href="/orders"
          className="block mt-6 bg-orange-500 text-white text-center py-3 rounded-xl font-semibold"
        >
          ← Back to My Orders
        </Link>

      </div>

    </main>
  );
}
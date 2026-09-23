"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

import {
  ArrowLeft,
  Box,
  CheckCircle2,
  Clock3,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
  ChevronRight,
  ReceiptText,
} from "lucide-react";

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  product_total?: number;
  delivery_fee?: number;
  payment_method?: string;
  payment_status?: string;
  created_at?: string;
  products?: OrderProduct[];
}

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(price: number) {
    return Number(price || 0).toLocaleString("en-IN");
  }

  function formatDate(date?: string) {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusStyle(status?: string) {
    const value = status?.toLowerCase();

    if (value === "delivered") {
      return {
        className:
          "bg-green-50 text-green-700 border-green-100",
        icon: <CheckCircle2 size={14} />,
        label: "Delivered",
      };
    }

    if (
      value === "shipped" ||
      value === "on the way"
    ) {
      return {
        className:
          "bg-blue-50 text-blue-700 border-blue-100",
        icon: <Truck size={14} />,
        label:
          value === "on the way"
            ? "On The Way"
            : "Shipped",
      };
    }

    if (value === "confirmed") {
      return {
        className:
          "bg-violet-50 text-violet-700 border-violet-100",
        icon: <PackageCheck size={14} />,
        label: "Confirmed",
      };
    }

    return {
      className:
        "bg-orange-50 text-orange-700 border-orange-100",
      icon: <Clock3 size={14} />,
      label: status || "Pending",
    };
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e7]">
        <div className="text-center">

          <div className="relative mx-auto h-16 w-16">

            <div className="absolute inset-0 rounded-full border-4 border-orange-100" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-orange-500" />

            <Package
              size={24}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500"
            />

          </div>

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading your orders...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf5] via-[#fff7f0] to-white pb-28">

      {/* Background glow */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute -right-32 top-[500px] h-96 w-96 rounded-full bg-rose-200/20 blur-3xl" />

      </div>

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">

          <button
            onClick={() => router.back()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
          >
            <ArrowLeft size={21} />
          </button>

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500 sm:text-xs">
              Nithesh Cosmetics
            </p>

            <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              My Orders
            </h1>

          </div>

          <div className="ml-auto rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
            {orders.length}{" "}
            {orders.length === 1 ? "Order" : "Orders"}
          </div>

        </div>

      </header>

      <div className="relative z-10 mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-9">

        {/* ================= EMPTY ================= */}

        {orders.length === 0 ? (
          <div className="flex min-h-[65vh] items-center justify-center">

            <div className="w-full max-w-md text-center">

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(249,115,22,0.12)]">

                <ShoppingBag
                  size={48}
                  strokeWidth={1.6}
                  className="text-orange-500"
                />

              </div>

              <h2 className="mt-7 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Your beauty collection is waiting. Start shopping
                and your orders will appear here.
              </p>

              <button
                onClick={() => router.push("/products")}
                className="mt-7 inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Explore Products

                <ChevronRight size={18} />
              </button>

            </div>

          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">

            {orders.map((order, index) => {
              const status =
                getStatusStyle(order.status);

              return (
                <article
                  key={order.id}
                  className="order-card overflow-hidden rounded-[26px] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(15,23,42,0.09)] sm:rounded-[30px]"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >

                  {/* Order header */}

                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-orange-50/70 to-white p-4 sm:p-5">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">

                        <Box size={20} />

                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                          Order ID
                        </p>

                        <p className="mt-0.5 truncate text-sm font-black text-gray-900 sm:text-base">
                          #{order.id.slice(0, 10)}
                        </p>

                        <p className="mt-1 text-[10px] font-medium text-gray-400 sm:text-xs">
                          {formatDate(order.created_at)}
                        </p>

                      </div>

                    </div>

                    <div
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold sm:text-xs ${status.className}`}
                    >
                      {status.icon}

                      {status.label}
                    </div>

                  </div>

                  {/* Products */}

                  <div className="p-4 sm:p-5">

                    <div className="space-y-3">

                      {order.products?.map(
                        (item, itemIndex) => (
                          <div
                            key={
                              item.id ||
                              `${order.id}-${itemIndex}`
                            }
                            className="flex items-center gap-3 rounded-2xl bg-gray-50/80 p-3"
                          >

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">

                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-contain p-1.5"
                                />
                              ) : (
                                <Package
                                  size={24}
                                  className="text-gray-300"
                                />
                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="line-clamp-2 text-sm font-bold leading-5 text-gray-900">
                                {item.name}
                              </p>

                              <p className="mt-1 text-xs font-medium text-gray-500">
                                Qty: {item.quantity}
                              </p>

                            </div>

                            <div className="shrink-0 text-right">

                              <p className="text-sm font-black text-orange-600">
                                â‚¹
                                {formatPrice(
                                  item.price *
                                    item.quantity
                                )}
                              </p>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                    {/* Summary */}

                    <div className="mt-5 border-t border-gray-100 pt-5">

                      <div className="grid gap-3 sm:grid-cols-2">

                        <div className="rounded-2xl bg-gray-50 p-4">

                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                            <ReceiptText size={15} />
                            Payment
                          </div>

                          <p className="mt-2 text-sm font-black text-gray-900">
                            {order.payment_method ||
                              "Cash on Delivery"}
                          </p>

                        </div>

                        <div className="rounded-2xl bg-orange-50/70 p-4">

                          <p className="text-xs font-bold text-orange-600">
                            Order Total
                          </p>

                          <p className="mt-1 text-2xl font-black tracking-tight text-orange-600">
                            â‚¹{formatPrice(order.total)}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>

      {/* Animation */}

      

    </main>
  );
}

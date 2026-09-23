"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

import {
  ArrowLeft,
  Box,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
  ChevronRight,
} from "lucide-react";

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

  // Support both old + new column names
  Order_status?: string;
  status?: string;

  created_at: string;
};

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
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
        console.error(error);
        return;
      }

      setOrders((data as Order[]) || []);
    } catch (error) {
      console.error("Order loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(price: number) {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getStatus(order: Order) {
    return (
      order.status ||
      order.Order_status ||
      "Pending"
    );
  }

  function getStatusStyle(status: string) {
    const value = status.toLowerCase();

    if (value === "delivered") {
      return {
        className:
          "border-green-100 bg-green-50 text-green-700",
        icon: <CheckCircle2 size={14} />,
      };
    }

    if (
      value === "shipped" ||
      value === "out for delivery"
    ) {
      return {
        className:
          "border-blue-100 bg-blue-50 text-blue-700",
        icon: <Truck size={14} />,
      };
    }

    if (
      value === "processing" ||
      value === "confirmed"
    ) {
      return {
        className:
          "border-violet-100 bg-violet-50 text-violet-700",
        icon: <Package size={14} />,
      };
    }

    return {
      className:
        "border-orange-100 bg-orange-50 text-orange-700",
      icon: <Clock3 size={14} />,
    };
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e8]">

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

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="orders-blob-one absolute -left-36 top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="orders-blob-two absolute -right-36 top-[600px] h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />

      </div>

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">

          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="min-w-0">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500 sm:text-xs">
              Nithesh Cosmetics
            </p>

            <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              My Orders
            </h1>

          </div>

          <div className="ml-auto rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">

            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}

          </div>

        </div>

      </header>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-9">

        {/* ================= EMPTY ORDERS ================= */}

        {orders.length === 0 ? (
          <div className="flex min-h-[65vh] items-center justify-center">

            <div className="w-full max-w-md text-center">

              <div className="empty-icon mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(249,115,22,0.14)]">

                <ShoppingBag
                  size={48}
                  strokeWidth={1.6}
                  className="text-orange-500"
                />

              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.17em] text-orange-600">

                <Sparkles size={13} />

                Nithesh Cosmetics

              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Start shopping for your favourite beauty products.
                Your orders will appear here after checkout.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(249,115,22,0.35)] active:scale-95"
              >
                Continue Shopping

                <ChevronRight size={18} />
              </Link>

            </div>

          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">

            {orders.map((order, index) => {
              const status =
                getStatus(order);

              const statusStyle =
                getStatusStyle(status);

              return (
                <article
                  key={order.id}
                  className="order-card overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.09)] sm:rounded-[32px]"
                  style={{
                    animationDelay: `${index * 70}ms`,
                  }}
                >

                  {/* ================= ORDER HEADER ================= */}

                  <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50/80 via-white to-white p-4 sm:p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">

                          <Box size={21} />

                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                            Order ID
                          </p>

                          <p className="mt-0.5 truncate text-sm font-black text-gray-900 sm:text-base">
                            #{order.id.slice(0, 12)}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] font-medium text-gray-400 sm:text-xs">

                            <span>
                              {formatDate(
                                order.created_at
                              )}
                            </span>

                            <span>â€¢</span>

                            <span>
                              {formatTime(
                                order.created_at
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      <div
                        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold sm:text-xs ${statusStyle.className}`}
                      >
                        {statusStyle.icon}

                        {status}
                      </div>

                    </div>

                  </div>

                  {/* ================= MAIN DETAILS ================= */}

                  <div className="p-4 sm:p-5">

                    {/* Address */}

                    <div className="flex items-start gap-3 rounded-2xl bg-gray-50/80 p-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">

                        <MapPin size={18} />

                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                          Delivery Address
                        </p>

                        <p className="mt-1 break-words text-sm leading-6 text-gray-700">
                          {order.address}
                        </p>

                      </div>

                    </div>

                    {/* ================= PRODUCTS ================= */}

                    <div className="mt-5">

                      <div className="mb-3 flex items-center justify-between">

                        <h3 className="text-sm font-black text-gray-900 sm:text-base">
                          Products
                        </h3>

                        <p className="text-xs font-semibold text-gray-400">
                          {order.products?.length || 0}{" "}
                          {(order.products?.length || 0) ===
                          1
                            ? "item"
                            : "items"}
                        </p>

                      </div>

                      <div className="space-y-3">

                        {(order.products || []).map(
                          (item, itemIndex) => (
                            <div
                              key={
                                item.id ||
                                `${order.id}-${itemIndex}`
                              }
                              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-3"
                            >

                              {/* Product image */}

                              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white sm:h-20 sm:w-20">

                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-contain p-1.5"
                                  />
                                ) : (
                                  <Package
                                    size={26}
                                    className="text-gray-300"
                                  />
                                )}

                              </div>

                              {/* Product info */}

                              <div className="min-w-0 flex-1">

                                <p className="line-clamp-2 text-sm font-bold leading-5 text-gray-900 sm:text-base">
                                  {item.name}
                                </p>

                                <p className="mt-1 text-xs font-medium text-gray-500">
                                  Qty: {item.quantity}
                                </p>

                              </div>

                              {/* Product total */}

                              <p className="shrink-0 text-sm font-black text-orange-600 sm:text-base">
                                â‚¹
                                {formatPrice(
                                  item.price *
                                    item.quantity
                                )}
                              </p>

                            </div>
                          )
                        )}

                      </div>

                    </div>

                    {/* ================= TOTAL ================= */}

                    <div className="mt-5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-4">

                      <div className="flex items-end justify-between gap-3">

                        <div>

                          <p className="text-xs font-bold text-gray-500">
                            Total Amount
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                            Final order total
                          </p>

                        </div>

                        <p className="text-2xl font-black tracking-tight text-orange-600 sm:text-3xl">
                          â‚¹
                          {formatPrice(
                            order.total
                          )}
                        </p>

                      </div>

                    </div>

                    {/* ================= TRACK BUTTON ================= */}

                    <Link
                      href={`/orders/${order.id}`}
                      className="group mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(249,115,22,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(249,115,22,0.32)] active:scale-[0.98] sm:text-base"
                    >
                      <Truck size={19} />

                      Track Order

                      <ChevronRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>

      {/* ================= ANIMATIONS ================= */}

      

    </main>
  );
}

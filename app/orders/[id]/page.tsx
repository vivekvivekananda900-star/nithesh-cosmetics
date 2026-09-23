"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

import {
  ArrowLeft,
  Box,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
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
  customer_name: string;
  phone: string;
  address: string;
  products: Product[];
  total: number;
  Order_status?: string;
  status?: string;
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
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  async function loadOrder() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setOrder(null);
        return;
      }

      if (data) {
        setOrder(data as Order);
      }
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

  function normalizeStatus(status?: string) {
    if (!status) return "Pending";

    const value = status
      .trim()
      .toLowerCase();

    if (value === "pending") {
      return "Pending";
    }

    if (value === "processing") {
      return "Processing";
    }

    if (value === "shipped") {
      return "Shipped";
    }

    if (
      value === "out for delivery" ||
      value === "out_for_delivery"
    ) {
      return "Out for Delivery";
    }

    if (value === "delivered") {
      return "Delivered";
    }

    return status;
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e8]">

        <div className="text-center">

          <div className="relative mx-auto h-16 w-16">

            <div className="absolute inset-0 rounded-full border-4 border-orange-100" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-orange-500" />

            <Truck
              size={24}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500"
            />

          </div>

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading your order...
          </p>

        </div>

      </main>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e8] px-4">

        <div className="w-full max-w-md text-center">

          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[30px] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(249,115,22,0.12)]">

            <Package
              size={48}
              className="text-orange-500"
            />

          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900">
            Order Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            We couldn't find this order.
          </p>

          <button
            onClick={() =>
              router.push("/orders")
            }
            className="mt-7 rounded-2xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg transition-all active:scale-95"
          >
            Back to Orders
          </button>

        </div>

      </main>
    );
  }

  const orderStatus =
    normalizeStatus(
      order.Order_status ||
        order.status
    );

  const currentStep = Math.max(
    0,
    steps.indexOf(orderStatus)
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf5] via-[#fff7f0] to-white pb-28">

      {/* Background Glow */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute -right-32 top-[550px] h-96 w-96 rounded-full bg-green-100/30 blur-3xl" />

      </div>

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">

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
              Track Order
            </h1>

          </div>

          <div className="ml-auto hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700 sm:flex">

            <Truck size={15} />

            Live Status

          </div>

        </div>

      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-9">

        {/* ================= HERO STATUS ================= */}

        <section
          className="
            track-enter
            relative
            overflow-hidden
            rounded-[30px]
            bg-gradient-to-br
            from-orange-500
            via-orange-500
            to-amber-400
            p-5
            text-white
            shadow-[0_20px_55px_rgba(249,115,22,0.25)]
            sm:p-7
          "
        >

          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-yellow-200/15 blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-start justify-between gap-3">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] backdrop-blur-md sm:text-xs">

                  <Sparkles size={13} />

                  Order Tracking

                </div>

                <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                  Your Order is
                  <span className="block">
                    {orderStatus}
                  </span>
                </h2>

                <p className="mt-2 text-sm text-white/80">
                  Order placed on{" "}
                  {formatDate(
                    order.created_at
                  )}
                </p>

              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md sm:h-16 sm:w-16">

                <Truck size={29} />

              </div>

            </div>

            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">

              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-bold sm:text-base">
                {order.id}
              </p>

            </div>

          </div>

        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]">

          {/* ================= LEFT ================= */}

          <div className="space-y-5">

            {/* DELIVERY TIMELINE */}

            <section className="track-enter rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">

                  <Truck size={20} />

                </div>

                <div>

                  <h2 className="text-xl font-black">
                    Delivery Progress
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Follow your order journey
                  </p>

                </div>

              </div>

              <div>

                {steps.map(
                  (step, index) => {
                    const completed =
                      index <= currentStep;

                    const active =
                      index === currentStep;

                    return (
                      <div
                        key={step}
                        className="flex gap-4"
                      >

                        <div className="flex flex-col items-center">

                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-full
                              border-4
                              transition-all
                              duration-500
                              ${
                                active
                                  ? "border-orange-100 bg-orange-500 text-white shadow-[0_0_0_5px_rgba(249,115,22,0.08)]"
                                  : completed
                                  ? "border-green-100 bg-green-500 text-white"
                                  : "border-gray-100 bg-gray-200 text-gray-400"
                              }
                            `}
                          >
                            {completed ? (
                              <Check
                                size={18}
                                strokeWidth={3}
                              />
                            ) : (
                              <Clock3
                                size={16}
                              />
                            )}
                          </div>

                          {index !==
                            steps.length -
                              1 && (
                            <div
                              className={`
                                my-1
                                h-14
                                w-1
                                rounded-full
                                ${
                                  index <
                                  currentStep
                                    ? "bg-green-500"
                                    : "bg-gray-200"
                                }
                              `}
                            />
                          )}

                        </div>

                        <div className="pb-7 pt-1">

                          <p
                            className={`
                              text-base
                              font-black
                              ${
                                active
                                  ? "text-orange-600"
                                  : completed
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {step}
                          </p>

                          <p
                            className={`
                              mt-1
                              text-xs
                              font-medium
                              ${
                                completed
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {active
                              ? "Current status"
                              : completed
                              ? "Completed"
                              : "Waiting..."}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>

            {/* PRODUCTS */}

            <section className="track-enter rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                  <Package size={20} />

                </div>

                <div>

                  <h2 className="text-xl font-black">
                    Ordered Products
                  </h2>

                  <p className="text-xs text-gray-500">
                    Items in this order
                  </p>

                </div>

              </div>

              <div className="space-y-3">

                {(order.products || []).map(
                  (item, index) => (
                    <div
                      key={
                        item.id ||
                        `${item.name}-${index}`
                      }
                      className="flex items-center gap-3 rounded-2xl bg-gray-50/80 p-3"
                    >

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <Package
                            size={27}
                            className="text-gray-300"
                          />
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="line-clamp-2 text-sm font-bold leading-5 text-gray-900 sm:text-base">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Qty:{" "}
                          {item.quantity}
                        </p>

                      </div>

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

            </section>

          </div>

          {/* ================= RIGHT ================= */}

          <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">

            {/* ORDER DETAILS */}

            <section className="track-enter rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    Delivery Details
                  </h2>

                  <p className="text-xs text-gray-500">
                    Customer information
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                <div className="rounded-2xl bg-gray-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {order.customer_name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {order.phone}
                  </p>

                </div>

                <div className="rounded-2xl bg-gray-50 p-4">

                  <div className="flex items-start gap-2">

                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-orange-500"
                    />

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Delivery Address
                      </p>

                      <p className="mt-1 break-words text-sm leading-6 text-gray-700">
                        {order.address}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">

                <div className="flex items-end justify-between">

                  <span className="text-sm font-medium text-gray-500">
                    Order Total
                  </span>

                  <span className="text-2xl font-black text-orange-600">
                    â‚¹
                    {formatPrice(
                      order.total
                    )}
                  </span>

                </div>

              </div>

            </section>

            {/* SUPPORT */}

            <section className="track-enter rounded-[28px] border border-gray-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">

              <h3 className="font-black text-gray-900">
                Need Help?
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Contact Nithesh Cosmetics for order assistance.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <a
                  href="tel:+919676578296"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-green-600 px-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-700 active:scale-95"
                >
                  <Phone size={17} />

                  Call
                </a>

                <a
                  href="https://wa.me/919676578296"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                >
                  ðŸ’¬

                  WhatsApp
                </a>

              </div>

            </section>

            {/* BACK */}

            <Link
              href="/orders"
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 font-bold text-white shadow-[0_12px_30px_rgba(249,115,22,0.26)] transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <ShoppingBag size={18} />

              Back to My Orders
            </Link>

          </aside>

        </div>

      </div>

      {/* ================= ANIMATION ================= */}

      

    </main>
  );
}

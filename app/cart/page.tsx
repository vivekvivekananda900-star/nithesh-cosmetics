"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const router = useRouter();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 999 ? 0 : 50;
  const total = subtotal + delivery;

  const formatPrice = (price: number) =>
    price.toLocaleString("en-IN");

  /* ================= EMPTY CART ================= */

  if (cart.length === 0) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fffaf7] via-white to-[#fff2e8] px-5 py-10">

        {/* Background Decorations */}
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-center">

          {/* Icon */}
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2.5rem] border border-orange-100 bg-white shadow-[0_20px_60px_rgba(249,115,22,0.15)]">

            <ShoppingCart
              size={58}
              strokeWidth={1.7}
              className="text-orange-500"
            />

          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600">

            <Sparkles size={14} />

            Nithesh Cosmetics

          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
            Discover your favourite beauty essentials and add something
            special to your cart.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="group mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 font-bold text-white shadow-[0_12px_35px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(249,115,22,0.35)] active:scale-[0.98] sm:w-auto"
          >
            Continue Shopping

            <ChevronRight
              size={19}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

        </div>

      </main>
    );
  }

  /* ================= CART PAGE ================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] pb-44 md:pb-32">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="absolute -right-40 top-[500px] h-96 w-96 rounded-full bg-rose-100/40 blur-3xl" />

      </div>

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-40 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">

          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="min-w-0">

            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-500">
              Shopping Bag
            </p>

            <h1 className="truncate text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
              My Cart
            </h1>

          </div>

          <div className="ml-auto rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
            {cart.length} {cart.length === 1 ? "Item" : "Items"}
          </div>

        </div>

      </header>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-8 lg:py-10">

        {/* ================= CART ITEMS ================= */}

        <section>

          <div className="mb-4 hidden items-center justify-between sm:flex">

            <div>

              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                Your Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review your selected beauty products.
              </p>

            </div>

          </div>

          <div className="space-y-3 sm:space-y-4">

            {cart.map((item) => (

              <article
                key={item.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-5"
              >

                <div className="flex gap-3 sm:gap-5">

                  {/* Product Image */}
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-orange-50 sm:h-36 sm:w-36 sm:rounded-3xl">

                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />

                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-start gap-2">

                      <div className="min-w-0 flex-1">

                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-500 sm:text-xs">
                          Nithesh Cosmetics
                        </p>

                        <h2 className="line-clamp-2 text-sm font-bold leading-5 text-gray-900 sm:text-lg sm:leading-6">
                          {item.name}
                        </h2>

                      </div>

                      {/* Delete Desktop */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-90 sm:flex"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-1">

                      <span className="text-xl font-black tracking-tight text-orange-600 sm:text-2xl">
                        ₹{formatPrice(item.price)}
                      </span>

                    </div>

                    {/* Bottom Controls */}
                    <div className="mt-3 flex items-center justify-between gap-2 sm:mt-5">

                      {/* Quantity */}
                      <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-1">

                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm transition-all hover:bg-orange-50 hover:text-orange-600 active:scale-90 sm:h-9 sm:w-9"
                        >
                          <Minus size={15} strokeWidth={2.5} />
                        </button>

                        <span className="min-w-9 text-center text-sm font-black text-gray-900 sm:min-w-11 sm:text-base">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm transition-all hover:bg-orange-600 active:scale-90 sm:h-9 sm:w-9"
                        >
                          <Plus size={15} strokeWidth={2.5} />
                        </button>

                      </div>

                      {/* Delete Mobile */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all active:scale-90 sm:hidden"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>

        {/* ================= PRICE DETAILS ================= */}

        <aside className="lg:sticky lg:top-28 lg:h-fit">

          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.06)]">

            {/* Heading */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50/80 to-white px-5 py-5 sm:px-6">

              <h2 className="text-xl font-black tracking-tight text-gray-900">
                Price Details
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Complete order summary
              </p>

            </div>

            <div className="p-5 sm:p-6">

              <div className="space-y-4">

                <div className="flex items-center justify-between text-sm sm:text-base">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-800">
                    ₹{formatPrice(subtotal)}
                  </span>

                </div>

                <div className="flex items-center justify-between text-sm sm:text-base">

                  <span className="text-gray-500">
                    Delivery Charge
                  </span>

                  {delivery === 0 ? (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-extrabold text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-800">
                      ₹{delivery}
                    </span>
                  )}

                </div>

              </div>

              {/* Free Delivery Progress */}
              {subtotal <= 999 && (
                <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">

                  <p className="text-xs font-semibold leading-5 text-orange-700">
                    Add ₹{formatPrice(1000 - subtotal)} more to unlock
                    FREE delivery.
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (subtotal / 1000) * 100,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              )}

              <div className="my-5 h-px bg-gray-100" />

              {/* Total */}
              <div className="flex items-end justify-between">

                <div>

                  <p className="text-xs font-medium text-gray-500">
                    Total Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    Inclusive of delivery
                  </p>

                </div>

                <span className="text-2xl font-black tracking-tight text-orange-600">
                  ₹{formatPrice(total)}
                </span>

              </div>

              {/* Trust */}
              <div className="mt-6 grid gap-3">

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                    <Truck size={17} />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-gray-800">
                      Fast Delivery
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-500">
                      Free delivery on orders above ₹999
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                    <ShieldCheck size={17} />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-gray-800">
                      Secure Checkout
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-500">
                      Safe and protected shopping experience
                    </p>

                  </div>

                </div>

              </div>

              {/* Desktop Checkout */}
              <button
                onClick={() => router.push("/checkout")}
                className="group mt-6 hidden min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 font-bold text-white shadow-[0_12px_30px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(249,115,22,0.32)] active:scale-[0.98] lg:flex"
              >
                Proceed to Checkout

                <ChevronRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

            </div>

          </div>

        </aside>

      </div>

      {/* ================= MOBILE CHECKOUT BAR ================= */}

      <div className="fixed bottom-20 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:bottom-0 lg:hidden">

        <div className="mx-auto flex max-w-6xl items-center gap-3">

          <div className="min-w-0 flex-1">

            <p className="text-[11px] font-medium text-gray-500">
              Total Amount
            </p>

            <h2 className="truncate text-xl font-black tracking-tight text-orange-600 sm:text-2xl">
              ₹{formatPrice(total)}
            </h2>

          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="flex min-h-12 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(249,115,22,0.28)] transition-all active:scale-95 sm:min-h-14 sm:px-8 sm:text-base"
          >
            Checkout

            <ChevronRight size={17} />
          </button>

        </div>

      </div>

    </main>
  );
}
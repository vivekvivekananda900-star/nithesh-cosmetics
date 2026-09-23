"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  Check,
  CheckCircle2,
  Clipboard,
  Home,
  PackageCheck,
  Printer,
  ReceiptText,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const orderId =
    searchParams.get("orderId") || "";

  const [copied, setCopied] =
    useState(false);

  async function copyOrderId() {
    if (!orderId) return;

    try {
      await navigator.clipboard.writeText(
        orderId
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Unable to copy order ID:",
        error
      );
    }
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff4e9]
        to-white
        px-4
        py-10
      "
    >
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            success-blob-one
            absolute
            -left-28
            -top-24
            h-80
            w-80
            rounded-full
            bg-orange-300/30
            blur-3xl
          "
        />

        <div
          className="
            success-blob-two
            absolute
            -right-32
            top-1/3
            h-96
            w-96
            rounded-full
            bg-green-200/25
            blur-3xl
          "
        />

        <div
          className="
            success-blob-three
            absolute
            -bottom-32
            left-1/3
            h-96
            w-96
            rounded-full
            bg-amber-200/25
            blur-3xl
          "
        />

        <Sparkles
          className="sparkle-one absolute left-[10%] top-[18%] text-orange-300"
          size={22}
        />

        <Sparkles
          className="sparkle-two absolute right-[12%] top-[15%] text-green-300"
          size={18}
        />

        <Sparkles
          className="sparkle-three absolute bottom-[15%] right-[17%] text-orange-300"
          size={20}
        />

      </div>

      {/* ================= CARD ================= */}

      <section
        className="
          success-card
          relative
          z-10
          w-full
          max-w-lg
          overflow-hidden
          rounded-[32px]
          border
          border-white/80
          bg-white/95
          p-5
          text-center
          shadow-[0_30px_80px_rgba(15,23,42,0.14)]
          backdrop-blur-xl
          sm:p-8
        "
      >
        {/* Top decorative gradient */}

        <div
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            h-1.5
            bg-gradient-to-r
            from-orange-400
            via-green-500
            to-orange-400
          "
        />

        {/* ================= SUCCESS ICON ================= */}

        <div className="relative mx-auto flex h-28 w-28 items-center justify-center">

          <div
            className="
              success-ring
              absolute
              inset-0
              rounded-full
              bg-green-100
            "
          />

          <div
            className="
              success-icon
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-green-500
              to-emerald-600
              text-white
              shadow-[0_15px_40px_rgba(34,197,94,0.35)]
            "
          >
            <Check
              size={42}
              strokeWidth={3}
            />
          </div>

        </div>

        {/* Brand */}

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600 sm:text-xs">

          <Sparkles size={13} />

          Nithesh Cosmetics

        </div>

        {/* Heading */}

        <h1
          className="
            mt-5
            text-2xl
            font-black
            leading-tight
            tracking-tight
            text-gray-900
            sm:text-4xl
          "
        >
          Order Placed
          <span className="block text-green-600">
            Successfully!
          </span>
        </h1>

        <p
          className="
            mx-auto
            mt-3
            max-w-sm
            text-sm
            leading-6
            text-gray-500
            sm:text-base
          "
        >
          Thank you for shopping with Nithesh Cosmetics.
          Your order has been received successfully.
        </p>

        {/* ================= ORDER ID ================= */}

        <div
          className="
            mt-7
            rounded-[24px]
            border
            border-gray-100
            bg-gradient-to-br
            from-gray-50
            to-orange-50/50
            p-4
            text-left
            sm:p-5
          "
        >
          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-white
                text-orange-600
                shadow-sm
              "
            >
              <PackageCheck size={21} />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Order ID
              </p>

              <p
                className="
                  mt-1
                  break-all
                  text-sm
                  font-black
                  text-gray-900
                  sm:text-base
                "
              >
                {orderId || "Order confirmed"}
              </p>

            </div>

            {orderId && (
              <button
                onClick={copyOrderId}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-500
                  transition-all
                  hover:border-orange-200
                  hover:text-orange-600
                  active:scale-90
                "
                aria-label="Copy order ID"
              >
                {copied ? (
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />
                ) : (
                  <Clipboard size={18} />
                )}
              </button>
            )}

          </div>

          {copied && (
            <p className="mt-3 text-center text-xs font-bold text-green-600">
              Order ID copied
            </p>
          )}

        </div>

        {/* ================= INVOICE INFO ================= */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-3
            rounded-[22px]
            border
            border-green-100
            bg-green-50
            p-4
            text-left
          "
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
            <ReceiptText size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">
              Invoice Generated
            </p>

            <p className="mt-0.5 text-xs leading-5 text-gray-500">
              Your invoice is ready to print or save.
            </p>
          </div>

        </div>

        {/* ================= PRINT ================= */}

        <button
          onClick={() =>
            window.print()
          }
          className="
            group
            relative
            mt-6
            flex
            min-h-14
            w-full
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-gray-900
            to-black
            px-6
            py-4
            font-black
            text-white
            shadow-[0_14px_35px_rgba(15,23,42,0.25)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_18px_40px_rgba(15,23,42,0.32)]
            active:scale-[0.98]
          "
        >
          <span
            className="
              absolute
              inset-y-0
              -left-20
              w-16
              rotate-12
              bg-white/20
              blur-md
              transition-all
              duration-700
              group-hover:left-[120%]
            "
          />

          <Printer size={19} />

          Print / Save Invoice
        </button>

        {/* ================= ACTIONS ================= */}

        <div className="mt-3 grid grid-cols-2 gap-3">

          <Link
            href="/orders"
            className="
              flex
              min-h-13
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-orange-200
              bg-orange-50
              px-4
              py-3
              text-sm
              font-bold
              text-orange-600
              transition-all
              hover:bg-orange-100
              active:scale-[0.98]
            "
          >
            <ShoppingBag size={17} />

            My Orders
          </Link>

          <Link
            href="/"
            className="
              flex
              min-h-13
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-4
              py-3
              text-sm
              font-bold
              text-gray-700
              transition-all
              hover:border-orange-200
              hover:bg-orange-50
              hover:text-orange-600
              active:scale-[0.98]
            "
          >
            <Home size={17} />

            Continue
          </Link>

        </div>

        <p className="mt-6 text-[11px] leading-5 text-gray-400">
          We appreciate your order and hope you enjoy your
          Nithesh Cosmetics products.
        </p>

      </section>

      {/* ================= ANIMATIONS ================= */}

      

    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e8]">

          <div className="text-center">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

            <p className="mt-4 text-sm font-semibold text-gray-500">
              Preparing your order...
            </p>

          </div>

        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

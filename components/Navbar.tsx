"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Bell,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";

import { useCart } from "@/app/context/CartContext";
import SideDrawer from "./SideDrawer";

export default function Navbar() {
  const { cart } = useCart();

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <>
      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <header
        className="
          sticky
          top-0
          z-50
          w-full
          overflow-hidden
          border-b
          border-orange-400/20
          bg-gradient-to-br
          from-orange-500
          via-orange-500
          to-amber-500
          text-white
          shadow-[0_12px_35px_rgba(249,115,22,0.22)]
        "
      >
        {/* Decorative glow */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div
            className="
              absolute
              -left-14
              -top-16
              h-44
              w-44
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -right-20
              top-0
              h-52
              w-52
              rounded-full
              bg-yellow-200/10
              blur-3xl
            "
          />

        </div>

        {/* =========================
            TOP ROW
        ========================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            w-full
            max-w-7xl
            items-center
            justify-between
            px-3
            py-3
            sm:px-5
            sm:py-4
            lg:px-8
          "
        >
          {/* Menu */}

          <button
            type="button"
            onClick={() =>
              setDrawerOpen(true)
            }
            aria-label="Open menu"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-white/20
              bg-white/10
              text-white
              shadow-sm
              backdrop-blur-md
              transition-all
              duration-300
              hover:bg-white/20
              active:scale-90
              sm:h-11
              sm:w-11
            "
          >
            <Menu
              size={21}
              strokeWidth={2.4}
            />
          </button>

          {/* Brand */}

          <Link
            href="/"
            className="
              min-w-0
              flex-1
              px-2
              text-center
              sm:px-4
            "
          >
            <div
              className="
                hidden
                items-center
                justify-center
                gap-1.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-orange-100
                sm:flex
              "
            >
              <Sparkles size={11} />

              Premium Beauty Store
            </div>

            <h1
              className="
                truncate
                text-[17px]
                font-black
                uppercase
                tracking-[0.04em]
                text-white
                drop-shadow-sm
                sm:mt-0.5
                sm:text-2xl
                md:text-3xl
              "
            >
              Nithesh Cosmetics
            </h1>

            <p
              className="
                mt-0.5
                truncate
                text-[9px]
                font-medium
                tracking-wide
                text-orange-100
                sm:text-[11px]
              "
            >
              Barber & Cosmetics Store
            </p>
          </Link>

          {/* Account */}

          <Link
            href="/account"
            aria-label="Account"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-white/30
              bg-white
              text-orange-500
              shadow-[0_7px_18px_rgba(0,0,0,0.12)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-xl
              active:scale-90
              sm:h-11
              sm:w-11
            "
          >
            <User
              size={20}
              strokeWidth={2.3}
            />
          </Link>
        </div>

        {/* =========================
            DELIVERY CARD
        ========================= */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-7xl
            px-3
            pb-3
            sm:px-5
            sm:pb-4
            lg:px-8
          "
        >
          <div
            className="
              group
              flex
              w-full
              items-center
              gap-3
              rounded-[20px]
              border
              border-white/50
              bg-white/95
              p-3
              text-gray-900
              shadow-[0_8px_25px_rgba(15,23,42,0.12)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:bg-white
              sm:rounded-[24px]
              sm:p-4
            "
          >
            {/* Location icon */}

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-orange-100
                to-amber-50
                text-orange-600
                shadow-sm
                sm:h-12
                sm:w-12
              "
            >
              <MapPin
                size={20}
                strokeWidth={2.5}
              />
            </div>

            {/* Location text */}

            <div className="min-w-0 flex-1">

              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-gray-400
                  sm:text-[10px]
                "
              >
                Deliver to
              </p>

              <h3
                className="
                  mt-0.5
                  truncate
                  text-sm
                  font-black
                  text-gray-900
                  sm:text-base
                "
              >
                Nagarkurnool
              </h3>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[10px]
                  font-medium
                  text-gray-500
                  sm:text-xs
                "
              >
                Near VKR Hospital
              </p>

            </div>

            {/* Availability */}

            <div
              className="
                hidden
                items-center
                gap-1.5
                rounded-full
                bg-green-50
                px-3
                py-1.5
                text-[10px]
                font-black
                text-green-700
                sm:flex
              "
            >
              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-green-500
                "
              />

              Delivery Available
            </div>

            <ChevronRight
              size={18}
              className="
                shrink-0
                text-gray-300
                transition-transform
                duration-300
                group-hover:translate-x-1
                group-hover:text-orange-500
              "
            />
          </div>
        </div>
      </header>

      {/* =========================
          ACTION BAR
      ========================= */}

      <div
        className="
          relative
          z-40
          w-full
          border-b
          border-gray-100
          bg-white/95
          shadow-[0_5px_18px_rgba(15,23,42,0.05)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-around
            px-3
            py-2
            sm:px-5
            sm:py-2.5
            lg:px-8
          "
        >
          {/* Wishlist */}

          <NavbarAction
            href="/wishlist"
            label="Wishlist"
          >
            <Heart size={20} />
          </NavbarAction>

          {/* Notifications */}

          <NavbarAction
            href="/notifications"
            label="Notifications"
          >
            <Bell size={20} />
          </NavbarAction>

          {/* Cart */}

          <Link
            href="/cart"
            aria-label="Cart"
            className="
              group
              relative
              flex
              min-w-[72px]
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              px-3
              py-1.5
              text-gray-600
              transition-all
              duration-300
              hover:bg-orange-50
              hover:text-orange-600
              active:scale-95
            "
          >
            <div className="relative">

              <ShoppingCart
                size={20}
                strokeWidth={2.2}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:scale-105
                "
              />

              {cartCount > 0 && (
                <span
                  className="
                    cart-badge
                    absolute
                    -right-3
                    -top-2.5
                    flex
                    h-[18px]
                    min-w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white
                    bg-gradient-to-r
                    from-red-500
                    to-rose-600
                    px-1
                    text-[9px]
                    font-black
                    leading-none
                    text-white
                    shadow-[0_4px_10px_rgba(239,68,68,0.35)]
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </div>

            <span
              className="
                text-[9px]
                font-bold
                sm:text-[10px]
              "
            >
              Cart
            </span>
          </Link>

        </div>
      </div>

      {/* =========================
          SIDE DRAWER
      ========================= */}

      <SideDrawer
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
      />

      {/* =========================
          ANIMATION
      ========================= */}

      
    </>
  );
}

/* =========================
   ACTION BUTTON
========================= */

function NavbarAction({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="
        group
        flex
        min-w-[72px]
        flex-col
        items-center
        justify-center
        gap-1
        rounded-2xl
        px-3
        py-1.5
        text-gray-600
        transition-all
        duration-300
        hover:bg-orange-50
        hover:text-orange-600
        active:scale-95
      "
    >
      <span
        className="
          transition-transform
          duration-300
          group-hover:-translate-y-0.5
          group-hover:scale-105
        "
      >
        {children}
      </span>

      <span
        className="
          text-[9px]
          font-bold
          sm:text-[10px]
        "
      >
        {label}
      </span>
    </Link>
  );
}

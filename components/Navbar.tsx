"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  ShoppingCart,
  User,
  Bell,
  Heart,
  MapPin,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import SideDrawer from "./SideDrawer";

export default function Navbar() {
  const { cart } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-orange-500 text-white shadow-lg">

        {/* Top Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">

          {/* Menu */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-orange-600 transition shrink-0"
          >
            <Menu size={22} className="sm:w-6 sm:h-6" />
          </button>

          {/* Logo & Title */}
          <div className="flex-1 text-center px-2">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-wide uppercase text-white drop-shadow-md">
              Nithesh Cosmetics
            </h1>

            <p className="text-[11px] sm:text-xs text-orange-100 tracking-wider">
              Barber & Cosmetics Store
            </p>
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-orange-500 flex items-center justify-center shrink-0"
          >
            <User size={20} />
          </Link>

        </div>

        {/* Delivery Address */}
        <div className="px-3 sm:px-4 pb-3">

          <div className="bg-white rounded-2xl p-3 sm:p-4 text-black shadow">

            <div className="flex items-center gap-3">

              <MapPin
                size={18}
                className="text-orange-500 shrink-0"
              />

              <div>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  Deliver to
                </p>

                <h3 className="font-bold text-sm sm:text-base">
                  Nagarkurnool
                </h3>

                <p className="text-[11px] sm:text-xs text-gray-500">
                  Near VKR Hospital
                </p>
              </div>

            </div>

          </div>

        </div>

      </header>

      {/* Floating Action Icons */}
      <div className="sticky top-[120px] z-40 bg-white shadow-sm">

        <div className="flex items-center justify-around py-2.5 sm:py-3">

          <Link href="/wishlist">
            <Heart
              size={22}
              className="text-gray-700 hover:text-orange-500 transition"
            />
          </Link>

          <Link href="/notifications">
            <Bell
              size={22}
              className="text-gray-700 hover:text-orange-500 transition"
            />
          </Link>

          <Link
            href="/cart"
            className="relative"
          >
            <ShoppingCart
              size={22}
              className="text-gray-700 hover:text-orange-500 transition"
            />

            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}

          </Link>

        </div>

      </div>

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
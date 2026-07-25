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
        <div className="flex items-center justify-between px-4 py-4">

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-orange-600 transition"
          >
            <Menu size={26} />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-extrabold">
              Nithesh Cosmetics
            </h1>

            <p className="text-xs text-orange-100">
              Barber & Cosmetics Store
            </p>
          </div>

          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-white text-orange-500 flex items-center justify-center"
          >
            <User size={22} />
          </Link>

        </div>

        {/* Delivery Address */}
        <div className="px-4 pb-3">

          <div className="bg-white rounded-2xl p-4 text-black">

            <div className="flex items-center gap-2">

              <MapPin
                size={18}
                className="text-orange-500"
              />

              <div>

                <p className="text-xs text-gray-500">
                  Deliver to
                </p>

                <h3 className="font-bold">
                  Nagarkurnool
                </h3>

                <p className="text-xs text-gray-500">
                  Near VKR Hospital
                </p>

              </div>

            </div>

          </div>

        </div>

      </header>

      {/* Floating Action Icons */}
      <div className="sticky top-[120px] z-40 bg-white shadow-sm">

        <div className="flex items-center justify-around py-3">

          <Link href="/wishlist">
            <Heart
              size={24}
              className="text-gray-700"
            />
          </Link>

          <Link href="/notifications">
            <Bell
              size={24}
              className="text-gray-700"
            />
          </Link>

          <Link
            href="/cart"
            className="relative"
          >
            <ShoppingCart
              size={24}
              className="text-gray-700"
            />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
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
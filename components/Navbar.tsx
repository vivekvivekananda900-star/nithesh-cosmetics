"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
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
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">

        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3">

          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={26} />
          </button>

          <Link href="/" className="text-xl font-extrabold text-yellow-600">
            Nithesh Cosmetics
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/profile"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <User size={22} />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <ShoppingCart size={22} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

        </div>

        {/* Delivery Card */}
        <div className="px-4 pb-3">

          <div className="rounded-xl bg-yellow-100 border border-yellow-300 p-3">

            <p className="text-xs text-gray-500">
              Delivering To
            </p>

            <h3 className="font-bold text-gray-800">
              Nagarkurnool
            </h3>

            <p className="text-xs text-gray-600">
              Near VKR Hospital, Naganool Road
            </p>

          </div>

        </div>

        {/* Search */}
        <div className="px-4 pb-4">

          <div className="flex items-center bg-gray-100 rounded-xl px-3 h-12">

            <Search
              size={20}
              className="text-gray-500"
            />

            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent outline-none w-full ml-3 text-sm"
            />

          </div>

        </div>

      </header>

      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
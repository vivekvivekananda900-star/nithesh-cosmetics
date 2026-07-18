"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-yellow-400"
          onClick={() => setMenuOpen(false)}
        >
          Nithesh Cosmetics
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link href="/" className="hover:text-yellow-400">
            Home
          </Link>

          <Link href="/products" className="hover:text-yellow-400">
            Products
          </Link>

          <Link href="/track-order" className="hover:text-yellow-400">
            🚚 Track
          </Link>

          <Link
            href="/cart"
            className="relative hover:text-yellow-400"
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">

          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-900"
          >
            🏠 Home
          </Link>

          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-900"
          >
            📦 Products
          </Link>

          <Link
            href="/track-order"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-900"
          >
            🚚 Track Order
          </Link>

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-900"
          >
            🛒 Cart ({cartCount})
          </Link>

        </div>
      )}

    </nav>
  );
}
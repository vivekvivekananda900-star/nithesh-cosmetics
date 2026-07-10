"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-yellow-400">
          Nithesh Cosmetics
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            href="/"
            className="hover:text-yellow-400 transition"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="hover:text-yellow-400 transition"
          >
            Products
          </Link>

          <Link
            href="/about"
            className="hover:text-yellow-400 transition"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-yellow-400 transition"
          >
            Contact
          </Link>

          <Link
            href="/cart"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 font-semibold transition"
          >
            🛒 Cart
          </Link>

        </div>

      </div>
    </nav>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400"
        >
          Nithesh Cosmetics
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link href="/" className="hover:text-yellow-400 transition">
            Home
          </Link>

          <Link href="/products" className="hover:text-yellow-400 transition">
            Products
          </Link>

          <Link href="/about" className="hover:text-yellow-400 transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-yellow-400 transition">
            Contact
          </Link>

          <Link
            href="/cart"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            🛒 Cart
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">
          <div className="flex flex-col px-6 py-4 space-y-4">

            <Link
              href="/"
              className="hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/products"
              className="hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>

            <Link
              href="/about"
              className="hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className="hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            <Link
              href="/cart"
              className="bg-yellow-500 text-black text-center px-4 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              🛒 Cart
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}
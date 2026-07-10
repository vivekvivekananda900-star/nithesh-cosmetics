"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="text-yellow-400 text-xl md:text-2xl font-bold"
          >
            Nithesh Cosmetics
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-yellow-400">Home</Link>
            <Link href="/products" className="hover:text-yellow-400">Products</Link>
            <Link href="/about" className="hover:text-yellow-400">About</Link>
            <Link href="/contact" className="hover:text-yellow-400">Contact</Link>

            <Link
              href="/cart"
              className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400"
            >
              🛒 Cart
            </Link>
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-3xl"
          >
            {open ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4">

            <div className="flex flex-col gap-3">

              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>

              <Link href="/products" onClick={() => setOpen(false)}>
                Products
              </Link>

              <Link href="/about" onClick={() => setOpen(false)}>
                About
              </Link>

              <Link href="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>

              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="bg-yellow-500 text-center text-black py-2 rounded-lg font-semibold"
              >
                🛒 Cart
              </Link>

            </div>

          </div>
        )}

      </div>
    </header>
  );
}
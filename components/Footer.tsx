"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-10">
      <div className="max-w-7xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">
            Nithesh Cosmetics
          </h2>

          <p className="text-gray-400 mt-3">
            Quality beauty products, barber items and
            cosmetics at affordable prices.
          </p>
        </div>


        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Quick Links
          </h3>

          <div className="flex flex-col gap-2 text-gray-300">

            <Link href="/">
              Home
            </Link>

            <Link href="/products">
              Products
            </Link>

            <Link href="/cart">
              Cart
            </Link>

            <Link href="/track-order">
              Track Order
            </Link>

          </div>
        </div>


        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Contact
          </h3>

          <p className="text-gray-300">
            VKR Hospital Naganool Road,
            Nagarkurnool - 509209
          </p>

          <p className="mt-2 text-gray-300">
            📞 Call: +91 XXXXX XXXXX
          </p>

          <p className="mt-2 text-gray-300">
            💬 WhatsApp Available
          </p>

        </div>

      </div>


      <div className="border-t border-gray-700 text-center py-4 text-gray-400">

        © {new Date().getFullYear()} 
        Nithesh Cosmetics. vivek All rights reserved.

      </div>

    </footer>
  );
}
"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Products", href: "/products", icon: "🛍️" },
  { name: "Categories", href: "/products", icon: "📦" },
  { name: "My Orders", href: "/orders", icon: "📋" },
  { name: "Track Order", href: "/track-order", icon: "🚚" },
  { name: "Wishlist", href: "/wishlist", icon: "❤️" },
  { name: "Profile", href: "/profile", icon: "👤" },
  { name: "Contact Us", href: "/contact", icon: "☎️" },
];

export default function SideDrawer({
  open,
  onClose,
}: SideDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 h-full w-80 bg-white z-[60] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-yellow-500 text-white p-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Nithesh Cosmetics
                </h2>

                <p className="text-sm opacity-90">
                  Premium Barber Store
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-yellow-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto py-3">

              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100 transition"
                >
                  <span className="text-2xl">
                    {item.icon}
                  </span>

                  <span className="font-medium text-gray-800">
                    {item.name}
                  </span>
                </Link>
              ))}

            </div>

            {/* Footer */}
            <div className="border-t p-5">
              <p className="font-semibold text-gray-800">
                📍 Near VKR Hospital
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Naganool Road,
                <br />
                Nagarkurnool - 509209
              </p>

              <a
                href="tel:+919676578296"
                className="mt-4 block bg-yellow-500 text-center text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
              >
                📞 Call Now
              </a>

              <a
                href="https://wa.me/919676578296"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block bg-green-500 text-center text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
              >
                💬 WhatsApp
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
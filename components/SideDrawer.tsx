"use client";

import Link from "next/link";
import { X, Home, ShoppingBag, Grid2x2, Heart, User, Phone, MapPin, PackageCheck, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Categories", href: "/products", icon: Grid2x2 },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Orders", href: "/orders", icon: PackageCheck },
  { name: "My Account", href: "/account", icon: User },
  { name: "Contact", href: "/contact", icon: Phone },
];

export default function SideDrawer({
  open,
  onClose,
}: SideDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />

          <motion.div
            initial={{ x: -350 }}
            animate={{ x: 0 }}
            exit={{ x: -350 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-80 bg-white z-[60] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">

              <div className="flex justify-between items-center">

                <div>

                  <div className="w-16 h-16 rounded-full bg-white text-orange-500 flex items-center justify-center text-2xl font-bold">
                    N
                  </div>

                  <h2 className="mt-4 text-2xl font-bold">
                    Nithesh Cosmetics
                  </h2>

                  <p className="text-sm text-white/90">
                    Premium Barber & Cosmetics Store
                  </p>

                </div>

                <button onClick={onClose}>
                  <X size={26} />
                </button>

              </div>

            </div>

            {/* Menu */}
            <div className="flex-1 py-4 overflow-y-auto">

              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-orange-50 transition"
                  >
                    <Icon
                      size={22}
                      className="text-orange-500"
                    />

                    <span className="font-semibold">
                      {item.name}
                    </span>
                  </Link>
                );
              })}

            </div>

            {/* Footer */}
            <div className="border-t p-5">

              <div className="flex items-start gap-3">

                <MapPin className="text-orange-500" />

                <div>

                  <h4 className="font-semibold">
                    Store Address
                  </h4>

                  <p className="text-sm text-gray-500">
                    Near VKR Hospital
                    <br />
                    Naganool Road
                    <br />
                    Nagarkurnool
                  </p>

                </div>

              </div>

              <Link
                href="tel:+919676578296"
                className="mt-5 block bg-orange-500 text-white text-center py-3 rounded-xl font-semibold"
              >
                Call Now
              </Link>

              <Link
                href="/login"
                className="mt-3 flex items-center justify-center gap-2 border border-red-500 text-red-500 py-3 rounded-xl font-semibold"
              >
                <LogOut size={18} />
                Logout
              </Link>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Grid2X2,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const menus = [
    {
      name: "Home",
      href: "/",
      icon: House,
    },
    {
      name: "Products",
      href: "/products",
      icon: Grid2X2,
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: Heart,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      badge: cartCount,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200">
        <div className="grid grid-cols-5 h-16">
          {menus.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-center"
              >
                <div
                  className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                    active
                      ? "text-white bg-orange-500 rounded-2xl px-4 py-2 shadow-lg"
                      : "text-gray-500"
                  }`}
                >
                  <div className="relative">
                    <Icon size={22} />

                    {item.badge !== undefined &&
                      item.badge > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                  </div>

                  <span className="text-[11px] mt-1 font-medium">
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
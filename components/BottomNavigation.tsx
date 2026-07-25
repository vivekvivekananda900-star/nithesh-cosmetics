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
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-100">

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
                  className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                    active
                      ? "text-orange-500"
                      : "text-gray-500"
                  }`}
                >
                  <div className="relative">

                    <Icon
                      size={22}
                      strokeWidth={active ? 2.8 : 2}
                    />

                    {item.badge !== undefined &&
                      item.badge > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-semibold">
                          {item.badge}
                        </span>
                      )}

                  </div>

                  <span
                    className={`mt-1 text-[11px] font-medium ${
                      active
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </span>

                  {active && (
                    <div className="absolute bottom-1 w-8 h-1 rounded-full bg-orange-500" />
                  )}

                </div>
              </Link>
            );
          })}

        </div>

      </div>
    </nav>
  );
}
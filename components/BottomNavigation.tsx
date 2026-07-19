"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Grid2X2,
  ShoppingCart,
  PackageCheck,
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
      name: "Orders",
      href: "/track-order",
      icon: PackageCheck,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl md:hidden">

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
              className={`relative flex flex-col items-center justify-center transition
                ${
                  active
                    ? "text-yellow-600"
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
            </Link>
          );
        })}

      </div>
    </nav>
  );
}
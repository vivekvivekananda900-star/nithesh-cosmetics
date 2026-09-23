"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
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
    (total, item) =>
      total + item.quantity,
    0
  );

  const menus = [
    {
      name: "Home",
      href: "/",
      icon: Home,
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
      name: "Account",
      href: "/account",
      icon: User,
    },
  ];

  return (
    <nav
      className="
        fixed
        bottom-3
        left-3
        right-3
        z-[60]
        md:hidden
      "
      style={{
        paddingBottom:
          "env(safe-area-inset-bottom)",
      }}
    >
      {/* Glow */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-8
          -bottom-2
          h-14
          rounded-full
          bg-orange-500/15
          blur-2xl
        "
      />

      {/* Navigation */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[24px]
          border
          border-white/80
          bg-white/90
          shadow-[0_18px_50px_rgba(15,23,42,0.18)]
          backdrop-blur-2xl
        "
      >
        {/* Premium line */}

        <div
          className="
            pointer-events-none
            absolute
            left-10
            right-10
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-orange-300
            to-transparent
          "
        />

        <div
          className="
            grid
            h-[70px]
            grid-cols-5
            items-center
            px-1
          "
        >
          {menus.map((item) => {
            const Icon =
              item.icon;

            const active =
              pathname ===
                item.href ||
              (item.href !== "/" &&
                pathname.startsWith(
                  item.href
                ));

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={
                  item.name
                }
                className="
                  relative
                  flex
                  h-full
                  items-center
                  justify-center
                  active:scale-95
                  transition-transform
                "
              >
                <div
                  className={`
                    relative
                    flex
                    h-full
                    w-full
                    flex-col
                    items-center
                    justify-center
                    transition-all
                    duration-300

                    ${
                      active
                        ? "text-orange-600"
                        : "text-gray-400"
                    }
                  `}
                >
                  {/* Active pill */}

                  {active && (
                    <div
                      className="
                        absolute
                        top-1.5
                        h-[43px]
                        w-[52px]
                        rounded-[17px]
                        bg-gradient-to-br
                        from-orange-50
                        to-amber-50
                        shadow-[0_6px_18px_rgba(249,115,22,0.14)]
                      "
                    />
                  )}

                  {/* Icon */}

                  <div
                    className={`
                      relative
                      z-10
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-300

                      ${
                        active
                          ? "-translate-y-[3px] scale-105"
                          : ""
                      }
                    `}
                  >
                    <Icon
                      size={21}
                      strokeWidth={
                        active
                          ? 2.6
                          : 2
                      }
                    />

                    {/* Cart badge */}

                    {item.badge !==
                      undefined &&
                      item.badge >
                        0 && (
                        <span
                          className="
                            absolute
                            -right-2.5
                            -top-2.5
                            flex
                            h-[18px]
                            min-w-[18px]
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-white
                            bg-red-500
                            px-1
                            text-[9px]
                            font-black
                            text-white
                            shadow-md
                          "
                        >
                          {item.badge >
                          99
                            ? "99+"
                            : item.badge}
                        </span>
                      )}
                  </div>

                  {/* Label */}

                  <span
                    className={`
                      relative
                      z-10
                      mt-1
                      truncate
                      px-0.5
                      text-[9px]
                      transition-all
                      duration-300

                      ${
                        active
                          ? "font-black text-orange-600"
                          : "font-semibold text-gray-400"
                      }
                    `}
                  >
                    {item.name}
                  </span>

                  {/* Indicator */}

                  {active && (
                    <span
                      className="
                        absolute
                        bottom-1
                        h-1
                        w-5
                        rounded-full
                        bg-gradient-to-r
                        from-orange-500
                        to-amber-400
                        shadow-sm
                      "
                    />
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
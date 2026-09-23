"use client";

import Link from "next/link";

import {
  X,
  Home,
  ShoppingBag,
  Grid2X2,
  Heart,
  User,
  Phone,
  MapPin,
  PackageCheck,
  LogOut,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useState } from "react";

import { supabase } from "@/app/lib/supabase";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Products",
    href: "/products",
    icon: ShoppingBag,
  },
  {
    name: "Categories",
    href: "/products",
    icon: Grid2X2,
  },
  {
    name: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: PackageCheck,
  },
  {
    name: "My Account",
    href: "/account",
    icon: User,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: Phone,
  },
];

export default function SideDrawer({
  open,
  onClose,
}: SideDrawerProps) {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await supabase.auth.signOut();

      onClose();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      setLoggingOut(false);
    }
  }

  function isActive(
    href: string,
    name: string
  ) {
    if (
      name === "Categories"
    ) {
      return false;
    }

    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* =========================
              BACKDROP
          ========================= */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-50
              bg-black/55
              backdrop-blur-[3px]
            "
          />

          {/* =========================
              DRAWER
          ========================= */}

          <motion.aside
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            className="
              fixed
              bottom-0
              left-0
              top-0
              z-[70]
              flex
              w-[88%]
              max-w-[340px]
              flex-col
              overflow-hidden
              bg-white
              shadow-[25px_0_70px_rgba(15,23,42,0.25)]
              sm:w-[340px]
            "
          >
            {/* =========================
                HEADER
            ========================= */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-br
                from-orange-500
                via-orange-500
                to-amber-500
                px-5
                pb-6
                pt-5
                text-white
              "
            >
              {/* Background glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-14
                  -top-16
                  h-48
                  w-48
                  rounded-full
                  bg-white/15
                  blur-3xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-20
                  -left-16
                  h-48
                  w-48
                  rounded-full
                  bg-yellow-200/15
                  blur-3xl
                "
              />

              {/* Top */}

              <div
                className="
                  relative
                  z-10
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-[22px]
                    border
                    border-white/30
                    bg-white
                    text-2xl
                    font-black
                    text-orange-500
                    shadow-[0_10px_25px_rgba(0,0,0,0.16)]
                  "
                >
                  N
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-white/20
                    active:scale-90
                  "
                >
                  <X size={21} />
                </button>
              </div>

              {/* Brand */}

              <div
                className="
                  relative
                  z-10
                  mt-5
                "
              >
                <div
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-3
                    py-1.5
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-orange-50
                    backdrop-blur-md
                  "
                >
                  <Sparkles size={11} />

                  Premium Beauty Store
                </div>

                <h2
                  className="
                    mt-3
                    text-2xl
                    font-black
                    tracking-tight
                  "
                >
                  Nithesh Cosmetics
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-white/80
                  "
                >
                  Barber & Cosmetics Store
                </p>
              </div>
            </div>

            {/* =========================
                MENU
            ========================= */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-3
                py-4
              "
            >
              <p
                className="
                  px-3
                  pb-2
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-gray-400
                "
              >
                Menu
              </p>

              <div className="space-y-1">

                {menuItems.map(
                  (item, index) => {
                    const Icon =
                      item.icon;

                    const active =
                      isActive(
                        item.href,
                        item.name
                      );

                    return (
                      <motion.div
                        key={
                          item.name
                        }
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            0.05 +
                            index *
                              0.035,
                        }}
                      >
                        <Link
                          href={
                            item.href
                          }
                          onClick={
                            onClose
                          }
                          className={`
                            group
                            relative
                            flex
                            min-h-[52px]
                            items-center
                            gap-3
                            overflow-hidden
                            rounded-2xl
                            px-3
                            py-2.5
                            transition-all
                            duration-300
                            active:scale-[0.98]

                            ${
                              active
                                ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                            }
                          `}
                        >
                          {/* Active line */}

                          {active && (
                            <span
                              className="
                                absolute
                                left-0
                                top-1/2
                                h-7
                                w-1
                                -translate-y-1/2
                                rounded-r-full
                                bg-orange-500
                              "
                            />
                          )}

                          {/* Icon */}

                          <div
                            className={`
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              transition-all
                              duration-300

                              ${
                                active
                                  ? "bg-white text-orange-600 shadow-sm"
                                  : "bg-orange-50 text-orange-500 group-hover:bg-orange-100"
                              }
                            `}
                          >
                            <Icon
                              size={19}
                              strokeWidth={
                                active
                                  ? 2.5
                                  : 2.1
                              }
                            />
                          </div>

                          <span
                            className={`
                              min-w-0
                              flex-1
                              text-sm

                              ${
                                active
                                  ? "font-black"
                                  : "font-semibold"
                              }
                            `}
                          >
                            {
                              item.name
                            }
                          </span>

                          <ChevronRight
                            size={16}
                            className="
                              text-gray-300
                              transition-all
                              duration-300
                              group-hover:translate-x-0.5
                              group-hover:text-orange-500
                            "
                          />
                        </Link>
                      </motion.div>
                    );
                  }
                )}

              </div>

              {/* =========================
                  WHATSAPP CARD
              ========================= */}

              <a
                href="https://wa.me/919676578296?text=Hi%21%20I%27m%20interested%20in%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  mt-5
                  flex
                  items-center
                  gap-3
                  rounded-[22px]
                  border
                  border-green-100
                  bg-gradient-to-br
                  from-green-50
                  to-white
                  p-3
                  transition-all
                  duration-300
                  hover:border-green-200
                  hover:shadow-md
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-green-500
                    text-white
                    shadow-[0_6px_18px_rgba(34,197,94,0.25)]
                  "
                >
                  <MessageCircle
                    size={20}
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <p
                    className="
                      text-xs
                      font-black
                      text-gray-900
                    "
                  >
                    Need Help?
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-gray-500
                    "
                  >
                    Chat on WhatsApp
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className="
                    text-green-500
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </a>

            </div>

            {/* =========================
                FOOTER
            ========================= */}

            <div
              className="
                border-t
                border-gray-100
                bg-gray-50/80
                p-4
                pb-[max(16px,env(safe-area-inset-bottom))]
                backdrop-blur-xl
              "
            >
              {/* Address */}

              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  bg-white
                  p-3
                  shadow-sm
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-50
                    text-orange-500
                  "
                >
                  <MapPin
                    size={18}
                  />
                </div>

                <div className="min-w-0">

                  <h4
                    className="
                      text-xs
                      font-black
                      text-gray-900
                    "
                  >
                    Store Address
                  </h4>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                      text-gray-500
                    "
                  >
                    Near VKR Hospital,
                    Naganool Road,
                    Nagarkurnool
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div
                className="
                  mt-3
                  grid
                  grid-cols-2
                  gap-2
                "
              >
                <a
                  href="tel:+919676578296"
                  className="
                    flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-orange-500
                    to-amber-500
                    px-3
                    text-xs
                    font-black
                    text-white
                    shadow-[0_6px_18px_rgba(249,115,22,0.24)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    active:scale-95
                  "
                >
                  <Phone
                    size={15}
                  />

                  Call Now
                </a>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  disabled={
                    loggingOut
                  }
                  className="
                    flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-red-100
                    bg-red-50
                    px-3
                    text-xs
                    font-black
                    text-red-600
                    transition-all
                    duration-300
                    hover:bg-red-100
                    active:scale-95
                    disabled:opacity-60
                  "
                >
                  {loggingOut ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-red-200
                          border-t-red-600
                        "
                      />

                      Wait
                    </>
                  ) : (
                    <>
                      <LogOut
                        size={15}
                      />

                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
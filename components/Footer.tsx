"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        relative
        mt-14
        overflow-hidden
        bg-gradient-to-br
        from-[#080808]
        via-[#111111]
        to-[#050505]
        pb-24
        text-white
        md:pb-0
      "
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            -left-32
            top-10
            h-72
            w-72
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-32
            bottom-0
            h-80
            w-80
            rounded-full
            bg-amber-500/10
            blur-3xl
          "
        />

      </div>

      {/* Top premium line */}
      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-orange-500/60
          to-transparent
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-4
          py-10
          sm:px-6
          sm:py-14
          lg:px-8
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-10
            md:grid-cols-2
            lg:grid-cols-[1.2fr_0.8fr_1fr]
            lg:gap-14
          "
        >
          {/* ================= BRAND ================= */}

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-orange-500/20
                bg-orange-500/10
                px-3
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
                text-orange-400
              "
            >
              <Sparkles size={13} />

              Premium Beauty Store
            </div>

            <h2
              className="
                mt-4
                text-2xl
                font-black
                tracking-tight
                sm:text-3xl
              "
            >
              Nithesh
              <span className="text-orange-500">
                {" "}
                Cosmetics
              </span>
            </h2>

            <p
              className="
                mt-4
                max-w-md
                text-sm
                leading-7
                text-gray-400
              "
            >
              Quality beauty products, professional barber
              tools, skincare and cosmetics at affordable
              prices.
            </p>

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-gray-300
                "
              >
                <ShieldCheck
                  size={16}
                  className="text-green-400"
                />

                Genuine Products
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-gray-300
                "
              >
                <ShoppingBag
                  size={16}
                  className="text-orange-400"
                />

                Easy Shopping
              </div>

            </div>

          </div>

          {/* ================= QUICK LINKS ================= */}

          <div>

            <h3
              className="
                text-sm
                font-black
                uppercase
                tracking-[0.14em]
                text-white
              "
            >
              Quick Links
            </h3>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-3
              "
            >
              <FooterLink
                href="/"
                label="Home"
              />

              <FooterLink
                href="/products"
                label="Products"
              />

              <FooterLink
                href="/cart"
                label="Cart"
              />

              <FooterLink
                href="/wishlist"
                label="Wishlist"
              />

              <FooterLink
                href="/orders"
                label="My Orders"
              />

              <FooterLink
                href="/track-order"
                label="Track Order"
              />

            </div>

          </div>

          {/* ================= CONTACT ================= */}

          <div>

            <h3
              className="
                text-sm
                font-black
                uppercase
                tracking-[0.14em]
                text-white
              "
            >
              Contact Us
            </h3>

            <div className="mt-5 space-y-3">

              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-4
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
                    bg-orange-500/10
                    text-orange-400
                  "
                >
                  <MapPin size={18} />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      text-white
                    "
                  >
                    Store Address
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-gray-400
                    "
                  >
                    VKR Hospital Naganool Road,
                    Nagarkurnool - 509209
                  </p>
                </div>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-4
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
                    bg-green-500/10
                    text-green-400
                  "
                >
                  <Phone size={18} />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      text-white
                    "
                  >
                    Call Us
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                  >
                    +91 XXXXX XXXXX
                  </p>
                </div>

              </div>

              <a
                href="https://wa.me/919676578296"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-green-500/20
                  bg-green-500/10
                  p-4
                  transition-all
                  duration-300
                  hover:border-green-500/30
                  hover:bg-green-500/15
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
                    bg-green-500
                    text-white
                  "
                >
                  <MessageCircle size={18} />
                </div>

                <div className="min-w-0 flex-1">

                  <p
                    className="
                      text-xs
                      font-black
                      text-white
                    "
                  >
                    WhatsApp Support
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                  >
                    Chat with us for assistance
                  </p>

                </div>

                <ArrowUpRight
                  size={17}
                  className="
                    text-green-400
                    transition-transform
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                  "
                />

              </a>

            </div>

          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div
          className="
            mt-10
            border-t
            border-white/10
            pt-6
            sm:mt-12
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              justify-between
              gap-4
              text-center
              sm:flex-row
              sm:text-left
            "
          >
            <p
              className="
                text-xs
                leading-5
                text-gray-500
              "
            >
              © {year} Nithesh Cosmetics.
              All rights reserved.
            </p>

            <p
              className="
                flex
                items-center
                gap-1.5
                text-xs
                text-gray-500
              "
            >
              Designed & Developed with
              <Heart
                size={13}
                className="
                  fill-red-500
                  text-red-500
                "
              />
              by
              <span
                className="
                  font-bold
                  text-orange-400
                "
              >
                Vivek
              </span>
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
}

/* ================= FOOTER LINK ================= */

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        w-fit
        items-center
        gap-2
        text-sm
        font-medium
        text-gray-400
        transition-all
        duration-300
        hover:translate-x-1
        hover:text-orange-400
      "
    >
      <span
        className="
          h-1.5
          w-1.5
          rounded-full
          bg-gray-700
          transition-colors
          group-hover:bg-orange-500
        "
      />

      {label}
    </Link>
  );
}
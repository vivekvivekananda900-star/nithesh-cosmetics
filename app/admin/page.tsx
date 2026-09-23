"use client";

import Link from "next/link";

import {
  Boxes,
  ImagePlus,
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Phone,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const cards = [
    {
      title: "Add Product",
      description: "Add new products to your store",
      href: "/admin/add-product",
      icon: PackagePlus,
    },
    {
      title: "Manage Products",
      description: "Edit and delete products",
      href: "/admin/products",
      icon: PackageSearch,
    },
    {
      title: "Stock Management",
      description: "Update product stock quantity",
      href: "/admin/stock",
      icon: Boxes,
    },
    {
      title: "Banner Management",
      description: "Add, edit and delete banners",
      href: "/admin/banner",
      icon: ImagePlus,
    },
    {
      title: "New Arrivals",
      description: "Manage homepage new products",
      href: "/admin/new-arrivals",
      icon: Star,
    },
    {
      title: "Orders",
      description: "View and manage customer orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Contact",
      description: "View business contact details",
      href: "/contact",
      icon: Phone,
    },
  ];

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff5eb]
        to-white
        px-4
        py-8
        sm:px-6
        lg:px-8
      "
    >
      {/* Background Glow */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            -left-24
            top-10
            h-72
            w-72
            rounded-full
            bg-orange-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-24
            top-[420px]
            h-80
            w-80
            rounded-full
            bg-rose-200/20
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
        "
      >
        {/* Header */}

        <section
          className="
            mb-8
            rounded-[30px]
            border
            border-orange-100
            bg-white/90
            p-6
            shadow-[0_18px_55px_rgba(15,23,42,0.07)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-orange-50
                  px-4
                  py-2
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-orange-600
                "
              >
                <Sparkles size={15} />
                Nithesh Cosmetics
              </div>

              <h1
                className="
                  mt-4
                  flex
                  items-center
                  gap-3
                  text-3xl
                  font-black
                  tracking-tight
                  text-gray-900
                  sm:text-4xl
                "
              >
                <LayoutDashboard
                  size={36}
                  className="text-orange-500"
                />

                Admin Dashboard
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-gray-500
                  sm:text-base
                "
              >
                Manage products, stock, banners,
                homepage items and customer orders
                from one place.
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-green-100
                bg-green-50
                px-5
                py-3
                text-sm
                font-bold
                text-green-700
              "
            >
              Store Management
            </div>
          </div>
        </section>

        {/* Dashboard Cards */}

        <section
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-gray-100
                  bg-white
                  p-6
                  shadow-[0_10px_35px_rgba(15,23,42,0.06)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-orange-200
                  hover:shadow-[0_18px_45px_rgba(249,115,22,0.12)]
                "
              >
                {/* Card Glow */}

                <div
                  className="
                    absolute
                    -right-12
                    -top-12
                    h-28
                    w-28
                    rounded-full
                    bg-orange-100/60
                    blur-2xl
                    transition-all
                    duration-300
                    group-hover:bg-orange-200/70
                  "
                />

                {/* Icon */}

                <div
                  className="
                    relative
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-orange-50
                    to-amber-50
                    text-orange-600
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-orange-100
                  "
                >
                  <Icon size={26} />
                </div>

                {/* Text */}

                <div className="relative mt-5">
                  <h2
                    className="
                      text-xl
                      font-black
                      text-gray-900
                      transition-colors
                      group-hover:text-orange-600
                    "
                  >
                    {card.title}
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-500
                    "
                  >
                    {card.description}
                  </p>
                </div>

                {/* Open */}

                <div
                  className="
                    relative
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-gray-100
                    pt-4
                  "
                >
                  <span
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-wide
                      text-orange-500
                    "
                  >
                    Open
                  </span>

                  <span
                    className="
                      text-lg
                      font-black
                      text-orange-500
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Bottom Info */}

        <section
          className="
            mt-8
            rounded-[26px]
            border
            border-gray-100
            bg-white
            p-5
            text-center
            shadow-[0_10px_35px_rgba(15,23,42,0.05)]
            sm:p-6
          "
        >
          <p
            className="
              text-sm
              font-bold
              text-gray-700
            "
          >
            Nithesh Cosmetics Admin Studio
          </p>

          <p
            className="
              mt-1
              text-xs
              text-gray-500
            "
          >
            Products • Stock • Banners • Orders
          </p>
        </section>
      </div>
    </main>
  );
}
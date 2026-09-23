"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Flame,
  Sparkles,
  Star,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
}

export default function TrendingProducts() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTrendingProducts();
  }, []);

  async function loadTrendingProducts() {
    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select(
          "id,name,price,image,images,category"
        )
        .eq("active", true)
        .limit(6);

      if (error) {
        throw error;
      }

      const list: Product[] =
        (data || []).map(
          (item) => ({
            id: item.id,
            name:
              item.name || "",
            price:
              Number(
                item.price
              ) || 0,

            image:
              item.images?.[0] ||
              item.image ||
              "/placeholder.png",

            images:
              item.images || [],

            category:
              item.category,
          })
        );

      setProducts(list);
    } catch (error) {
      console.error(
        "Trending products loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(
    price: number
  ) {
    return Number(
      price || 0
    ).toLocaleString(
      "en-IN"
    );
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section
        className="
          relative
          mt-10
          px-3
          sm:px-5
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
          "
        >
          {/* Header Skeleton */}

          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <div
                className="
                  h-3
                  w-28
                  animate-pulse
                  rounded-full
                  bg-orange-100
                "
              />

              <div
                className="
                  mt-2
                  h-7
                  w-48
                  animate-pulse
                  rounded-xl
                  bg-gray-200
                "
              />
            </div>

            <div
              className="
                h-8
                w-20
                animate-pulse
                rounded-full
                bg-gray-100
              "
            />
          </div>

          {/* Cards Skeleton */}

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-4
              md:grid-cols-3
              lg:grid-cols-6
            "
          >
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-gray-100
                    bg-white
                    p-3
                    shadow-sm
                  "
                >
                  <div
                    className="
                      h-36
                      animate-pulse
                      rounded-[18px]
                      bg-gray-100
                      sm:h-40
                    "
                  />

                  <div
                    className="
                      mt-4
                      h-4
                      w-full
                      animate-pulse
                      rounded
                      bg-gray-200
                    "
                  />

                  <div
                    className="
                      mt-2
                      h-4
                      w-2/3
                      animate-pulse
                      rounded
                      bg-gray-100
                    "
                  />

                  <div
                    className="
                      mt-4
                      h-6
                      w-20
                      animate-pulse
                      rounded-lg
                      bg-orange-100
                    "
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (
    products.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="
        relative
        mt-10
        overflow-hidden
        px-3
        sm:px-5
        lg:px-8
      "
    >
      {/* Background Decoration */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-10
          h-80
          w-80
          rounded-full
          bg-orange-100/40
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
        "
      >
        {/* =========================
            HEADER
        ========================= */}

        <div
          className="
            mb-5
            flex
            items-end
            justify-between
            gap-3
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
                text-orange-500
                sm:text-xs
              "
            >
              <Flame
                size={13}
                className="
                  fill-orange-500
                "
              />

              Hot Right Now
            </div>

            <h2
              className="
                mt-1
                text-xl
                font-black
                tracking-tight
                text-gray-900
                sm:text-2xl
                md:text-3xl
              "
            >
              Trending Products
            </h2>

            <p
              className="
                mt-1
                hidden
                text-sm
                text-gray-500
                sm:block
              "
            >
              Discover products our customers love.
            </p>
          </div>

          <Link
            href="/products"
            className="
              group
              flex
              shrink-0
              items-center
              gap-1
              rounded-full
              bg-orange-50
              px-3
              py-2
              text-xs
              font-black
              text-orange-600
              transition-all
              duration-300
              hover:bg-orange-100
              active:scale-95
              sm:px-4
              sm:text-sm
            "
          >
            View All

            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        {/* =========================
            PRODUCT GRID
        ========================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-4
            md:grid-cols-3
            lg:grid-cols-6
          "
        >
          {products.map(
            (
              product,
              index
            ) => (
              <Link
                key={
                  product.id
                }
                href={`/products/${product.id}`}
                className="
                  trending-card
                  group
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-gray-100
                  bg-white
                  shadow-[0_8px_28px_rgba(15,23,42,0.06)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-orange-100
                  hover:shadow-[0_18px_40px_rgba(249,115,22,0.14)]
                  active:scale-[0.98]
                "
                style={{
                  animationDelay: `${
                    index *
                    70
                  }ms`,
                }}
              >
                {/* =========================
                    IMAGE
                ========================= */}

                <div
                  className="
                    relative
                    h-36
                    w-full
                    overflow-hidden
                    bg-gradient-to-br
                    from-[#fffaf5]
                    via-[#fff7f0]
                    to-white
                    sm:h-40
                    lg:h-36
                  "
                >
                  <img
                    src={
                      product.image ||
                      "/placeholder.png"
                    }
                    alt={
                      product.name
                    }
                    loading="lazy"
                    onError={(
                      e
                    ) => {
                      e.currentTarget.onerror =
                        null;

                      e.currentTarget.src =
                        "/placeholder.png";
                    }}
                    className="
                      h-full
                      w-full
                      object-contain
                      p-3
                      transition-transform
                      duration-500
                      ease-out
                      group-hover:scale-[1.08]
                    "
                  />

                  {/* Soft overlay */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/[0.04]
                      to-transparent
                    "
                  />

                  {/* Trending badge */}

                  <div
                    className="
                      absolute
                      left-2
                      top-2
                      flex
                      items-center
                      gap-1
                      rounded-full
                      border
                      border-white/80
                      bg-white/90
                      px-2
                      py-1
                      text-[8px]
                      font-black
                      uppercase
                      tracking-wide
                      text-orange-600
                      shadow-sm
                      backdrop-blur-md
                    "
                  >
                    <Flame
                      size={9}
                      className="
                        fill-orange-500
                      "
                    />

                    Trending
                  </div>

                  {/* Sparkle */}

                  <div
                    className="
                      absolute
                      right-2
                      top-2
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-white/90
                      text-orange-500
                      shadow-sm
                      backdrop-blur-md
                    "
                  >
                    <Sparkles
                      size={13}
                    />
                  </div>
                </div>

                {/* =========================
                    CONTENT
                ========================= */}

                <div
                  className="
                    p-3
                    sm:p-3.5
                  "
                >
                  {/* Category */}

                  {product.category && (
                    <p
                      className="
                        mb-1.5
                        truncate
                        text-[8px]
                        font-black
                        uppercase
                        tracking-[0.12em]
                        text-orange-500
                      "
                    >
                      {
                        product.category
                      }
                    </p>
                  )}

                  {/* Product Name */}

                  <h3
                    className="
                      line-clamp-2
                      min-h-[38px]
                      text-[12px]
                      font-black
                      leading-[19px]
                      text-gray-900
                      transition-colors
                      duration-300
                      group-hover:text-orange-600
                      sm:text-[13px]
                    "
                  >
                    {
                      product.name
                    }
                  </h3>

                  {/* Rating */}

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-1
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-amber-50
                        px-2
                        py-1
                      "
                    >
                      <Star
                        size={10}
                        className="
                          fill-amber-400
                          text-amber-400
                        "
                      />

                      <span
                        className="
                          text-[9px]
                          font-black
                          text-amber-700
                        "
                      >
                        4.8
                      </span>
                    </div>
                  </div>

                  {/* Price */}

                  <div
                    className="
                      mt-3
                      flex
                      items-end
                      justify-between
                      gap-2
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-gray-400
                        "
                      >
                        Price
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-lg
                          font-black
                          tracking-tight
                          text-gray-900
                        "
                      >
                        <span
                          className="
                            text-xs
                            text-orange-500
                          "
                        >
                          â‚¹
                        </span>

                        {formatPrice(
                          product.price
                        )}
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className="
                        mb-1
                        text-gray-300
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:text-orange-500
                      "
                    />
                  </div>
                </div>

                {/* Bottom premium line */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[2px]
                    w-0
                    -translate-x-1/2
                    bg-gradient-to-r
                    from-orange-500
                    to-amber-400
                    transition-all
                    duration-500
                    group-hover:w-2/3
                  "
                />
              </Link>
            )
          )}
        </div>
      </div>

      {/* =========================
          ANIMATIONS
      ========================= */}

      
    </section>
  );
}

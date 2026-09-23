"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

const fallbackCategories = [
  "Makeup",
  "Skin Care",
  "Hair Care",
  "Perfumes",
  "Barber",
  "Personal Care",
];

export default function CategorySection() {
  const [
    categories,
    setCategories,
  ] = useState<string[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("category");

      if (error) {
        throw error;
      }

      const uniqueCategories =
        Array.from(
          new Set(
            (data || [])
              .map(
                (item) =>
                  item.category
              )
              .filter(
                (
                  category
                ): category is string =>
                  Boolean(
                    category &&
                      category.trim()
                  )
              )
              .map(
                (category) =>
                  category.trim()
              )
          )
        );

      if (
        uniqueCategories.length >
        0
      ) {
        setCategories(
          uniqueCategories
        );
      } else {
        setCategories(
          fallbackCategories
        );
      }
    } catch (error) {
      console.error(
        "Category loading error:",
        error
      );

      setCategories(
        fallbackCategories
      );
    } finally {
      setLoading(false);
    }
  }

  function getCategoryEmoji(
    category: string
  ) {
    const value =
      category.toLowerCase();

    if (
      value.includes(
        "makeup"
      ) ||
      value.includes(
        "cosmetic"
      )
    ) {
      return "💄";
    }

    if (
      value.includes("skin")
    ) {
      return "✨";
    }

    if (
      value.includes("hair")
    ) {
      return "💇";
    }

    if (
      value.includes(
        "perfume"
      ) ||
      value.includes(
        "fragrance"
      )
    ) {
      return "🌸";
    }

    if (
      value.includes(
        "barber"
      ) ||
      value.includes(
        "shaving"
      )
    ) {
      return "✂️";
    }

    if (
      value.includes(
        "nail"
      )
    ) {
      return "💅";
    }

    if (
      value.includes(
        "face"
      )
    ) {
      return "🧴";
    }

    if (
      value.includes(
        "soap"
      ) ||
      value.includes(
        "body"
      )
    ) {
      return "🫧";
    }

    if (
      value.includes(
        "personal"
      )
    ) {
      return "🧼";
    }

    return "🛍️";
  }

  if (loading) {
    return (
      <section className="px-3 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div
            className="
              mb-5
              flex
              items-end
              justify-between
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
                h-5
                w-16
                animate-pulse
                rounded-full
                bg-gray-200
              "
            />
          </div>

          <div
            className="
              grid
              grid-cols-3
              gap-3
              sm:grid-cols-4
              sm:gap-4
              md:grid-cols-5
              lg:grid-cols-6
            "
          >
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-28
                    animate-pulse
                    rounded-[22px]
                    bg-white
                    shadow-sm
                  "
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (
    categories.length === 0
  ) {
    return null;
  }

  return (
    <section className="px-3 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

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
              <Sparkles
                size={13}
              />

              Shop By Category
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
              Explore Categories
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
              Find your favourite
              beauty and barber
              products.
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
              text-xs
              font-bold
              text-orange-500
              transition
              hover:text-orange-600
              sm:text-sm
            "
          >
            View All

            <ChevronRight
              size={16}
              className="
                transition-transform
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        {/* Categories */}

        <div
          className="
            grid
            grid-cols-3
            gap-3
            sm:grid-cols-4
            sm:gap-4
            md:grid-cols-5
            lg:grid-cols-6
          "
        >
          {categories.map(
            (category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(
                  category
                )}`}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-orange-100
                  bg-white
                  px-2
                  py-4
                  text-center
                  shadow-[0_8px_25px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-orange-200
                  hover:shadow-[0_15px_35px_rgba(249,115,22,0.14)]
                  active:scale-95
                  sm:rounded-[26px]
                  sm:px-3
                  sm:py-5
                "
              >
                {/* Glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-orange-100/70
                    opacity-0
                    blur-2xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                {/* Emoji */}

                <div
                  className="
                    relative
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-orange-50
                    to-amber-50
                    text-2xl
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:rotate-3
                    sm:h-14
                    sm:w-14
                    sm:text-3xl
                  "
                >
                  {getCategoryEmoji(
                    category
                  )}
                </div>

                <p
                  className="
                    relative
                    mt-3
                    line-clamp-2
                    text-[11px]
                    font-black
                    leading-4
                    text-gray-800
                    transition-colors
                    group-hover:text-orange-600
                    sm:text-sm
                  "
                >
                  {category}
                </p>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
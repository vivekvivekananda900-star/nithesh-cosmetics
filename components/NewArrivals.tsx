"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  image?: string;
  category?: string;
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewArrivals() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id,name,price,mrp,discount,image,category,created_at"
          )
          .eq("active", true)
          .order("created_at", {
            ascending: false,
          })
          .limit(6);

        if (error) {
          throw error;
        }

        const list: Product[] =
          data?.map((item) => ({
            id: item.id,
            name: item.name || "",
            price: Number(item.price) || 0,
            mrp: Number(item.mrp) || 0,
            discount: Number(item.discount) || 0,
            image:
              item.image ||
              "/placeholder.png",
            category:
              item.category || "",
          })) || [];

        setProducts(list);
      } catch (error) {
        console.error(
          "New arrivals loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className="px-4 mt-10">
        <h2 className="text-2xl font-bold mb-4">
          ✨ New Arrivals
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="
                  bg-white
                  rounded-2xl
                  shadow
                  p-4
                  animate-pulse
                "
              >
                <div className="h-36 bg-gray-200 rounded-xl" />

                <div className="h-4 bg-gray-200 rounded mt-4" />

                <div className="h-4 bg-gray-200 rounded mt-2 w-20" />
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="px-4 mt-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            ✨ New Arrivals
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Fresh products just added
          </p>
        </div>

        <Link
          href="/products"
          className="
            text-orange-600
            font-semibold
            hover:text-orange-700
            transition
          "
        >
          View All →
        </Link>
      </div>

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-6
          gap-4
        "
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="
              bg-white
              rounded-2xl
              shadow
              p-4
              hover:shadow-xl
              transition
              overflow-hidden
              relative
            "
          >
            {/* NEW BADGE */}

            <div
              className="
                absolute
                top-2
                left-2
                z-10
                bg-orange-500
                text-white
                text-xs
                font-bold
                px-2
                py-1
                rounded-full
              "
            >
              NEW
            </div>

            {/* PRODUCT IMAGE */}

            <div
              className="
                h-36
                w-full
                rounded-xl
                bg-gray-50
                overflow-hidden
                flex
                items-center
                justify-center
              "
            >
              <img
                src={
                  product.image ||
                  "/placeholder.png"
                }
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror =
                    null;

                  e.currentTarget.src =
                    "/placeholder.png";
                }}
                className="
                  w-full
                  h-full
                  object-contain
                  p-2
                "
              />
            </div>

            {/* PRODUCT NAME */}

            <h3
              className="
                mt-3
                font-semibold
                line-clamp-2
                min-h-[48px]
              "
            >
              {product.name}
            </h3>

            {/* CATEGORY */}

            {product.category && (
              <p
                className="
                  text-xs
                  text-gray-500
                  mt-1
                "
              >
                {product.category}
              </p>
            )}

            {/* PRICE */}

            <div
              className="
                flex
                items-center
                gap-2
                mt-2
                flex-wrap
              "
            >
              <p
                className="
                  text-orange-600
                  font-bold
                  text-lg
                "
              >
                ₹{product.price}
              </p>

              {product.mrp &&
                product.mrp >
                  product.price && (
                  <p
                    className="
                      text-sm
                      text-gray-400
                      line-through
                    "
                  >
                    ₹{product.mrp}
                  </p>
                )}
            </div>

            {/* DISCOUNT */}

            {product.discount ? (
              <p
                className="
                  text-green-600
                  text-sm
                  font-semibold
                  mt-1
                "
              >
                Save ₹
                {product.discount}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
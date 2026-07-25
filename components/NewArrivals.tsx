"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
};

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error(error);
      return;
    }

    const formatted =
      (data || []).map((item: any) => ({
        ...item,
        image:
          item.images?.[0] ||
          item.image ||
          "/placeholder.png",
      }));

    setProducts(formatted);
  }

  return (
    <section className="px-3 sm:px-4 py-8">
      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          ✨ New Arrivals
        </h2>

        <Link
          href="/products"
          className="text-orange-600 font-semibold text-sm sm:text-base"
        >
          View All →
        </Link>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">

        {products.map((product) => (

          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >

            <div className="relative overflow-hidden">

              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-full h-36 sm:h-48 md:h-56 object-cover hover:scale-105 transition duration-300"
              />

              <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold">
                NEW
              </span>

              <button
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
                onClick={(e) => e.preventDefault()}
              >
                <Heart
                  size={16}
                  className="text-gray-500 hover:text-red-500 transition"
                />
              </button>

            </div>

            <div className="p-3 sm:p-4">

              <h3 className="font-semibold text-sm sm:text-base line-clamp-2 min-h-[40px]">
                {product.name}
              </h3>

              <div className="flex items-center mt-2">

                <Star
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="ml-1 text-xs sm:text-sm font-medium">
                  4.9
                </span>

              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">

                <span className="text-lg sm:text-xl font-bold text-green-600">
                  ₹{product.price}
                </span>

                <span className="text-xs sm:text-sm line-through text-gray-400">
                  ₹{Math.round(product.price * 1.2)}
                </span>

              </div>

            </div>

          </Link>

        ))}

      </div>
    </section>
  );
}
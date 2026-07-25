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
    <section className="px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">
          ✨ New Arrivals
        </h2>

        <Link
          href="/products"
          className="text-orange-500 font-semibold"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition"
          >
            <Link href={`/products/${product.id}`}>
              <div className="relative">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-44 object-cover"
                />

                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  NEW
                </span>

                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
                  <Heart size={16} />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-bold line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center mt-2">
                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <span className="ml-1 text-sm">4.9</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.price}
                  </span>

                  <span className="text-sm line-through text-gray-400">
                    ₹{Math.round(product.price * 1.2)}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
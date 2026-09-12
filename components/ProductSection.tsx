"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Heart,
} from "lucide-react";

import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/app/lib/supabase";

import {
  toggleWishlist,
  isInWishlist,
} from "@/app/lib/wishlist";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
  wishlisted?: boolean;
};

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(6);

    if (error) {
      console.error(error);
      return;
    }

    const formattedProducts = await Promise.all(
      (data || []).map(async (item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        category: item.category,
        image:
          item.images?.[0] ||
          item.image ||
          "/placeholder.png",
        images: item.images || [],
        wishlisted: await isInWishlist(item.id),
      }))
    );

    setProducts(formattedProducts);
  }

  async function handleWishlist(
    e: React.MouseEvent,
    productId: string
  ) {
    e.preventDefault();

    const result = await toggleWishlist(productId);

    if (!result.success) {
      alert(result.message || "Please login first");
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              wishlisted: result.action === "added",
            }
          : item
      )
    );
  }

  return (
    <section className="px-3 sm:px-4 mt-8 mb-24">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          🔥 Trending Products
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

          <div
            key={product.id}
            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >

            <Link href={`/products/${product.id}`}>

              <div className="relative overflow-hidden">

                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-36 sm:h-48 md:h-56 object-cover hover:scale-105 transition duration-300"
                />

                <button
                  onClick={(e) => handleWishlist(e, product.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
                >
                  <Heart
                    size={18}
                    className={
                      product.wishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }
                  />
                </button>

              </div>

            </Link>

            <div className="p-3 sm:p-4">

              <Link href={`/products/${product.id}`}>

                <h3 className="font-semibold text-sm sm:text-base line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>

              </Link>

              <div className="flex items-center mt-2">

                <Star
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="ml-1 text-xs sm:text-sm font-medium">
                  4.8
                </span>

              </div>

              <p className="text-green-600 text-lg sm:text-xl font-bold mt-3">
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}
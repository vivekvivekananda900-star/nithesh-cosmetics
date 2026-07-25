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

    const state = await toggleWishlist(productId);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              wishlisted: state,
            }
          : item
      )
    );
  }

  return (
    <section className="px-4 mt-8 mb-24">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          🔥 Trending Products
        </h2>

        <Link
          href="/products"
          className="text-yellow-600 font-semibold"
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
                  src={
                    product.image ||
                    "/placeholder.png"
                  }
                  alt={product.name}
                  className="w-full h-44 object-cover"
                />

                <button
                  onClick={(e) =>
                    handleWishlist(
                      e,
                      product.id
                    )
                  }
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
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

              <div className="p-4">

                <h3 className="font-bold line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center mt-2">

                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="ml-1 text-sm">
                    4.8
                  </span>

                </div>

                <p className="text-green-600 text-xl font-bold mt-3">
                  ₹{product.price}
                </p>

              </div>

            </Link>

            <button
              onClick={() => addToCart(product)}
              className="m-4 w-[calc(100%-32px)] bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add To Cart
            </button>

          </div>

        ))}

      </div>

    </section>
  );
}
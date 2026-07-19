"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useCart } from "@/app/context/CartContext";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category: string;
  description?: string;
  image?: string;
  rating?: number;
  deliveryFee?: number;
}

export default function ProductsContent() {
  const searchParams = useSearchParams();

  const urlSearch =
    searchParams.get("search") || "";

  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "products")
        );

        const list: Product[] =
          snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              name: data.name || "",
              price: Number(data.price) || 0,
              mrp: Number(data.mrp) || 0,
              discount: Number(data.discount) || 0,
              category: data.category || "",
              description: data.description || "",
              image: data.image || "",
              rating: Number(data.rating) || 4.8,
              deliveryFee:
                Number(data.deliveryFee) || 0,
            };
          });

        setProducts(list);
      } catch (error) {
        console.log(
          "Product loading error:",
          error
        );
      }
    };

    fetchProducts();
  }, []);
  const filteredProducts = products.filter((product) => {
    const searchText =
      (search || urlSearch).toLowerCase();

    const searchMatch =
      product.name
        .toLowerCase()
        .includes(searchText) ||
      product.category
        .toLowerCase()
        .includes(searchText);

    const categoryMatch =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return (
      searchMatch &&
      categoryMatch
    );
  });

  return (
    <main
      className="
        min-h-screen
        bg-orange-50
        text-gray-900
        p-4
      "
    >
      <Link
        href="/"
        className="
          inline-block
          bg-green-600
          text-white
          px-4
          py-2
          rounded-lg
        "
      >
        🏠 Home
      </Link>

      <h1
        className="
          text-3xl
          font-bold
          text-center
          my-6
          text-gray-900
        "
      >
        Our Products
      </h1>

      <div
        className="
          flex
          flex-col
          md:flex-row
          gap-4
          mb-6
        "
      >
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            flex-1
            border
            rounded-lg
            p-3
            bg-white
            text-gray-900
            placeholder:text-gray-500
          "
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
          className="
            border
            rounded-lg
            p-3
            bg-white
            text-gray-900
          "
        >
          <option value="All">
            All Categories
          </option>

          {[
            ...new Set(
              products.map(
                (p) => p.category
              )
            ),
          ].map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
        "
      >
        {filteredProducts.map((product) => {
          const cartItem = cart.find(
            (item) => item.id === product.id
          );

          return (
            <div
              key={product.id}
              className="
                bg-white
                text-gray-900
                p-3
                rounded-xl
                shadow-md
                hover:shadow-xl
                transition
              "
            >
              <Link
                href={`/products/${product.id}`}
              >
                <img
                  src={
                    product.image ||
                    "/placeholder.png"
                  }
                  alt={product.name}
                  className="
                    w-full
                    h-32
                    object-contain
                    rounded-lg
                    hover:scale-105
                    transition
                  "
                />
              </Link>

              <Link
                href={`/products/${product.id}`}
              >
                <h2
                  className="
                    mt-2
                    text-lg
                    font-bold
                    text-gray-900
                    line-clamp-2
                    hover:text-green-600
                  "
                >
                  {product.name}
                </h2>
              </Link>

              <p className="text-sm text-gray-700">
                {product.category}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span
                  className="
                    bg-green-600
                    text-white
                    text-xs
                    px-2
                    py-1
                    rounded
                  "
                >
                  ⭐ {product.rating}
                </span>

                <span className="text-xs text-gray-500">
                  1245 Ratings
                </span>
              </div>
              {product.description && (
                <p
                  className="
                    mt-2
                    text-xs
                    text-gray-700
                    line-clamp-2
                  "
                >
                  {product.description}
                </p>
              )}

              {product.mrp && (
                <p
                  className="
                    mt-2
                    text-sm
                    text-gray-400
                    line-through
                  "
                >
                  MRP ₹{product.mrp}
                </p>
              )}

              {product.discount && (
                <p
                  className="
                    text-sm
                    font-semibold
                    text-green-600
                  "
                >
                  Save ₹{product.discount}
                </p>
              )}

              <p
                className="
                  mt-2
                  text-xl
                  font-bold
                  text-yellow-600
                "
              >
                ₹{product.price}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-700
                "
              >
                🚚{" "}
                {product.deliveryFee &&
                product.deliveryFee > 0
                  ? `Delivery ₹${product.deliveryFee}`
                  : "Free Delivery"}
              </p>
              {cartItem ? (
                <div
                  className="
                    flex
                    justify-center
                    items-center
                    gap-4
                    mt-3
                  "
                >
                  <button
                    onClick={() =>
                      decreaseQuantity(product.id)
                    }
                    className="
                      bg-red-500
                      text-white
                      px-3
                      py-1
                      rounded
                    "
                  >
                    ➖
                  </button>

                  <span className="font-bold text-gray-900">
                    {cartItem.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(product.id)
                    }
                    className="
                      bg-green-600
                      text-white
                      px-3
                      py-1
                      rounded
                    "
                  >
                    ➕
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                    className="
                      w-full
                      bg-green-600
                      text-white
                      py-2
                      rounded-lg
                      mt-3
                    "
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product);

                      setTimeout(() => {
                        window.location.href =
                          "/checkout";
                      }, 200);
                    }}
                    className="
                      w-full
                      bg-yellow-500
                      text-black
                      py-2
                      rounded-lg
                      mt-2
                      font-bold
                    "
                  >
                    ⚡ Buy Now
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
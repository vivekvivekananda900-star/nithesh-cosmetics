"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

import { supabase } from "@/app/lib/supabase";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category: string;
  description?: string;
  image?: string;
  images?: string[];
  rating?: number;
  deliveryFee?: number;
}

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlSearch =
    searchParams.get("search") || "";

  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } =
          await supabase
            .from("products")
            .select("*");

        if (error) {
          throw error;
        }

        const list: Product[] =
          (data || []).map((item) => ({
            id: item.id,

            name:
              item.name || "",

            price:
              Number(item.price) || 0,

            mrp:
              Number(item.mrp) || 0,

            discount:
              Number(item.discount) || 0,

            category:
              item.category || "",

            description:
              item.description || "",

            image:
              item.images?.[0] ||
              item.image ||
              "/placeholder.png",

            images:
              item.images || [],

            rating:
              Number(item.rating) || 4.8,

            deliveryFee:
              Number(item.deliveryfee) || 0,
          }));

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

  const filteredProducts =
    products.filter((product) => {
      const searchText =
        (search || urlSearch)
          .toLowerCase()
          .trim();

      const searchMatch =
        product.name
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText);

      const categoryMatch =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      return (
        searchMatch &&
        categoryMatch
      );
    });

  const categories = [
    ...new Set(
      products
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean)
    ),
  ];

  return (
    <main
      className="
        min-h-screen
        bg-orange-50
        text-gray-900
        p-4
      "
    >
      {/* HOME BUTTON */}

      <Link
        href="/"
        className="
          inline-block
          bg-green-600
          hover:bg-green-700
          text-white
          px-4
          py-2
          rounded-lg
          transition
        "
      >
        🏠 Home
      </Link>

      {/* TITLE */}

      <h1
        className="
          text-3xl
          font-bold
          text-center
          my-6
        "
      >
        Our Products
      </h1>

      {/* SEARCH + CATEGORY */}

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
            setSearch(
              e.target.value
            )
          }
          className="
            flex-1
            border
            rounded-lg
            p-3
            bg-white
            outline-none
            focus:ring-2
            focus:ring-green-500
          "
        />

        <select
          value={
            selectedCategory
          }
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
            outline-none
          "
        >
          <option value="All">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>
      </div>

      {/* PRODUCTS GRID */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
        "
      >
        {filteredProducts.map(
          (product) => {
            const cartItem =
              cart.find(
                (item) =>
                  item.id ===
                  product.id
              );

            return (
              <div
                key={product.id}
                className="
                  bg-white
                  p-3
                  rounded-xl
                  shadow-md
                  hover:shadow-xl
                  transition
                  overflow-hidden
                "
              >
                {/* PRODUCT IMAGE */}

                <Link
                  href={`/products/${product.id}`}
                >
                  <div
                    className="
                      w-full
                      h-36
                      bg-gray-50
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      overflow-hidden
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
                      onError={(
                        e
                      ) => {
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
                </Link>

                {/* PRODUCT NAME */}

                <Link
                  href={`/products/${product.id}`}
                >
                  <h2
                    className="
                      mt-3
                      font-bold
                      line-clamp-2
                      min-h-[48px]
                    "
                  >
                    {
                      product.name
                    }
                  </h2>
                </Link>

                {/* CATEGORY */}

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                  "
                >
                  {
                    product.category
                  }
                </p>

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
                      text-xl
                      font-bold
                      text-green-600
                    "
                  >
                    ₹
                    {
                      product.price
                    }
                  </p>

                  {product.mrp &&
                    product.mrp >
                      product.price && (
                      <p
                        className="
                          text-sm
                          line-through
                          text-gray-400
                        "
                      >
                        ₹
                        {
                          product.mrp
                        }
                      </p>
                    )}
                </div>

                {/* DISCOUNT */}

                {product.discount ? (
                  <p
                    className="
                      text-green-600
                      text-sm
                      mt-1
                    "
                  >
                    Save ₹
                    {
                      product.discount
                    }
                  </p>
                ) : null}

                {/* CART CONTROLS */}

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
                        decreaseQuantity(
                          product.id
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-3
                        py-1
                        rounded
                      "
                    >
                      ➖
                    </button>

                    <span
                      className="
                        font-bold
                      "
                    >
                      {
                        cartItem.quantity
                      }
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          product.id
                        )
                      }
                      className="
                        bg-green-600
                        hover:bg-green-700
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
                        addToCart(
                          product
                        )
                      }
                      className="
                        w-full
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        py-2
                        rounded-lg
                        mt-3
                        transition
                      "
                    >
                      🛒 Add To Cart
                    </button>

                    <button
                      onClick={() => {
                        addToCart(
                          product
                        );

                        router.push(
                          "/checkout"
                        );
                      }}
                      className="
                        w-full
                        bg-yellow-500
                        hover:bg-yellow-600
                        py-2
                        rounded-lg
                        mt-2
                        font-bold
                        transition
                      "
                    >
                      ⚡ Buy Now
                    </button>
                  </>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* EMPTY STATE */}

      {filteredProducts.length ===
        0 && (
        <div
          className="
            text-center
            py-20
            text-gray-500
          "
        >
          <p className="text-2xl">
            😕
          </p>

          <p className="mt-2">
            No products found
          </p>
        </div>
      )}
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category: string;
  description?: string;
  image?: string;
}

export default function AdminProducts() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  /*
  ==================================
  LOAD PRODUCTS

  No login check
  No admin role check
  ==================================
  */

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error) {
      console.error(
        "Products loading error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  ==================================
  SEARCH
  ==================================
  */

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(query) ||
          product.category
            .toLowerCase()
            .includes(query)
      );
    }, [products, search]);

  /*
  ==================================
  DELETE PRODUCT
  ==================================
  */

  async function deleteProduct(
    id: string
  ) {
    const ok =
      window.confirm(
        "Delete this product?"
      );

    if (!ok) {
      return;
    }

    setDeletingId(id);

    try {
      const {
        error,
      } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setProducts(
        (current) =>
          current.filter(
            (product) =>
              product.id !== id
          )
      );

      alert(
        "✅ Product Deleted Successfully"
      );
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /*
  ==================================
  LOADING
  ==================================
  */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#fffaf5]
        "
      >
        <div className="text-center">
          <Loader2
            size={38}
            className="
              mx-auto
              animate-spin
              text-orange-500
            "
          />

          <p
            className="
              mt-3
              font-bold
              text-gray-700
            "
          >
            Loading Products...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff5eb]
        to-white
        px-4
        py-8
        sm:px-6
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        {/* Header */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-orange-500
              "
            >
              Nithesh Cosmetics
            </p>

            <h1
              className="
                mt-2
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
              <Package
                size={34}
                className="
                  text-orange-500
                "
              />

              Manage Products
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Add, edit and delete
              store products.
            </p>
          </div>

          <Link
            href="/admin/add-product"
            className="
              flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-green-500
              to-emerald-600
              px-5
              py-3
              text-sm
              font-black
              text-white
              shadow-[0_10px_25px_rgba(16,185,129,0.22)]
              transition-all
              hover:-translate-y-0.5
              active:scale-[0.98]
            "
          >
            <Plus size={18} />

            Add Product
          </Link>
        </div>

        {/* Search */}

        <div
          className="
            relative
            mb-6
          "
        >
          <Search
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search by product name or category..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              bg-white
              py-4
              pl-12
              pr-4
              text-sm
              outline-none
              shadow-sm
              transition-all
              focus:border-orange-400
              focus:ring-4
              focus:ring-orange-100
              sm:text-base
            "
          />
        </div>

        {/* Count */}

        <div
          className="
            mb-6
            inline-flex
            items-center
            rounded-full
            border
            border-orange-100
            bg-white
            px-4
            py-2
            text-sm
            font-bold
            text-orange-600
            shadow-sm
          "
        >
          {
            filteredProducts.length
          }{" "}
          {filteredProducts.length ===
          1
            ? "Product"
            : "Products"}
        </div>

        {/* Empty */}

        {filteredProducts.length ===
          0 && (
          <div
            className="
              rounded-[28px]
              border
              border-dashed
              border-gray-200
              bg-white
              p-12
              text-center
            "
          >
            <Package
              size={44}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h2
              className="
                mt-4
                text-xl
                font-black
                text-gray-800
              "
            >
              No products found
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Try another search
              or add a new product.
            </p>
          </div>
        )}

        {/* Desktop Table */}

        {filteredProducts.length >
          0 && (
          <div
            className="
              hidden
              overflow-hidden
              rounded-[26px]
              border
              border-gray-100
              bg-white
              shadow-[0_14px_45px_rgba(15,23,42,0.07)]
              md:block
            "
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className="
                    bg-gray-950
                    text-white
                  "
                >
                  <tr>
                    <th className="p-4 text-left">
                      Image
                    </th>

                    <th className="p-4 text-left">
                      Name
                    </th>

                    <th className="p-4 text-left">
                      Category
                    </th>

                    <th className="p-4 text-left">
                      Price
                    </th>

                    <th className="p-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    (product) => (
                      <tr
                        key={
                          product.id
                        }
                        className="
                          border-b
                          border-gray-100
                          transition-colors
                          last:border-b-0
                          hover:bg-orange-50/40
                        "
                      >
                        {/* Image */}

                        <td className="p-4">
                          <div
                            className="
                              flex
                              h-20
                              w-20
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-2xl
                              bg-gray-50
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
                              className="
                                h-full
                                w-full
                                object-contain
                                p-2
                              "
                              onError={(
                                event
                              ) => {
                                event.currentTarget.src =
                                  "/placeholder.png";
                              }}
                            />
                          </div>
                        </td>

                        {/* Name */}

                        <td className="p-4">
                          <p
                            className="
                              max-w-[260px]
                              font-black
                              text-gray-900
                            "
                          >
                            {
                              product.name
                            }
                          </p>
                        </td>

                        {/* Category */}

                        <td className="p-4">
                          <span
                            className="
                              rounded-full
                              bg-orange-50
                              px-3
                              py-1.5
                              text-xs
                              font-bold
                              text-orange-600
                            "
                          >
                            {
                              product.category
                            }
                          </span>
                        </td>

                        {/* Price */}

                        <td className="p-4">
                          <p
                            className="
                              text-lg
                              font-black
                              text-orange-600
                            "
                          >
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          {product.mrp &&
                            product.mrp >
                              product.price && (
                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-gray-400
                                  line-through
                                "
                              >
                                ₹
                                {Number(
                                  product.mrp
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            )}
                        </td>

                        {/* Actions */}

                        <td className="p-4">
                          <div
                            className="
                              flex
                              flex-wrap
                              gap-2
                            "
                          >
                            <Link
                              href={`/admin/edit-product/${product.id}`}
                              className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-blue-50
                                px-4
                                py-2.5
                                text-sm
                                font-bold
                                text-blue-700
                                transition-all
                                hover:bg-blue-100
                              "
                            >
                              <Pencil
                                size={16}
                              />

                              Edit
                            </Link>

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                product.id
                              }
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-red-50
                                px-4
                                py-2.5
                                text-sm
                                font-bold
                                text-red-600
                                transition-all
                                hover:bg-red-100
                                disabled:pointer-events-none
                                disabled:opacity-50
                              "
                            >
                              {deletingId ===
                              product.id ? (
                                <Loader2
                                  size={
                                    16
                                  }
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={
                                    16
                                  }
                                />
                              )}

                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards */}

        <div
          className="
            grid
            gap-4
            md:hidden
          "
        >
          {filteredProducts.map(
            (product) => (
              <article
                key={
                  product.id
                }
                className="
                  rounded-[26px]
                  border
                  border-gray-100
                  bg-white
                  p-4
                  shadow-[0_10px_35px_rgba(15,23,42,0.06)]
                "
              >
                <div
                  className="
                    flex
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      h-24
                      w-24
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      bg-gray-50
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
                      className="
                        h-full
                        w-full
                        object-contain
                        p-2
                      "
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          "/placeholder.png";
                      }}
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <h2
                      className="
                        line-clamp-2
                        font-black
                        text-gray-900
                      "
                    >
                      {
                        product.name
                      }
                    </h2>

                    <p
                      className="
                        mt-2
                        text-xs
                        font-bold
                        text-gray-500
                      "
                    >
                      {
                        product.category
                      }
                    </p>

                    <p
                      className="
                        mt-2
                        text-xl
                        font-black
                        text-orange-600
                      "
                    >
                      ₹
                      {Number(
                        product.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  <Link
                    href={`/admin/edit-product/${product.id}`}
                    className="
                      flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-blue-50
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-blue-700
                    "
                  >
                    <Pencil
                      size={16}
                    />

                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={
                      deletingId ===
                      product.id
                    }
                    onClick={() =>
                      deleteProduct(
                        product.id
                      )
                    }
                    className="
                      flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-50
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-red-600
                      disabled:pointer-events-none
                      disabled:opacity-50
                    "
                  >
                    {deletingId ===
                    product.id ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2
                        size={16}
                      />
                    )}

                    Delete
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Package,
  Save,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

interface Product {
  id: string;
  name: string;
  image?: string;
  stock?: number;
}

export default function StockManagementPage() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [stockValues, setStockValues] =
    useState<Record<string, number>>({});

  /*
  ==============================
  LOAD PRODUCTS
  ==============================

  No login check.
  No admin role check.
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
        .select(
          "id,name,image,stock"
        )
        .order("name", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      setProducts(data || []);

      const stocks: Record<
        string,
        number
      > = {};

      data?.forEach(
        (item) => {
          stocks[item.id] =
            Number(
              item.stock || 0
            );
        }
      );

      setStockValues(
        stocks
      );
    } catch (error) {
      console.error(
        "Stock loading error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load stock."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  ==============================
  UPDATE STOCK
  ==============================
  */

  async function updateStock(
    id: string
  ) {
    const stock =
      Number(
        stockValues[id] ?? 0
      );

    if (
      Number.isNaN(stock)
    ) {
      alert(
        "Please enter valid stock."
      );

      return;
    }

    if (stock < 0) {
      alert(
        "Stock cannot be negative."
      );

      return;
    }

    setSavingId(id);

    try {
      const {
        error,
      } = await supabase
        .from("products")
        .update({
          stock,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      /*
      Update current screen
      without reloading everything.
      */

      setProducts(
        (current) =>
          current.map(
            (product) =>
              product.id === id
                ? {
                    ...product,
                    stock,
                  }
                : product
          )
      );

      alert(
        "✅ Stock Updated Successfully!"
      );
    } catch (error) {
      console.error(
        "Stock update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Stock update failed."
      );
    } finally {
      setSavingId(null);
    }
  }

  /*
  ==============================
  LOADING
  ==============================
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
            Loading Stock...
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
          max-w-6xl
        "
      >
        {/* Heading */}

        <div className="mb-8">
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

            Stock Management
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            View and update
            product stock levels.
          </p>
        </div>

        {/* Product count */}

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
          {products.length}{" "}
          {products.length === 1
            ? "Product"
            : "Products"}
        </div>

        {/* Empty */}

        {products.length ===
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
              No Products
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Add products first
              to manage stock.
            </p>
          </div>
        )}

        {/* Products */}

        <div className="grid gap-4">
          {products.map(
            (product) => {
              const currentStock =
                product.stock ||
                0;

              const enteredStock =
                stockValues[
                  product.id
                ] ?? 0;

              return (
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
                    transition-all
                    hover:-translate-y-0.5
                    hover:shadow-[0_15px_40px_rgba(15,23,42,0.09)]
                    sm:p-5
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      sm:flex-row
                      sm:items-center
                    "
                  >
                    {/* Image */}

                    <div
                      className="
                        flex
                        h-28
                        w-full
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-2xl
                        bg-gray-50
                        sm:h-24
                        sm:w-24
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

                    {/* Product */}

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <h2
                        className="
                          text-lg
                          font-black
                          text-gray-900
                          sm:text-xl
                        "
                      >
                        {
                          product.name
                        }
                      </h2>

                      <div
                        className="
                          mt-2
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          Current Stock:
                        </span>

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-black
                            ${
                              currentStock ===
                              0
                                ? "bg-red-50 text-red-600"
                                : currentStock <=
                                    5
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-green-50 text-green-600"
                            }
                          `}
                        >
                          {
                            currentStock
                          }
                        </span>
                      </div>

                      {currentStock ===
                        0 && (
                        <p
                          className="
                            mt-2
                            text-xs
                            font-bold
                            text-red-500
                          "
                        >
                          Out of stock
                        </p>
                      )}

                      {currentStock >
                        0 &&
                        currentStock <=
                          5 && (
                          <p
                            className="
                              mt-2
                              text-xs
                              font-bold
                              text-amber-600
                            "
                          >
                            Low stock
                          </p>
                        )}
                    </div>

                    {/* Input + Save */}

                    <div
                      className="
                        flex
                        w-full
                        flex-col
                        gap-3
                        sm:w-auto
                        sm:flex-row
                        sm:items-center
                      "
                    >
                      <div>
                        <label
                          className="
                            mb-1.5
                            block
                            text-xs
                            font-bold
                            text-gray-500
                          "
                        >
                          New Stock
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={
                            enteredStock
                          }
                          onChange={(
                            e
                          ) =>
                            setStockValues(
                              (
                                current
                              ) => ({
                                ...current,

                                [product.id]:
                                  Math.max(
                                    0,
                                    Number(
                                      e
                                        .target
                                        .value
                                    )
                                  ),
                              })
                            )
                          }
                          className="
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3
                            font-bold
                            text-gray-900
                            outline-none
                            transition-all
                            focus:border-orange-400
                            focus:bg-white
                            focus:ring-4
                            focus:ring-orange-100
                            sm:w-32
                          "
                        />
                      </div>

                      <button
                        type="button"
                        disabled={
                          savingId ===
                          product.id
                        }
                        onClick={() =>
                          updateStock(
                            product.id
                          )
                        }
                        className="
                          mt-auto
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
                          font-black
                          text-white
                          shadow-[0_8px_22px_rgba(16,185,129,0.22)]
                          transition-all
                          hover:-translate-y-0.5
                          active:scale-[0.98]
                          disabled:pointer-events-none
                          disabled:opacity-60
                        "
                      >
                        {savingId ===
                        product.id ? (
                          <>
                            <Loader2
                              size={
                                17
                              }
                              className="animate-spin"
                            />

                            Saving...
                          </>
                        ) : (
                          <>
                            <Save
                              size={
                                17
                              }
                            />

                            Save
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}
"use client";

import {
  MouseEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  Heart,
  ShoppingCart,
  Sparkles,
  Star,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

import { useCart } from "@/app/context/CartContext";

import {
  isInWishlist,
  toggleWishlist,
} from "@/app/lib/wishlist";

type Product = {
  id: string;

  name: string;

  price: number;

  category?: string | null;

  image?: string;

  images?: string[];

  deliveryFee?: number;

  wishlisted: boolean;
};

export default function ProductSection() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [
    addedProductId,
    setAddedProductId,
  ] = useState<
    string | null
  >(null);

  const [
    wishlistLoading,
    setWishlistLoading,
  ] = useState<
    string | null
  >(null);

  const { addToCart } =
    useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  async function fetchProducts() {
    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .limit(6);

      if (error) {
        throw error;
      }

      const formattedProducts: Product[] =
        await Promise.all(
          (data || []).map(
            async (
              item
            ) => {
              let wishlisted =
                false;

              try {
                wishlisted =
                  await isInWishlist(
                    item.id
                  );
              } catch (
                error
              ) {
                console.error(
                  "Wishlist check error:",
                  error
                );
              }

              const images =
                Array.isArray(
                  item.images
                )
                  ? item.images
                  : [];

              return {
                id:
                  String(
                    item.id
                  ),

                name:
                  item.name ||
                  "Product",

                price:
                  Number(
                    item.price ||
                      0
                  ),

                category:
                  item.category ||
                  null,

                image:
                  images[0] ||
                  item.image ||
                  "/placeholder.png",

                images,

                deliveryFee:
                  Number(
                    item.deliveryfee ??
                      item.deliveryFee ??
                      0
                  ),

                wishlisted,
              };
            }
          )
        );

      setProducts(
        formattedProducts
      );
    } catch (error) {
      console.error(
        "Product loading error:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     WISHLIST
  ========================= */

  async function handleWishlist(
    e: MouseEvent<HTMLButtonElement>,
    productId: string
  ) {
    e.preventDefault();
    e.stopPropagation();

    try {
      setWishlistLoading(
        productId
      );

      const result =
        await toggleWishlist(
          productId
        );

      if (
        !result.success
      ) {
        alert(
          result.message ||
            "Please login first"
        );

        return;
      }

      setProducts(
        (
          previous
        ) =>
          previous.map(
            (item) =>
              item.id ===
              productId
                ? {
                    ...item,

                    wishlisted:
                      result.action ===
                      "added",
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      alert(
        "Unable to update wishlist"
      );
    } finally {
      setWishlistLoading(
        null
      );
    }
  }

  /* =========================
     CART
  ========================= */

  function handleAddToCart(
    product: Product
  ) {
    addToCart({
      id: product.id,

      name: product.name,

      price:
        product.price,

      image:
        product.image ||
        "/placeholder.png",

      deliveryFee:
        product.deliveryFee ??
        0,
    });

    setAddedProductId(
      product.id
    );

    window.setTimeout(
      () => {
        setAddedProductId(
          (
            current
          ) =>
            current ===
            product.id
              ? null
              : current
        );
      },
      1400
    );
  }

  function formatPrice(
    value: number
  ) {
    return Number(
      value || 0
    ).toLocaleString(
      "en-IN"
    );
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section
        className="
          mb-24
          mt-8
          px-3
          sm:px-5
          lg:px-8
        "
      >
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
              grid-cols-2
              gap-3
              sm:gap-5
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {[
              1, 2, 3, 4, 5,
              6,
            ].map(
              (item) => (
                <div
                  key={
                    item
                  }
                  className="
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-gray-100
                    bg-white
                  "
                >
                  <div
                    className="
                      h-40
                      animate-pulse
                      bg-gray-100
                      sm:h-52
                    "
                  />

                  <div className="p-3 sm:p-4">
                    <div
                      className="
                        h-4
                        w-full
                        animate-pulse
                        rounded
                        bg-gray-200
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-4
                        w-2/3
                        animate-pulse
                        rounded
                        bg-gray-100
                      "
                    />

                    <div
                      className="
                        mt-4
                        h-6
                        w-20
                        animate-pulse
                        rounded
                        bg-gray-200
                      "
                    />

                    <div
                      className="
                        mt-4
                        h-11
                        w-full
                        animate-pulse
                        rounded-xl
                        bg-orange-100
                      "
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (
    products.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="
        relative
        mb-24
        mt-8
        overflow-hidden
        px-3
        sm:px-5
        lg:px-8
      "
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-32
          h-72
          w-72
          rounded-full
          bg-orange-100/40
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
        "
      >
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

              Customer
              Favourites
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
              Trending Products
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
              Popular beauty and
              barber essentials.
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
              rounded-full
              bg-orange-50
              px-3
              py-2
              text-xs
              font-black
              text-orange-600
              transition-all
              duration-300
              hover:bg-orange-100
              sm:px-4
              sm:text-sm
            "
          >
            View All

            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        {/* Product Grid */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-5
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {products.map(
            (product) => {
              const added =
                addedProductId ===
                product.id;

              const wishlistBusy =
                wishlistLoading ===
                product.id;

              return (
                <article
                  key={
                    product.id
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-gray-100
                    bg-white
                    shadow-[0_8px_28px_rgba(15,23,42,0.06)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-orange-100
                    hover:shadow-[0_18px_45px_rgba(249,115,22,0.12)]
                    sm:rounded-[30px]
                  "
                >
                  {/* Image */}

                  <Link
                    href={`/products/${product.id}`}
                    className="block"
                  >
                    <div
                      className="
                        relative
                        h-40
                        overflow-hidden
                        bg-gradient-to-br
                        from-[#fffaf5]
                        to-[#fff3e8]
                        sm:h-52
                        md:h-56
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
                        loading="lazy"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.onerror =
                            null;

                          event.currentTarget.src =
                            "/placeholder.png";
                        }}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          ease-out
                          group-hover:scale-[1.06]
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/10
                          via-transparent
                          to-transparent
                        "
                      />

                      {product.category && (
                        <span
                          className="
                            absolute
                            left-2
                            top-2
                            max-w-[70%]
                            truncate
                            rounded-full
                            border
                            border-white/60
                            bg-white/90
                            px-2.5
                            py-1
                            text-[8px]
                            font-black
                            uppercase
                            tracking-wide
                            text-orange-600
                            shadow-sm
                            backdrop-blur-md
                            sm:left-3
                            sm:top-3
                            sm:text-[9px]
                          "
                        >
                          {
                            product.category
                          }
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Wishlist */}

                  <button
                    type="button"
                    onClick={(
                      event
                    ) =>
                      handleWishlist(
                        event,
                        product.id
                      )
                    }
                    disabled={
                      wishlistBusy
                    }
                    aria-label={
                      product.wishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    className="
                      absolute
                      right-2
                      top-2
                      z-20
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/70
                      bg-white/90
                      shadow-[0_5px_16px_rgba(15,23,42,0.12)]
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:scale-110
                      active:scale-90
                      disabled:opacity-60
                      sm:right-3
                      sm:top-3
                      sm:h-10
                      sm:w-10
                    "
                  >
                    {wishlistBusy ? (
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-gray-200
                          border-t-orange-500
                        "
                      />
                    ) : (
                      <Heart
                        size={18}
                        className={
                          product.wishlisted
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500 transition-colors group-hover:text-red-400"
                        }
                      />
                    )}
                  </button>

                  {/* Content */}

                  <div className="p-3 sm:p-4">
                    <Link
                      href={`/products/${product.id}`}
                    >
                      <h3
                        className="
                          line-clamp-2
                          min-h-[38px]
                          text-[13px]
                          font-black
                          leading-[19px]
                          text-gray-900
                          transition-colors
                          duration-300
                          hover:text-orange-600
                          sm:min-h-[44px]
                          sm:text-[15px]
                          sm:leading-[22px]
                        "
                      >
                        {
                          product.name
                        }
                      </h3>
                    </Link>

                    {/* Rating */}

                    <div
                      className="
                        mt-2
                        flex
                        items-center
                        gap-1
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-1
                          rounded-full
                          bg-amber-50
                          px-2
                          py-1
                        "
                      >
                        <Star
                          size={
                            12
                          }
                          className="
                            fill-amber-400
                            text-amber-400
                          "
                        />

                        <span
                          className="
                            text-[10px]
                            font-black
                            text-amber-700
                          "
                        >
                          4.8
                        </span>
                      </div>

                      <span
                        className="
                          hidden
                          text-[10px]
                          font-medium
                          text-gray-400
                          sm:inline
                        "
                      >
                        Top rated
                      </span>
                    </div>

                    {/* Price */}

                    <div
                      className="
                        mt-3
                        flex
                        items-end
                        justify-between
                        gap-2
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-400
                          "
                        >
                          Price
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-lg
                            font-black
                            tracking-tight
                            text-gray-900
                            sm:text-xl
                          "
                        >
                          <span className="text-sm">
                            ₹
                          </span>

                          {formatPrice(
                            product.price
                          )}
                        </p>
                      </div>

                      <div
                        className="
                          hidden
                          rounded-full
                          bg-green-50
                          px-2
                          py-1
                          text-[9px]
                          font-black
                          text-green-700
                          sm:block
                        "
                      >
                        In Stock
                      </div>
                    </div>

                    {/* Add To Cart */}

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                      disabled={
                        added
                      }
                      className={`
                        mt-4
                        flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-2
                        text-[11px]
                        font-black
                        text-white
                        shadow-md
                        transition-all
                        duration-300
                        active:scale-[0.97]
                        disabled:pointer-events-none
                        sm:min-h-12
                        sm:rounded-2xl
                        sm:text-sm

                        ${
                          added
                            ? "bg-green-500 shadow-green-500/20"
                            : "bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-lg"
                        }
                      `}
                    >
                      {added ? (
                        <>
                          <Check
                            size={
                              17
                            }
                            strokeWidth={
                              3
                            }
                          />

                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart
                            size={
                              17
                            }
                          />

                          Add to
                          Cart
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
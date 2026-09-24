"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";
import { useCart } from "@/app/context/CartContext";

import {
  addWishlistItem,
  removeWishlistByProduct,
  isInWishlist,
} from "@/app/lib/wishlist";

import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  ChevronRight,
  PackageCheck,
  Sparkles,
  Check,
  Minus,
  Plus,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category?: string;
  description?: string;
  image?: string;
  images?: string[];
  stock?: number;
  deliveryFee?: number;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  const { addToCart } = useCart();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [liked, setLiked] =
    useState(false);

  const [quantity, setQuantity] =
    useState(1);

  const [cartAdded, setCartAdded] =
    useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);

      const { data, error } =
        await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

      if (error) throw error;

      const currentProduct: Product = {
        id: data.id,
        name: data.name || "",
        price: Number(data.price) || 0,
        mrp: Number(data.mrp) || 0,
        discount:
          Number(data.discount) || 0,
        category: data.category || "",
        description:
          data.description || "",

        image:
          data.images?.[0] ||
          data.image ||
          "/placeholder.png",

        images: data.images || [],

        stock:
          Number(data.stock) || 0,

        deliveryFee:
          Number(data.deliveryfee) || 0,
      };

      setProduct(currentProduct);

      setSelectedImage(
        currentProduct.images?.[0] ||
          currentProduct.image ||
          "/placeholder.png"
      );

      const wishlistStatus =
        await isInWishlist(
          currentProduct.id
        );

      setLiked(wishlistStatus);

      const { data: related } =
        await supabase
          .from("products")
          .select("*")
          .eq(
            "category",
            currentProduct.category
          )
          .neq(
            "id",
            currentProduct.id
          )
          .limit(4);

      setRelatedProducts(
        related?.map((item) => ({
          id: item.id,

          name: item.name,

          price:
            Number(item.price) || 0,

          mrp:
            Number(item.mrp) || 0,

          discount:
            Number(item.discount) || 0,

          category:
            item.category,

          description:
            item.description,

          image:
            item.images?.[0] ||
            item.image ||
            "/placeholder.png",

          images:
            item.images || [],

          stock:
            Number(item.stock) || 0,

          deliveryFee:
            Number(
              item.deliveryfee
            ) || 0,
        })) || []
      );
    } catch (error) {
      console.error(
        "Product load error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite() {
    if (!product) return;

    if (liked) {
      await removeWishlistByProduct(
        product.id
      );

      setLiked(false);
    } else {
      await addWishlistItem(
        product.id
      );

      setLiked(true);
    }
  }

  function formatPrice(price: number) {
    return Number(
      price || 0
    ).toLocaleString("en-IN");
  }

  function handleAddToCart() {
    if (!product) return;

    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(product);
    }

    setCartAdded(true);

    setTimeout(() => {
      setCartAdded(false);
    }, 1600);
  }

  function handleBuyNow() {
    if (!product) return;

    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(product);
    }

    router.push("/checkout");
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e8]">

        <div className="text-center">

          <div className="relative mx-auto h-16 w-16">

            <div className="absolute inset-0 rounded-full border-4 border-orange-100" />

            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-orange-500" />

            <ShoppingCart
              size={23}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500"
            />

          </div>

          <p className="mt-4 text-sm font-bold text-gray-500">
            Loading product...
          </p>

        </div>

      </main>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e8] px-4">

        <div className="text-center">

          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[30px] border border-orange-100 bg-white shadow-xl">

            <PackageCheck
              size={46}
              className="text-orange-500"
            />

          </div>

          <h1 className="mt-6 text-3xl font-black">
            Product Not Found
          </h1>

          <Link
            href="/products"
            className="mt-7 inline-flex rounded-2xl bg-orange-500 px-7 py-4 font-bold text-white"
          >
            Browse Products
          </Link>

        </div>

      </main>
    );
  }

  const productImages =
    product.images?.length
      ? product.images
      : [
          product.image ||
            "/placeholder.png",
        ];

  const inStock =
    (product.stock ?? 0) > 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf5] via-[#fff8f2] to-white pb-32 text-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-black dark:text-white">

      {/* Background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="product-blob-one absolute -left-40 top-24 h-96 w-96 rounded-full bg-orange-200/25 blur-3xl" />

        <div className="product-blob-two absolute -right-40 top-[650px] h-96 w-96 rounded-full bg-rose-200/20 blur-3xl" />

      </div>

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

          <button
            onClick={() =>
              router.back()
            }
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95 dark:border-gray-800 dark:bg-gray-900"
          >
            <ArrowLeft size={21} />
          </button>

          <div className="text-center">

            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-500 sm:text-[10px]">
              Nithesh Cosmetics
            </p>

            <h1 className="text-sm font-black sm:text-lg">
              Product Details
            </h1>

          </div>

          <button
            onClick={
              toggleFavorite
            }
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              transition-all
              duration-300
              active:scale-90

              ${
                liked
                  ? "border-red-100 bg-red-50 text-red-500"
                  : "border-gray-200 bg-white text-gray-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
              }
            `}
          >
            <Heart
              size={21}
              className={
                liked
                  ? "fill-red-500"
                  : ""
              }
            />
          </button>

        </div>

      </header>

      {/* ================= PRODUCT ================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">

          {/* ================= IMAGES ================= */}

          <section className="product-enter">

            <div className="relative overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-gray-800 dark:bg-gray-900 sm:rounded-[36px]">

              {/* Discount */}

              {product.discount ? (
                <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-2 text-xs font-black text-white shadow-lg sm:left-5 sm:top-5 sm:px-4">

                  🔥 Save ₹
                  {formatPrice(
                    product.discount
                  )}

                </div>
              ) : null}

              {/* Premium badge */}

              <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-orange-600 shadow-sm backdrop-blur-xl sm:right-5 sm:top-5">

                <Sparkles size={13} />

                Premium

              </div>

              {/* Main Image */}

              <div className="group relative flex min-h-[350px] items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#fffaf7] to-orange-50 sm:min-h-[500px]">

                <div className="absolute h-64 w-64 rounded-full bg-orange-100/60 blur-3xl sm:h-96 sm:w-96" />

                <img
                  src={
                    selectedImage ||
                    product.image ||
                    "/placeholder.png"
                  }
                  alt={
                    product.name
                  }
                  onError={(e) => {
                    e.currentTarget.onerror =
                      null;

                    e.currentTarget.src =
                      "/placeholder.png";
                  }}
                  className="relative z-10 h-[320px] w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04] sm:h-[500px] sm:p-10"
                />

              </div>

              {/* Thumbnails */}

              <div className="border-t border-gray-100 p-3 sm:p-4">

                <div className="flex gap-2.5 overflow-x-auto pb-1">

                  {productImages.map(
                    (img, index) => (
                      <button
                        key={
                          index
                        }
                        onClick={() =>
                          setSelectedImage(
                            img ||
                              "/placeholder.png"
                          )
                        }
                        className={`
                          flex
                          h-20
                          w-20
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-2xl
                          border-2
                          bg-white
                          transition-all
                          duration-300
                          active:scale-95
                          sm:h-24
                          sm:w-24

                          ${
                            selectedImage ===
                            img
                              ? "border-orange-500 shadow-[0_6px_20px_rgba(249,115,22,0.18)]"
                              : "border-gray-100 hover:border-orange-200"
                          }
                        `}
                      >

                        <img
                          src={
                            img ||
                            "/placeholder.png"
                          }
                          alt={`${product.name} ${index + 1}`}
                          onError={(
                            e
                          ) => {
                            e.currentTarget.onerror =
                              null;

                            e.currentTarget.src =
                              "/placeholder.png";
                          }}
                          className="h-full w-full object-contain p-1.5"
                        />

                      </button>
                    )
                  )}

                </div>

              </div>

            </div>

          </section>

          {/* ================= PRODUCT INFO ================= */}

          <section className="product-enter lg:sticky lg:top-24 lg:h-fit">

            <div className="rounded-[30px] border border-gray-100 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] dark:border-gray-800 dark:bg-gray-900 sm:rounded-[36px] sm:p-7">

              {/* Category */}

              <div className="flex flex-wrap items-center justify-between gap-3">

                <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-orange-600 sm:text-xs">
                  {product.category ||
                    "Premium Beauty"}
                </span>

                <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-black text-green-700">

                  <Star
                    size={14}
                    className="fill-green-600"
                  />

                  4.8

                </div>

              </div>

              {/* Name */}

              <h2 className="mt-5 text-2xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                {product.name}
              </h2>

              {/* Stock */}

              <div className="mt-4 flex flex-wrap items-center gap-2">

                {inStock ? (
                  <div className="flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">

                    <Check
                      size={14}
                      strokeWidth={
                        3
                      }
                    />

                    In Stock

                  </div>
                ) : (
                  <div className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                    Out of Stock
                  </div>
                )}

                {inStock &&
                  (product.stock ??
                    0) <=
                    5 && (
                    <span className="text-xs font-bold text-red-500">
                      Only{" "}
                      {
                        product.stock
                      }{" "}
                      left
                    </span>
                  )}

              </div>

              {/* Price */}

              <div className="mt-6 rounded-[24px] bg-gradient-to-r from-orange-50 to-amber-50 p-4 sm:p-5">

                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Special Price
                </p>

                <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">

                  <span className="text-3xl font-black tracking-tight text-orange-600 sm:text-4xl">
                    ₹
                    {formatPrice(
                      product.price
                    )}
                  </span>

                  {product.mrp &&
                  product.mrp >
                    product.price ? (
                    <span className="pb-1 text-base font-semibold text-gray-400 line-through sm:text-lg">
                      ₹
                      {formatPrice(
                        product.mrp
                      )}
                    </span>
                  ) : null}

                </div>

                {product.discount ? (
                  <p className="mt-2 text-xs font-bold text-green-600 sm:text-sm">
                    You save ₹
                    {formatPrice(
                      product.discount
                    )}
                  </p>
                ) : null}

              </div>

              {/* Quantity */}

              {inStock && (
                <div className="mt-6">

                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-gray-500">
                    Quantity
                  </p>

                  <div className="inline-flex items-center rounded-2xl border border-gray-200 bg-gray-50 p-1">

                    <button
                      onClick={() =>
                        setQuantity(
                          Math.max(
                            1,
                            quantity -
                              1
                          )
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-all hover:bg-orange-50 hover:text-orange-600 active:scale-90"
                    >
                      <Minus
                        size={16}
                      />
                    </button>

                    <span className="min-w-12 text-center font-black">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(
                            product.stock ||
                              99,
                            quantity +
                              1
                          )
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm transition-all hover:bg-orange-600 active:scale-90"
                    >
                      <Plus
                        size={16}
                      />
                    </button>

                  </div>

                </div>
              )}

              {/* Delivery Info */}

              <div className="mt-6 grid gap-3">

                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">

                    <Truck
                      size={20}
                    />

                  </div>

                  <div>

                    <p className="text-sm font-black text-gray-900">
                      {product.deliveryFee ===
                      0
                        ? "Free Delivery"
                        : `Delivery ₹${product.deliveryFee}`}
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-500">
                      Fast and reliable delivery
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm">

                    <ShieldCheck
                      size={20}
                    />

                  </div>

                  <div>

                    <p className="text-sm font-black text-gray-900">
                      100% Genuine Product
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-500">
                      Quality checked and verified
                    </p>

                  </div>

                </div>

              </div>

              {/* Description */}

              <div className="mt-7 border-t border-gray-100 pt-6">

                <h3 className="text-lg font-black sm:text-xl">
                  Product Description
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:text-base">
                  {product.description ||
                    "Premium quality cosmetic product with excellent performance and long-lasting results."}
                </p>

              </div>

              {/* Buttons Desktop */}

              <div className="mt-7 hidden grid-cols-2 gap-3 sm:grid">

                <button
                  disabled={
                    !inStock
                  }
                  onClick={
                    handleAddToCart
                  }
                  className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 bg-orange-50 px-4 font-black text-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                >

                  {cartAdded ? (
                    <>
                      <CheckCircleIcon />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart
                        size={19}
                      />
                      Add To Cart
                    </>
                  )}

                </button>

                <button
                  disabled={
                    !inStock
                  }
                  onClick={
                    handleBuyNow
                  }
                  className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 font-black text-white shadow-[0_12px_30px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(249,115,22,0.36)] active:scale-[0.98] disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
                >
                  ⚡ Buy Now
                </button>

              </div>

            </div>

          </section>

        </div>

        {/* ================= RELATED PRODUCTS ================= */}

        {relatedProducts.length >
          0 && (
          <section className="mt-10 sm:mt-14">

            <div className="mb-5 flex items-end justify-between gap-3 px-1">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-orange-500 sm:text-xs">
                  You May Also Like
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                  Related Products
                </h2>

              </div>

              <Link
                href="/products"
                className="flex items-center gap-1 text-xs font-bold text-orange-500 transition-all hover:text-orange-600 sm:text-sm"
              >
                View All

                <ChevronRight
                  size={16}
                />
              </Link>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">

              {relatedProducts.map(
                (
                  item,
                  index
                ) => (
                  <article
                    key={item.id}
                    className="related-card group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] dark:border-gray-800 dark:bg-gray-900 sm:rounded-[28px]"
                    style={{
                      animationDelay: `${index * 90}ms`,
                    }}
                  >

                    <Link
                      href={`/products/${item.id}`}
                      className="block"
                    >

                      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-orange-50">

                        {item.discount ? (
                          <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-[9px] font-black text-white sm:text-[10px]">
                            Save ₹
                            {
                              item.discount
                            }
                          </span>
                        ) : null}

                        <img
                          src={
                            item
                              .images?.[0] ||
                            item.image ||
                            "/placeholder.png"
                          }
                          alt={
                            item.name
                          }
                          onError={(
                            e
                          ) => {
                            e.currentTarget.onerror =
                              null;

                            e.currentTarget.src =
                              "/placeholder.png";
                          }}
                          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-4"
                        />

                      </div>

                    </Link>

                    <div className="p-3 sm:p-4">

                      <Link
                        href={`/products/${item.id}`}
                      >

                        <h3 className="line-clamp-2 min-h-10 text-xs font-black leading-5 text-gray-900 dark:text-white sm:text-sm">
                          {item.name}
                        </h3>

                      </Link>

                      <div className="mt-2 flex items-center gap-1">

                        <Star
                          size={13}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="text-[10px] font-bold text-gray-500 sm:text-xs">
                          4.8
                        </span>

                      </div>

                      <div className="mt-2 flex flex-wrap items-end gap-1.5">

                        <p className="text-lg font-black text-orange-600 sm:text-xl">
                          ₹
                          {formatPrice(
                            item.price
                          )}
                        </p>

                        {item.mrp &&
                        item.mrp >
                          item.price ? (
                          <span className="pb-0.5 text-[10px] text-gray-400 line-through sm:text-xs">
                            ₹
                            {formatPrice(
                              item.mrp
                            )}
                          </span>
                        ) : null}

                      </div>

                      <button
                        disabled={
                          (item.stock ??
                            0) <= 0
                        }
                        onClick={() =>
                          addToCart(
                            item
                          )
                        }
                        className="mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-2 text-[11px] font-black text-white shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 disabled:bg-gray-300 disabled:shadow-none sm:min-h-12 sm:text-sm"
                      >

                        <ShoppingCart
                          size={15}
                        />

                        {(item.stock ??
                          0) >
                        0
                          ? "Add To Cart"
                          : "Out of Stock"}

                      </button>

                    </div>

                  </article>
                )
              )}

            </div>

          </section>
        )}

      </div>

      {/* ================= MOBILE BOTTOM ACTIONS ================= */}

      <div className="fixed bottom-20 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 p-3 shadow-[0_-12px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:hidden">

        <div className="mx-auto grid max-w-md grid-cols-2 gap-2.5">

          <button
            disabled={!inStock}
            onClick={
              handleAddToCart
            }
            className="flex min-h-13 items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 bg-orange-50 px-3 text-sm font-black text-orange-600 transition-all active:scale-95 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {cartAdded ? (
              <>
                <Check
                  size={18}
                />
                Added
              </>
            ) : (
              <>
                <ShoppingCart
                  size={18}
                />

                Add Cart
              </>
            )}
          </button>

          <button
            disabled={!inStock}
            onClick={handleBuyNow}
            className="flex min-h-13 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 text-sm font-black text-white shadow-[0_8px_24px_rgba(249,115,22,0.28)] transition-all active:scale-95 disabled:from-gray-300 disabled:to-gray-400"
          >
            ⚡ Buy Now
          </button>

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      

    </main>
  );
}

function CheckCircleIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
      <Check
        size={13}
        strokeWidth={3}
      />
    </div>
  );
}

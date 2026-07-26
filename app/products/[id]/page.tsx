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

  const [product, setProduct] = useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    try {
      const { data, error } = await supabase
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
        discount: Number(data.discount) || 0,
        category: data.category || "",
        description: data.description || "",
        image:
          data.images?.[0] ||
          data.image ||
          "/placeholder.png",
        images: data.images || [],
        stock: Number(data.stock) || 0,
        deliveryFee: Number(data.deliveryfee) || 0,
      };

      setProduct(currentProduct);

      setSelectedImage(
        currentProduct.images?.[0] ||
          currentProduct.image ||
          "/placeholder.png"
      );

      const wishlistStatus = await isInWishlist(
        currentProduct.id
      );

      setLiked(wishlistStatus);

      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category", currentProduct.category)
        .neq("id", currentProduct.id)
        .limit(4);

      setRelatedProducts(
        related?.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price) || 0,
          mrp: Number(item.mrp) || 0,
          discount: Number(item.discount) || 0,
          category: item.category,
          description: item.description,
          image:
            item.images?.[0] ||
            item.image ||
            "/placeholder.png",
          images: item.images || [],
          stock: Number(item.stock) || 0,
        })) || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite() {
    if (!product) return;

    if (liked) {
      await removeWishlistByProduct(product.id);
      setLiked(false);
    } else {
      await addWishlistItem(product.id);
      setLiked(true);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-bold">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-bold">
        Product Not Found
      </div>
    );
  }
  return (
  <main
    className="
    min-h-screen
    bg-gray-100
    dark:bg-gray-950
    text-gray-900
    dark:text-white
    pb-10
    transition-colors
    duration-300
    "
  >

    {/* Header */}

    <div
      className="
      sticky
      top-0
      z-40
      px-4
      py-3
      flex
      items-center
      justify-between
      bg-white/90
      dark:bg-gray-900/90
      backdrop-blur
      shadow-md
      "
    >

      <button onClick={() => router.back()}>
        <ArrowLeft size={26} />
      </button>

      <h1 className="font-bold text-lg">
        Product Details
      </h1>

      <button
        onClick={toggleFavorite}
        className="transition"
      >
        <Heart
          size={24}
          className={
            liked
              ? "fill-red-500 text-red-500"
              : "text-red-500"
          }
        />
      </button>

    </div>

    {/* Product Images */}

    <div
      className="
      bg-white
      dark:bg-gray-800
      mt-3
      mx-3
      rounded-3xl
      shadow-lg
      overflow-hidden
      relative
      "
    >

      {product.discount ? (
        <div
          className="
          absolute
          top-4
          left-4
          bg-red-600
          text-white
          px-4
          py-2
          rounded-full
          font-bold
          z-10
          "
        >
          🔥 Save ₹{product.discount}
        </div>
      ) : null}

      <img
        src={
          selectedImage ||
          product.image ||
          "/placeholder.png"
        }
        alt={product.name}
        className="
        w-full
        h-[350px]
        md:h-[500px]
        object-contain
        p-6
        hover:scale-105
        transition
        duration-300
        "
      />

      {/* Image Thumbnails */}

      <div
        className="
        flex
        gap-3
        p-4
        overflow-x-auto
        "
      >

        {(product.images?.length
          ? product.images
          : [product.image || "/placeholder.png"]
        ).map((img, index) => (

          <button
            key={index}
            onClick={() =>
              setSelectedImage(
                img || "/placeholder.png"
              )
            }
            className={`
              border-2
              rounded-xl
              overflow-hidden
              ${
                selectedImage === img
                  ? "border-orange-500"
                  : "border-gray-200"
              }
            `}
          >

            <img
              src={img || "/placeholder.png"}
              alt={`Image ${index + 1}`}
              className="
              w-20
              h-20
              object-cover
              "
            />

          </button>

        ))}

      </div>

    </div>

    {/* Product Information Starts Below */}
    <div
  className="
  bg-white
  dark:bg-gray-800
  mt-3
  p-5
  rounded-t-3xl
  shadow-md
  "
>

  <h2
    className="
    text-3xl
    font-bold
    "
  >
    {product.name}
  </h2>

  <p
    className="
    text-gray-500
    dark:text-gray-400
    mt-2
    "
  >
    {product.category}
  </p>

  <div
    className="
    flex
    items-center
    gap-3
    mt-5
    flex-wrap
    "
  >

    <div
      className="
      bg-green-600
      text-white
      px-3
      py-1
      rounded-full
      flex
      items-center
      gap-1
      font-bold
      "
    >
      <Star size={15} />
      4.8
    </div>

    {(product.stock ?? 0) > 0 ? (
      <span
        className="
        bg-green-100
        text-green-700
        px-3
        py-1
        rounded-full
        text-sm
        "
      >
        🟢 In Stock
      </span>
    ) : (
      <span
        className="
        bg-red-100
        text-red-700
        px-3
        py-1
        rounded-full
        text-sm
        "
      >
        🔴 Out of Stock
      </span>
    )}

  </div>

  <div className="mt-6">

    <span
      className="
      text-4xl
      font-bold
      text-green-600
      "
    >
      ₹{product.price}
    </span>

    {product.mrp ? (
      <span
        className="
        ml-3
        text-xl
        line-through
        text-gray-500
        "
      >
        ₹{product.mrp}
      </span>
    ) : null}

  </div>

  {product.discount ? (
    <p
      className="
      text-green-600
      font-semibold
      mt-2
      "
    >
      Save ₹{product.discount}
    </p>
  ) : null}

  <div
    className="
    mt-6
    border
    border-green-200
    dark:border-green-800
    rounded-xl
    p-4
    bg-green-50
    dark:bg-green-950
    space-y-3
    "
  >

    <div className="flex items-center gap-2">
      <Truck size={20} />
      <span>
  {
    product.deliveryFee === 0
      ? "Free Delivery Available"
      : `Delivery Fee ₹${product.deliveryFee}`
  }
</span>
    </div>

    <div className="flex items-center gap-2">
      <ShieldCheck size={20} />
      <span>100% Genuine Product</span>
    </div>

  </div>

  <h3
    className="
    text-xl
    font-bold
    mt-8
    "
  >
    Description
  </h3>

  <p
    className="
    mt-3
    leading-7
    text-gray-600
    dark:text-gray-300
    "
  >
    {product.description ||
      "Premium quality cosmetic product with excellent performance and long-lasting results."}
  </p>

  <div
    className="
    mt-8
    flex
    flex-col
    sm:flex-row
    gap-4
    "
  >

    <button
      onClick={() => addToCart(product)}
      className="
      flex-1
      bg-green-600
      hover:bg-green-700
      text-white
      py-4
      rounded-xl
      font-bold
      flex
      items-center
      justify-center
      gap-2
      transition
      "
    >
      <ShoppingCart size={20} />
      Add To Cart
    </button>

    <button
      onClick={() => {
        addToCart(product);
        router.push("/checkout");
      }}
      className="
      flex-1
      bg-yellow-500
      hover:bg-yellow-600
      text-black
      py-4
      rounded-xl
      font-bold
      transition
      "
    >
      ⚡ Buy Now
    </button>

  </div>

</div>

{/* Related Products Section Starts Below */}
{relatedProducts.length > 0 && (
  <section className="mt-8 px-4">

    <div className="flex items-center justify-between mb-5">

      <h2 className="text-2xl font-bold">
        🔥 Related Products
      </h2>

      <Link
        href="/products"
        className="text-orange-500 font-semibold"
      >
        View All →
      </Link>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

      {relatedProducts.map((item) => (

        <div
          key={item.id}
          className="
          bg-white
          dark:bg-gray-800
          rounded-2xl
          overflow-hidden
          shadow-md
          hover:shadow-xl
          transition
          "
        >

          <Link href={`/products/${item.id}`}>

            <img
              src={
                item.images?.[0] ||
                item.image ||
                "/placeholder.png"
              }
              alt={item.name}
              className="
              w-full
              h-44
              object-cover
              "
            />

          </Link>

          <div className="p-4">

            <Link href={`/products/${item.id}`}>

              <h3 className="font-bold line-clamp-2">
                {item.name}
              </h3>

            </Link>

            <div className="flex items-center gap-1 mt-2">

              <Star
                size={15}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="text-sm">
                4.8
              </span>

            </div>

            <p className="text-green-600 text-xl font-bold mt-3">
              ₹{item.price}
            </p>

            <button
              onClick={() => addToCart(item)}
              className="
              mt-4
              w-full
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-xl
              flex
              items-center
              justify-center
              gap-2
              "
            >

              <ShoppingCart size={18} />

              Add To Cart

            </button>

          </div>

        </div>

      ))}

    </div>

  </section>
)}

</main>
);
}

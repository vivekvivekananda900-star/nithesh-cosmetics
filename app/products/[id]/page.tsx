"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Product, "id">),
        });
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="p-10 text-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">

      <div>
        <img
          src={product.image || "/no-image.png"}
          alt={product.name}
          className="w-full h-[450px] object-contain rounded-xl border"
        />
      </div>

      <div>
        <h1 className="text-4xl font-bold">
          {product.name}
        </h1>

        <p className="text-gray-500 mt-3">
          Category: {product.category}
        </p>

        <h2 className="text-3xl text-green-600 font-bold mt-5">
          ₹{product.price}
        </h2>

        <p className="mt-6 text-gray-700">
          {product.description ||
            "No description available for this product."}
        </p>

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => addToCart(product)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Add to Cart 🛒
          </button>

          <button
            onClick={() => {
              addToCart(product);
              router.push("/checkout");
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Buy Now ⚡
          </button>

        </div>
      </div>

    </div>
  );
}
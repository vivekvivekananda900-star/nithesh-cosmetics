"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      const list = snapshot.docs.slice(0, 3).map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));

      setProducts(list);
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-white">
      <h2 className="text-4xl font-bold text-center mb-10">
        Featured Products
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-100 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            )}

            <div className="p-5">
              <h3 className="text-xl font-bold">{product.name}</h3>

              <p className="text-yellow-600 font-bold mt-2">
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-black text-white py-3 rounded-lg hover:bg-yellow-500 hover:text-black"
              >
                Add to Cart 🛒
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
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

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));

      setProducts(list);
    };

    fetchProducts();
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={product.image || "/no-image.png"}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-sm md:text-lg line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-yellow-600 font-bold mt-2 text-lg">
                  ₹{product.price}
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition"
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
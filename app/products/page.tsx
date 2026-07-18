"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
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
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));

      const list: Product[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          mrp: data.mrp,
          discount: data.discount,
          category: data.category,
          description: data.description,
          image: data.image,
        };
      });

      setProducts(list);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchMatch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          🏠 Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8">
        Our Products
      </h1>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">

        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-3 w-full md:w-80"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="All">All Categories</option>

          {[...new Set(products.map((p) => p.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
  const cartItem = cart.find(
    (item) => item.id === product.id
  );

  return (
    <div
      key={product.id}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
    >
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover rounded-lg"
        />
      )}

      <h2 className="text-2xl font-bold mt-4">
        {product.name}
      </h2>

      <p className="text-gray-600">
        {product.category}
      </p>

      {product.description && (
        <p className="text-sm text-gray-500 mt-2">
          {product.description}
        </p>
      )}

      {product.mrp && (
        <p className="text-gray-500 line-through mt-2">
          MRP ₹{product.mrp}
        </p>
      )}

      {product.discount && (
        <p className="text-green-600 font-semibold">
          Save ₹{product.discount}
        </p>
      )}

      <p className="text-2xl text-yellow-600 font-bold mt-2">
        ₹{product.price}
      </p>

      {cartItem ? (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => decreaseQuantity(product.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            ➖
          </button>

          <span className="text-xl font-bold">
            {cartItem.quantity}
          </span>

          <button
            onClick={() => increaseQuantity(product.id)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ➕
          </button>
        </div>
      ) : (
       
  <>
    <button
      onClick={() => addToCart(product)}
      className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700"
    >
      🛒 Add to Cart
    </button>

    <button
      onClick={() => {
        addToCart(product);
        setTimeout(() => {
          window.location.href = "/checkout";
        }, 200);
      }}
      className="w-full bg-yellow-500 text-black py-2 rounded-lg mt-3 hover:bg-yellow-600 font-bold"
    >
      ⚡ Buy Now
    </button>
  </>
)}
    </div>
  );
})}
</div>
{/* Floating Cart Button */}
      <Link
        href="/checkout"
        className="fixed bottom-6 right-6 bg-black text-white px-5 py-4 rounded-full shadow-xl hover:bg-yellow-500 hover:text-black transition-all z-50 flex items-center gap-2"
      >
        🛒 Cart

        {cart.length > 0 && (
          <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {cart.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          </span>
        )}
      </Link>

    </main>
  );
}         
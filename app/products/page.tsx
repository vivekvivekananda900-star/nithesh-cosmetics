"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
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

  const { addToCart } = useCart();

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const list = snapshot.docs.map((d) => {
      const data = d.data();

      return {
        id: d.id,
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const handleEdit = async (id: string) => {
    const newPrice = prompt("Enter new selling price");

    if (!newPrice) return;

    await updateDoc(doc(db, "products", id), {
      price: Number(newPrice),
    });

    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Products
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
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer">

              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
              )}

              <h2 className="text-2xl font-bold">
                {product.name}
              </h2>

              <p className="text-gray-600 mt-1">
                {product.category}
              </p>

              {product.mrp && (
                <p className="text-gray-500 line-through">
                  MRP ₹{product.mrp}
                </p>
              )}

              {product.discount ? (
                <p className="text-green-600 font-semibold">
                  Save ₹{product.discount}
                </p>
              ) : null}

              <p className="text-2xl text-yellow-600 font-bold mt-2">
                ₹{product.price}
              </p>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700"
              >
                Add to Cart 🛒
              </button>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(product.id);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(product.id);
                  }}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
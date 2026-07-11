"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));

    const list: Product[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
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

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const deleteProduct = async (id: string) => {
    const ok = confirm("Delete this product?");

    if (!ok) return;

    await deleteDoc(doc(db, "products", id));

    alert("✅ Product Deleted Successfully");

    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Manage Products
        </h1>

        <Link
          href="/admin/add-product"
          className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
        >
          ➕ Add Product
        </Link>

      </div>

      <input
        type="text"
        placeholder="🔍 Search Product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg mb-6"
      />

      <div className="overflow-x-auto">

        <table className="w-full bg-white rounded-xl shadow-lg">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4">Image</th>

              <th className="p-4">Name</th>

              <th className="p-4">Category</th>

              <th className="p-4">Price</th>

              <th className="p-4">Actions</th>

            </tr>

          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">
                      No Image
                    </span>
                  )}
                </td>

                <td className="p-4 font-semibold">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.category}
                </td>

                <td className="p-4">
                  ₹{product.price}
                </td>

                <td className="p-4 flex gap-3">

                  <Link
                    href={`/admin/edit-product/${product.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    ✏️ Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    🗑 Delete
                  </button>

                </td>

              </tr>
            ))}
            </tbody>

        </table>

      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center mt-10 text-gray-500 text-lg">
          No products found.
        </div>
      )}

    </main>
  );
}
"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Admin Dashboard
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Link
          href="/admin/add-product"
          className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold">➕ Add Product</h2>
          <p className="mt-3 text-gray-600">
            Add new products
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold">📦 Manage Products</h2>
          <p className="mt-3 text-gray-600">
            Edit & Delete Products
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold">🛒 Orders</h2>
          <p className="mt-3 text-gray-600">
            View & Manage Orders
          </p>
        </Link>

        <Link
          href="/contact"
          className="bg-white shadow-lg rounded-xl p-8 text-center hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold">📞 Contact</h2>
          <p className="mt-3 text-gray-600">
            Business details
          </p>
        </Link>

      </div>
    </main>
  );
}
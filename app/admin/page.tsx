"use client";

import Link from "next/link";


export default function AdminDashboard() {

  return (

    <main
      className="
      min-h-screen
      bg-gray-100
      dark:bg-gray-950
      p-6 md:p-8
      "
    >


      <h1
        className="
        text-3xl md:text-4xl
        font-bold
        text-center
        mb-10
        dark:text-white
        "
      >
        🛒 Admin Dashboard
      </h1>





      <div
        className="
        max-w-6xl
        mx-auto
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        "
      >



        {/* Add Product */}

        <Link
          href="/admin/add-product"
          className="
          bg-white
          dark:bg-gray-900
          shadow-lg
          rounded-xl
          p-8
          text-center
          hover:shadow-xl
          transition
          "
        >

          <h2 className="text-2xl font-bold dark:text-white">
            ➕ Add Product
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Add new products
          </p>

        </Link>






        {/* Manage Products */}

        <Link
          href="/admin/products"
          className="
          bg-white
          dark:bg-gray-900
          shadow-lg
          rounded-xl
          p-8
          text-center
          hover:shadow-xl
          transition
          "
        >

          <h2 className="text-2xl font-bold dark:text-white">
            📦 Manage Products
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Edit & Delete Products
          </p>

        </Link>







        {/* Stock */}

        <Link
          href="/admin/stock"
          className="
          bg-white
          dark:bg-gray-900
          shadow-lg
          rounded-xl
          p-8
          text-center
          hover:shadow-xl
          transition
          "
        >

          <h2 className="text-2xl font-bold dark:text-white">
            📊 Stock Management
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Update stock quantity
          </p>

        </Link>







        {/* Banner */}

        <Link
          href="/admin/banner"
          className="
          bg-white
          dark:bg-gray-900
          shadow-lg
          rounded-xl
          p-8
          text-center
          hover:shadow-xl
          transition
          "
        >

          <h2 className="text-2xl font-bold dark:text-white">
            🎞️ Banner Management
          </h2>

          <p className="mt-3 text-gray-600 dark:bg-gray-900">
            Add, Edit & Delete banners
          </p>

        </Link>







        {/* New Arrivals */}

        <Link
          href="/admin/new-arrivals"
          className="
          bg-white
          dark:bg-gray-900
          shadow-lg
          rounded-xl
          p-8
          text-center
          hover:shadow-xl
          transition
          "
        >

          <h2 className="text-2xl font-bold dark:text-white">
            ⭐ New Arrivals
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Manage homepage products
          </p>

        </Link>







        {/* Orders */}

        <Link
          href="/admin/orders"
          className="
          bg-white
          dark:bg-gray-900
          shadow-lg
          rounded-xl
          p-8
          text-center
          hover:shadow-xl
          transition
          "
        >

          <h2 className="text-2xl font-bold dark:text-white">
            🛒 Orders
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            View & manage orders
          </p>

        </Link>







        {/* Contact */}

        <Link
          href="/contact"
          className="
          bg-white
          dark:bg-gray-900
          shadow-lg
          rounded-xl
          p-8
          text-center
          hover:shadow-xl
          transition
          "
        >

          <h2 className="text-2xl font-bold dark:text-white">
            📞 Contact
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Business details
          </p>

        </Link>





      </div>


    </main>

  );

}
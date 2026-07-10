"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {

  const { cart } = useCart();


  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  return (

    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">

      {/* Logo */}

      <Link
        href="/"
        className="text-2xl font-bold text-yellow-400"
      >
        Nithesh Cosmetics
      </Link>



      {/* Menu */}

      <div className="flex items-center gap-6">


        <Link
          href="/"
          className="hover:text-yellow-400"
        >
          Home
        </Link>



        <Link
          href="/products"
          className="hover:text-yellow-400"
        >
          Products
        </Link>



        {/* Cart */}

        <Link
          href="/cart"
          className="relative hover:text-yellow-400"
        >

          🛒 Cart


          {cartCount > 0 && (

            <span
              className="
              absolute
              -top-3
              -right-3
              bg-red-600
              text-white
              text-xs
              w-6
              h-6
              rounded-full
              flex
              items-center
              justify-center
              "
            >

              {cartCount}

            </span>

          )}


        </Link>



      </div>


    </nav>

  );
}
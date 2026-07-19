"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/app/data/products";

export default function TrendingProducts() {

  const trending = products.slice(0, 6);


  return (
    <section className="px-4 mt-10">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-2xl font-bold">
          🔥 Trending Products
        </h2>


        <Link
          href="/products"
          className="text-orange-600 font-semibold"
        >
          View All →
        </Link>

      </div>



      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {trending.map((product) => (

          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="
              bg-white 
              rounded-2xl 
              shadow 
              p-4 
              hover:shadow-lg 
              transition
            "
          >

            <div className="relative h-36 w-full">

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />

            </div>


            <h3 className="mt-3 font-semibold line-clamp-2">
              {product.name}
            </h3>


            <p className="text-orange-600 font-bold mt-2">
              ₹{product.price}
            </p>


          </Link>

        ))}

      </div>

    </section>
  );
}
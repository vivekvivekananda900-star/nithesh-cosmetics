"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Shaving",
    image: "/categories/shaving.png",
    bg: "bg-blue-50",
  },
  {
    name: "Barber",
    image: "/categories/barber.png",
    bg: "bg-yellow-50",
  },
  {
    name: "Facial",
    image: "/categories/facial.png",
    bg: "bg-pink-50",
  },
  {
    name: "Cosmetics",
    image: "/categories/cosmetics.png",
    bg: "bg-purple-50",
  },
  {
    name: "Accessories",
    image: "/categories/accessories.png",
    bg: "bg-green-50",
  },
  {
    name: "Offers",
    image: "/categories/offers.png",
    bg: "bg-orange-50",
  },
  {
    name: "Perfume",
    image: "/categories/perfume.png",
    bg: "bg-red-50",
  },
  {
    name: "More",
    image: "/categories/more.png",
    bg: "bg-gray-100",
  },
];

export default function CategorySection() {
  return (
    <section className="px-4 mt-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-900">
          Shop by Category
        </h2>

        <Link
          href="/products"
          className="text-orange-500 font-semibold"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href="/products"
          >
            <div className="flex flex-col items-center">
              <div
                className={`${category.bg} w-20 h-20 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <p className="mt-3 text-sm font-semibold text-center text-gray-700">
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
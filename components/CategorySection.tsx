"use client";

import Link from "next/link";

const categories = [
  {
    name: "Shaving",
    emoji: "✂️",
    color: "bg-blue-100",
  },
  {
    name: "Barber",
    emoji: "💈",
    color: "bg-yellow-100",
  },
  {
    name: "Facial",
    emoji: "🧴",
    color: "bg-pink-100",
  },
  {
    name: "Cosmetics",
    emoji: "💄",
    color: "bg-purple-100",
  },
  {
    name: "Accessories",
    emoji: "🪮",
    color: "bg-green-100",
  },
  {
    name: "Offers",
    emoji: "🎁",
    color: "bg-orange-100",
  },
  {
    name: "Perfumes",
    emoji: "🌸",
    color: "bg-red-100",
  },
  {
    name: "More",
    emoji: "➕",
    color: "bg-gray-100",
  },
];

export default function CategorySection() {
  return (
    <section className="px-4 mt-8">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          Shop by Category
        </h2>

        <Link
          href="/products"
          className="text-yellow-600 font-semibold text-sm"
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
                className={`${category.color} w-20 h-20 rounded-3xl flex items-center justify-center shadow hover:scale-105 transition`}
              >
                <span className="text-4xl">
                  {category.emoji}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-center">
                {category.name}
              </p>

            </div>
          </Link>
        ))}

      </div>

    </section>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Mic } from "lucide-react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const value = search.trim();

    if (value) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full px-4"
    >
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-3">

        <Search
          size={20}
          className="text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 outline-none text-gray-800 placeholder:text-gray-400"
        />

        <button
          type="button"
          className="mr-2 text-gray-500 hover:text-orange-500"
        >
          <SlidersHorizontal size={20} />
        </button>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl transition"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          className="ml-2 text-gray-500 hover:text-orange-500"
        >
          <Mic size={20} />
        </button>

      </div>
    </form>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {

  const [search, setSearch] = useState("");
  const router = useRouter();


  const handleSearch = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if(search.trim()) {

      router.push(
        `/products?search=${search}`
      );

    }

  };


  return (

    <form
      onSubmit={handleSearch}
      className="w-full max-w-xl mx-auto"
    >

      <div className="flex items-center bg-white border rounded-full overflow-hidden shadow-sm">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          className="flex-1 px-5 py-3 outline-none text-black"
        />


        <button
          type="submit"
          className="bg-black text-white px-6 py-3"
        >
          Search
        </button>

      </div>

    </form>

  );
}
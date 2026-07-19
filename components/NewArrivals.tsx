"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";


export default function NewArrivals() {

  const [products,setProducts] = useState<any[]>([]);


  useEffect(()=>{

    const fetchProducts = async()=>{

      const q = query(
        collection(db,"products"),
        limit(6)
      );

      const snapshot = await getDocs(q);

      setProducts(
        snapshot.docs.map(doc=>({
          id:doc.id,
          ...doc.data()
        }))
      );

    };

    fetchProducts();

  },[]);



  return (
    <section className="px-5 py-8">

      <h2 className="text-2xl font-bold mb-5">
        New Arrivals
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

        {products.map((product)=>(
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-3"
          >

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />

            <h3 className="font-semibold mt-2">
              {product.name}
            </h3>

            <p>
              ₹{product.price}
            </p>

          </Link>
        ))}

      </div>

    </section>
  );
}
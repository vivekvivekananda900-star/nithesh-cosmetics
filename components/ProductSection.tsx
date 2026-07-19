"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/app/context/CartContext";


type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};


export default function ProductSection() {

  const [products, setProducts] = useState<Product[]>([]);

  const { addToCart } = useCart();



  useEffect(() => {

    async function fetchProducts() {

      const snapshot =
        await getDocs(
          collection(db,"products")
        );


      const data =
        snapshot.docs.map((doc)=>({
          id:doc.id,
          ...(doc.data() as Omit<Product,"id">)
        }));


      setProducts(
        data.slice(0,6)
      );

    }


    fetchProducts();

  },[]);




  return (

    <section className="px-4 mt-8 mb-24">


      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold">
          🔥 Trending Products
        </h2>


        <Link
          href="/products"
          className="text-yellow-600 font-semibold"
        >
          View All →
        </Link>

      </div>




      <div className="grid grid-cols-2 gap-4">


        {products.map((product)=>(


          <div
            key={product.id}
            className="
            bg-white 
            rounded-3xl 
            shadow 
            hover:shadow-xl 
            transition 
            overflow-hidden
            "
          >


            <Link
              href={`/products/${product.id}`}
            >

              <img
                src={product.image}
                alt={product.name}
                className="
                h-44 
                w-full 
                object-cover
                "
              />


              <div className="p-4">

                <h3 className="font-bold line-clamp-2">
                  {product.name}
                </h3>


                <div className="flex items-center mt-2">

                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="ml-1 text-sm">
                    4.8
                  </span>

                </div>


                <p className="text-green-600 text-xl font-bold mt-3">
                  ₹{product.price}
                </p>


              </div>

            </Link>



            <button
              onClick={() =>
                addToCart(product)
              }
              className="
              m-4 
              w-[calc(100%-32px)]
              bg-yellow-500 
              hover:bg-yellow-600 
              text-white 
              py-3 
              rounded-xl 
              flex 
              items-center 
              justify-center 
              gap-2
              "
            >

              <ShoppingCart size={18}/>

              Add to Cart

            </button>


          </div>


        ))}


      </div>


    </section>

  );

}
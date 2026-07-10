"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category: string;
  description?: string;
  image?: string;
}

export default function ProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { addToCart } = useCart();


  const fetchProducts = async () => {

    const snapshot = await getDocs(
      collection(db, "products")
    );


    const list: Product[] = snapshot.docs.map((doc) => {

      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        mrp: data.mrp,
        discount: data.discount,
        category: data.category,
        description: data.description,
        image: data.image,
      };

    });


    setProducts(list);

  };


  useEffect(() => {
    fetchProducts();
  }, []);



  const filteredProducts = products.filter((product)=>{

    const searchMatch =
      product.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||

      product.category
      .toLowerCase()
      .includes(search.toLowerCase());


    const categoryMatch =
      selectedCategory === "All" ||
      product.category === selectedCategory;


    return searchMatch && categoryMatch;

  });



  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-4xl font-bold text-center mb-8">
        Our Products
      </h1>



      {/* Search and Category */}

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">


        <input

          type="text"

          placeholder="🔍 Search products..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          className="border rounded-lg p-3 w-full md:w-80"

        />



        <select

          value={selectedCategory}

          onChange={(e)=>setSelectedCategory(e.target.value)}

          className="border rounded-lg p-3"

        >

          <option value="All">
            All Categories
          </option>


          {
            [...new Set(products.map(
              (p)=>p.category
            ))]
            .map((category)=>(

              <option
                key={category}
                value={category}
              >

                {category}

              </option>

            ))
          }


        </select>


      </div>




      {/* Products Grid */}


      <div className="grid md:grid-cols-3 gap-6">


        {
          filteredProducts.map((product)=>(


            <div

              key={product.id}

              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition"

            >



              <Link href={`/products/${product.id}`}>


                {
                  product.image && (

                    <img

                      src={product.image}

                      alt={product.name}

                      className="w-full h-52 object-cover rounded-lg"

                    />

                  )
                }



                <h2 className="text-2xl font-bold mt-4">

                  {product.name}

                </h2>



                <p className="text-gray-600">

                  {product.category}

                </p>



                {
                  product.description && (

                    <p className="text-sm text-gray-500 mt-2">

                      {product.description}

                    </p>

                  )
                }


              </Link>





              {
                product.mrp && (

                  <p className="text-gray-500 line-through mt-2">

                    MRP ₹{product.mrp}

                  </p>

                )
              }





              {
                product.discount && (

                  <p className="text-green-600 font-semibold">

                    Save ₹{product.discount}

                  </p>

                )
              }





              <p className="text-2xl text-yellow-600 font-bold mt-2">

                ₹{product.price}

              </p>





              <button

                onClick={()=>addToCart(product)}

                className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700"

              >

                Add to Cart 🛒

              </button>



            </div>


          ))
        }



      </div>


    </main>

  );

}
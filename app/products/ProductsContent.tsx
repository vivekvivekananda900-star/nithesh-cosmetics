"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useCart } from "@/app/context/CartContext";
import { useSearchParams } from "next/navigation";


interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category: string;
  description?: string;
  image?: string;
  rating?: number;
  deliveryFee?: number;
}


export default function ProductsContent() {

  const searchParams = useSearchParams();

  const urlSearch =
    searchParams.get("search") || "";


  const [products,setProducts] =
    useState<Product[]>([]);


  const [search,setSearch] =
    useState("");


  const [selectedCategory,setSelectedCategory] =
    useState("All");


  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();



  useEffect(()=>{

    const fetchProducts = async()=>{

      try{

        const snapshot =
          await getDocs(
            collection(db,"products")
          );


        const list:Product[] =
          snapshot.docs.map((doc)=>{

            const data = doc.data();

            return {
              id: doc.id,
              name: data.name || "",
              price: Number(data.price) || 0,
              mrp: Number(data.mrp) || 0,
              discount: Number(data.discount) || 0,
              category: data.category || "",
              description: data.description || "",
              image: data.image || "",
              rating: Number(data.rating) || 4.8,
              deliveryFee: Number(data.deliveryFee) || 0,
            };

          });


        setProducts(list);


      }catch(error){

        console.log(
          "Product error",
          error
        );

      }

    };


    fetchProducts();

  },[]);



  const filteredProducts =
    products.filter((product)=>{


      const text =
        (search || urlSearch)
        .toLowerCase();



      const searchMatch =
        product.name
        .toLowerCase()
        .includes(text)

        ||

        product.category
        .toLowerCase()
        .includes(text);



      const categoryMatch =
        selectedCategory === "All"

        ||

        product.category === selectedCategory;



      return (
        searchMatch &&
        categoryMatch
      );


    });



  return (

    <main className="min-h-screen bg-gray-100 p-4">

      <Link
        href="/"
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        🏠 Home
      </Link>


      <h1 className="text-3xl font-bold text-center my-6">
        Our Products
      </h1>



      <div className="flex flex-col md:flex-row gap-4 mb-6">


        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          className="border rounded-lg p-3 flex-1"
        />



        <select
          value={selectedCategory}
          onChange={(e)=>
            setSelectedCategory(e.target.value)
          }
          className="border rounded-lg p-3"
        >

          <option value="All">
            All Categories
          </option>


          {
            [...new Set(
              products.map(
                p=>p.category
              )
            )].map((category)=>(

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




      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">


        {
          filteredProducts.map((product)=>{


            const cartItem =
              cart.find(
                item=>item.id===product.id
              );



            return (

              <div
                key={product.id}
                className="bg-white p-3 rounded-xl shadow"
              >


                <Link href={`/products/${product.id}`}>

                  <img
                    src={
                      product.image ||
                      "/placeholder.png"
                    }
                    alt={product.name}
                    className="w-full h-32 object-contain"
                  />

                </Link>



                <h2 className="font-bold mt-2">
                  {product.name}
                </h2>


                <p>
                  ₹{product.price}
                </p>



                {
                  cartItem ?

                  <div className="flex justify-center gap-4 mt-3">

                    <button
                      onClick={()=>
                        decreaseQuantity(product.id)
                      }
                      className="bg-red-500 text-white px-3 rounded"
                    >
                      -
                    </button>


                    <span>
                      {cartItem.quantity}
                    </span>


                    <button
                      onClick={()=>
                        increaseQuantity(product.id)
                      }
                      className="bg-green-600 text-white px-3 rounded"
                    >
                      +
                    </button>


                  </div>


                  :

                  <button
                    onClick={()=>
                      addToCart(product)
                    }
                    className="w-full bg-green-600 text-white py-2 mt-3 rounded"
                  >
                    🛒 Add to Cart
                  </button>

                }



              </div>

            );


          })
        }


      </div>


    </main>

  );

}
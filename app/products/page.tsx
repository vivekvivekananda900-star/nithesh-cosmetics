"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
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

  rating?: number;

  deliveryFee?: number;

}



export default function ProductsPage() {


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


              id:doc.id,


              name:data.name || "",


              price:
                Number(data.price) || 0,


              mrp:
                Number(data.mrp) || 0,


              discount:
                Number(data.discount) || 0,


              category:
                data.category || "",


              description:
                data.description || "",


              image:
                data.image || "",


              rating:
                Number(data.rating) || 4.8,


              deliveryFee:
                Number(data.deliveryFee) || 0,


            };


          });



        setProducts(list);



      }

      catch(error){

        console.error(
          "Products loading error:",
          error
        );

      }



    };



    fetchProducts();


  },[]);







  const filteredProducts =

    products.filter((product)=>{


      const searchMatch =

        product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

        ||

        product.category
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );




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

    <main className="
      min-h-screen
      bg-gray-100
      p-4
    ">



      <Link

        href="/"

        className="
          inline-block
          bg-green-600
          text-white
          px-4
          py-2
          rounded-lg
        "

      >

        🏠 Home

      </Link>





      <h1 className="
        text-3xl
        font-bold
        text-center
        my-6
      ">

        Our Products

      </h1>





      <div className="
        flex
        flex-col
        md:flex-row
        gap-4
        mb-6
      ">



        <input

          type="text"

          placeholder="🔍 Search products..."

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }

          className="
            border
            rounded-lg
            p-3
            flex-1
          "

        />




        <select

          value={selectedCategory}

          onChange={(e)=>
            setSelectedCategory(
              e.target.value
            )
          }

          className="
            border
            rounded-lg
            p-3
          "

        >


          <option value="All">

            All Categories

          </option>



          {
            [...new Set(
              products.map(
                (p)=>p.category
              )
            )]

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





      <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-4
      ">
        {filteredProducts.map((product)=>{


          const cartItem =
            cart.find(
              (item)=>item.id === product.id
            );



          return (

            <div

              key={product.id}

              className="
                bg-white
                p-3
                rounded-xl
                shadow
                hover:shadow-lg
                transition
              "

            >




              {/* Product Image */}

              <Link
                href={`/products/${product.id}`}
              >

                <img

                  src={
                    product.image ||
                    "/placeholder.png"
                  }

                  alt={product.name}

                  className="
                    w-full
                    h-32
                    object-contain
                    rounded-lg
                    cursor-pointer
                    hover:scale-105
                    transition
                  "

                />

              </Link>






              {/* Name */}

              <Link
                href={`/products/${product.id}`}
              >

                <h2

                  className="
                    text-lg
                    font-bold
                    mt-2
                    line-clamp-2
                    hover:text-green-600
                  "

                >

                  {product.name}

                </h2>


              </Link>






              <p className="
                text-gray-600
                text-sm
              ">

                {product.category}

              </p>







              {/* Rating */}

              <div className="
                flex
                items-center
                gap-2
                mt-2
              ">


                <span className="
                  bg-green-600
                  text-white
                  text-xs
                  px-2
                  py-1
                  rounded
                ">

                  ⭐ {product.rating}

                </span>


                <span className="
                  text-xs
                  text-gray-500
                ">

                  1245 Ratings

                </span>


              </div>






              {/* Description */}

              {
                product.description && (

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                    line-clamp-2
                  ">

                    {product.description}

                  </p>

                )
              }








              {
                product.mrp && (

                  <p className="
                    text-gray-400
                    line-through
                    text-sm
                    mt-2
                  ">

                    MRP ₹{product.mrp}

                  </p>

                )
              }






              {
                product.discount && (

                  <p className="
                    text-green-600
                    text-sm
                    font-semibold
                  ">

                    Save ₹{product.discount}

                  </p>

                )
              }








              <p className="
                text-lg
                text-yellow-600
                font-bold
                mt-2
              ">

                ₹{product.price}

              </p>






              {/* Delivery Fee */}

              <p className="
                text-xs
                text-gray-600
                mt-1
              ">


                🚚

                {
                  product.deliveryFee &&
                  product.deliveryFee > 0

                  ?

                  ` Delivery ₹${product.deliveryFee}`

                  :

                  " Free Delivery"

                }


              </p>








              {
                cartItem ? (


                  <div className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    mt-3
                  ">


                    <button

                      onClick={()=>
                        decreaseQuantity(
                          product.id
                        )
                      }

                      className="
                        bg-red-500
                        text-white
                        px-3
                        py-1
                        rounded-lg
                      "

                    >

                      ➖

                    </button>




                    <span className="font-bold">

                      {cartItem.quantity}

                    </span>





                    <button

                      onClick={()=>
                        increaseQuantity(
                          product.id
                        )
                      }

                      className="
                        bg-green-600
                        text-white
                        px-3
                        py-1
                        rounded-lg
                      "

                    >

                      ➕

                    </button>


                  </div>



                )

                :

                (


                <>


                <button

                  onClick={()=>
                    addToCart(product)
                  }

                  className="
                    w-full
                    bg-green-600
                    text-white
                    py-2
                    rounded-lg
                    mt-3
                  "

                >

                  🛒 Add to Cart

                </button>





                <button

                  onClick={()=>{


                    addToCart(product);


                    setTimeout(()=>{

                      window.location.href =
                        "/checkout";

                    },200);


                  }}


                  className="
                    w-full
                    bg-yellow-500
                    text-black
                    py-2
                    rounded-lg
                    mt-2
                    font-bold
                  "

                >

                  ⚡ Buy Now

                </button>


                </>


                )

              }





            </div>

          );


        })}


      </div>







      {/* Floating Cart */}


      <Link

        href="/checkout"

        className="
          fixed
          bottom-6
          right-6
          bg-black
          text-white
          px-5
          py-3
          rounded-full
          shadow-xl
          flex
          items-center
          gap-2
          z-50
        "

      >

        🛒 Cart



        {
          cart.length > 0 && (

            <span className="
              bg-red-600
              rounded-full
              w-6
              h-6
              flex
              items-center
              justify-center
              text-xs
            ">


              {
                cart.reduce(
                  (total,item)=>
                    total + item.quantity,
                  0
                )
              }


            </span>

          )
        }


      </Link>





    </main>

  );


}
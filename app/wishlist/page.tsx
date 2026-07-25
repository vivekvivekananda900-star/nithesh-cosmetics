"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2
} from "lucide-react";

import { useCart } from "@/app/context/CartContext";

import {
  getWishlist,
  removeWishlistItem
} from "@/app/lib/wishlist";



interface WishlistItem {

  id: string;

  product_id: string;


  product: {

    id: string;

    name: string;

    price: number;

    category?: string;

    image?: string;

    images?: string[];

  } | null;

}




export default function WishlistPage() {


  const { addToCart } = useCart();


  const [loading,setLoading] =
    useState(true);


  const [wishlist,setWishlist] =
    useState<WishlistItem[]>([]);




  useEffect(()=>{

    loadWishlist();

  },[]);





  async function loadWishlist(){

    try{

      setLoading(true);


      const data =
        await getWishlist();


      setWishlist(data);


    }
    catch(error){

      console.log(error);

      setWishlist([]);

    }
    finally{

      setLoading(false);

    }

  }






  async function handleRemove(
    id:string
  ){

    await removeWishlistItem(id);


    setWishlist((prev)=>
      prev.filter(
        (item)=>item.id !== id
      )
    );

  }






  if(loading){

    return(

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      text-xl
      font-bold
      ">

        Loading Wishlist...

      </div>

    );

  }







  if(wishlist.length===0){

    return(

      <main className="
      min-h-screen
      bg-orange-50
      flex
      flex-col
      items-center
      justify-center
      px-6
      ">


        <Heart
          size={90}
          className="text-red-500 mb-6"
        />


        <h1 className="
        text-3xl
        font-bold
        ">

          Wishlist is Empty

        </h1>


        <p className="
        text-gray-500
        mt-3
        ">

          Save your favourite products here.

        </p>


        <Link
          href="/products"
          className="
          mt-8
          bg-orange-500
          text-white
          px-8
          py-3
          rounded-xl
          "
        >

          Continue Shopping

        </Link>


      </main>

    );

  }







  return (

    <main className="
    min-h-screen
    bg-orange-50
    p-4
    ">


      <div className="
      max-w-6xl
      mx-auto
      ">



        <h1 className="
        text-3xl
        font-bold
        mb-8
        ">

          ❤️ My Wishlist

        </h1>





        <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-5
        ">


        {
        wishlist.map((item)=>{


          const product =
            item.product;


          if(!product)
            return null;



          const image =
            product.images?.[0] ||
            product.image ||
            "/placeholder.png";





          return (

            <div
            key={item.id}
            className="
            bg-white
            rounded-3xl
            shadow
            overflow-hidden
            "
            >



              <Link
              href={`/products/${product.id}`}
              >


                <Image

                src={image}

                alt={product.name}

                width={400}

                height={400}

                className="
                w-full
                h-52
                object-cover
                "

                />


              </Link>






              <div className="p-4">


                <h2 className="
                font-bold
                ">

                  {product.name}

                </h2>



                <p className="
                text-gray-500
                ">

                  {product.category}

                </p>




                <p className="
                text-green-600
                text-2xl
                font-bold
                mt-2
                ">

                  ₹{product.price}

                </p>






                <button

                onClick={()=>
                  addToCart(product)
                }

                className="
                mt-4
                w-full
                bg-green-600
                text-white
                py-3
                rounded-xl
                flex
                justify-center
                gap-2
                "

                >

                  <ShoppingCart size={18}/>

                  Add To Cart

                </button>






                <button

                onClick={()=>
                  handleRemove(item.id)
                }

                className="
                mt-3
                w-full
                border
                border-red-500
                text-red-500
                py-3
                rounded-xl
                flex
                justify-center
                gap-2
                "

                >

                  <Trash2 size={18}/>

                  Remove

                </button>



              </div>


            </div>


          );


        })
        }



        </div>


      </div>


    </main>

  );

}
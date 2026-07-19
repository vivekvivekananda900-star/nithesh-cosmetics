"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";
import { useCart } from "@/app/context/CartContext";

import Link from "next/link";

import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
} from "lucide-react";


interface Product {

  id: string;

  name: string;

  price: number;

  mrp?: number;

  discount?: number;

  category?: string;

  description?: string;

  image?: string;

}




export default function ProductDetailsPage() {


  const params = useParams();

  const id = params.id as string;


  const router = useRouter();


  const { addToCart } = useCart();



  const [product, setProduct] =
    useState<Product | null>(null);



  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);



  const [loading, setLoading] =
    useState(true);




  useEffect(() => {

    if(id){

      loadProduct();

    }

  }, [id]);





  async function loadProduct() {


    try {


      const productRef =
        doc(
          db,
          "products",
          id
        );



      const productSnap =
        await getDoc(productRef);




      if(productSnap.exists()){


        const currentProduct = {

          id: productSnap.id,

          ...(productSnap.data() as Omit<Product,"id">)

        };



        setProduct(currentProduct);



        const snapshot =
          await getDocs(
            collection(
              db,
              "products"
            )
          );



        const related =
          snapshot.docs

          .map((doc)=>({

            id:doc.id,

            ...(doc.data() as Omit<Product,"id">)

          }))


          .filter(
            (item)=>

              item.category === currentProduct.category &&

              item.id !== currentProduct.id

          )


          .slice(0,4);



        setRelatedProducts(related);


      }



    } catch(error){

      console.log(
        "Product loading error:",
        error
      );


    } finally {

      setLoading(false);

    }

  }
  if (loading) {

    return (

      <div className="h-screen flex items-center justify-center text-xl font-bold">

        Loading...

      </div>

    );

  }



  if (!product) {

    return (

      <div className="h-screen flex items-center justify-center">

        Product not found

      </div>

    );

  }



  return (

    <main className="bg-gray-100 min-h-screen pb-32">


      {/* Header */}

      <div className="sticky top-0 bg-white shadow z-40 px-4 py-3 flex items-center justify-between">


        <button
          onClick={() => router.back()}
        >

          <ArrowLeft size={26}/>

        </button>



        <h1 className="font-bold text-lg">

          Product Details

        </h1>



        <Heart size={24}/>


      </div>





      {/* Product Image */}

      <div className="bg-white">


        <img

          src={
            product.image ||
            "/placeholder.png"
          }

          alt={product.name}

          className="w-full h-150 object-contain"

        />


      </div>





      {/* Product Info */}


      <div className="bg-white mt-3 p-5 rounded-t-3xl">


        <h2 className="text-3xl font-bold">

          {product.name}

        </h2>



        <p className="text-gray-500 mt-2">

          {product.category}

        </p>




        <div className="flex items-center gap-2 mt-4">


          <div className="bg-green-600 text-white px-2 py-1 rounded flex items-center">


            <Star
              size={14}
              className="fill-white mr-1"
            />

            4.8


          </div>



          <span className="text-gray-500">

            1,245 Ratings

          </span>


        </div>





        <div className="mt-5">


          <span className="text-4xl font-bold text-green-600">

            ₹{product.price}

          </span>



          {product.mrp && (

            <span className="ml-3 text-gray-500 line-through">

              ₹{product.mrp}

            </span>

          )}



        </div>





        {product.discount && (

          <p className="text-green-600 font-semibold mt-2">

            Save ₹{product.discount}

          </p>

        )}






        <div className="mt-6 border rounded-xl p-4 bg-green-50">


          <div className="flex items-center gap-2">

            <Truck/>

            Free Delivery

          </div>



          <div className="flex items-center gap-2 mt-3">

            <ShieldCheck/>

            100% Genuine Product

          </div>


        </div>







        <div className="mt-6">


          <h3 className="font-bold text-xl mb-2">

            Description

          </h3>



          <p className="text-gray-600 leading-7">

            {product.description ||
              "Premium quality cosmetic product."}

          </p>


        </div>






        {/* Related Products */}


        <div className="mt-10">


          <h3 className="text-2xl font-bold mb-4">

            Related Products

          </h3>





          <div className="grid grid-cols-2 gap-4">


            {relatedProducts.map((item)=>(


              <Link

                key={item.id}

                href={`/products/${item.id}`}

                className="bg-gray-100 rounded-2xl overflow-hidden shadow hover:shadow-lg transition"

              >


                <img

                  src={
                    item.image ||
                    "/placeholder.png"
                  }

                  alt={item.name}

                  className="w-full h-36 object-cover"

                />



                <div className="p-3">


                  <h4 className="font-semibold line-clamp-2">

                    {item.name}

                  </h4>



                  <p className="text-green-600 font-bold mt-2">

                    ₹{item.price}

                  </p>


                </div>



              </Link>


            ))}


          </div>


        </div>



      </div>







      {product.discount && (
  <p className="text-green-600 font-semibold mt-2">
    Save ₹{product.discount}
  </p>
)}

<div className="flex gap-3 mt-6">
  <button
    onClick={() => addToCart(product)}
    className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
  >
    <ShoppingCart size={20} />
    Add to Cart
  </button>

  <button
    onClick={() => {
      addToCart(product);
      router.push("/checkout");
    }}
    className="flex-1 bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-600 transition"
  >
    Buy Now
  </button>
</div>

    </main>

  );


}
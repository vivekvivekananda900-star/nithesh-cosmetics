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

  stock?: number;

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


    const data = productSnap.data();


const currentProduct = {

  id: productSnap.id,

  name: data.name || "",

  price: Number(data.price) || 0,

  mrp: Number(data.mrp) || 0,

  discount: Number(data.discount) || 0,

  category: data.category || "",

  description: data.description || "",

  image: data.image || "",

  stock: Number(data.stock) || 0,

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

  <main
  className="
    min-h-screen
    bg-gray-100
    dark:bg-gray-950
    text-gray-900
    dark:text-white
    pb-10
    transition-colors
    duration-300
  "
>


  {/* Header */}  

  <div
className="
sticky
top-0
z-40
px-4
py-3
flex
items-center
justify-between
bg-white/90
dark:bg-gray-900/90
backdrop-blur
shadow-md
transition
"
>


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





 {/* Premium Product Image */}

<div className="
  bg-white
  dark:bg-gray-800
  mt-3
  mx-3
  rounded-3xl
  shadow-lg
  overflow-hidden
  relative
">


  {/* Discount Badge */}

  {product.discount && (

    <div className="
      absolute
      top-4
      left-4
      bg-red-600
      text-white
      px-4
      py-2
      rounded-full
      text-sm
      font-bold
      z-10
    ">
      🔥 Save ₹{product.discount}
    </div>

  )}



  {/* Wishlist Icon */}

  <button
    className="
      absolute
      top-4
      right-4
      bg-white
      dark:bg-gray-700
      p-3
      rounded-full
      shadow
      z-10
    "
  >

    <Heart
      size={24}
      className="text-red-500"
    />

  </button>




  <img

    src={
      product.image ||
      "/placeholder.png"
    }

    alt={product.name}

    className="
      w-full
      h-[350px]
      md:h-[500px]
      object-contain
      p-6
      hover:scale-105
      transition
      duration-300
    "

  />



</div>  





  {/* Product Info */}  


<div
className="
bg-white
dark:bg-gray-800
mt-3
p-5
rounded-t-3xl
shadow-md
transition-all
duration-300
"
>


{/* Product Name */}

<h2 className="
  text-3xl
  font-bold
  text-gray-900
  dark:text-white
">

  {product.name}

</h2>



{/* Category */}

<p className="
  text-gray-500
  dark:text-gray-400
  mt-2
">

  {product.category}

</p>





{/* Rating + Stock */}

<div className="
  flex
  flex-wrap
  items-center
  gap-3
  mt-5
">



{/* Rating */}

<div className="
  bg-green-600
  text-white
  px-3
  py-1
  rounded-full
  flex
  items-center
  gap-1
  font-bold
">

  <Star
    size={15}
    className="fill-white"
  />

  4.8

</div>





<span className="
  text-gray-500
  dark:text-gray-400
  text-sm
">

  ⭐ 1,245 Ratings

</span>





{/* Stock Status */}

{
(product.stock ?? 0) > 0 ? (

<span className="
bg-green-100
dark:bg-green-900
text-green-700
dark:text-green-300
px-3
py-1
rounded-full
text-sm
font-semibold
">

🟢 In Stock ({product.stock})

</span>

)

:

(

<span className="
bg-red-100
dark:bg-red-900
text-red-700
dark:text-red-300
px-3
py-1
rounded-full
text-sm
font-semibold
">

🔴 Out of Stock

</span>

)

}



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






   <div
className="
mt-6
border
border-green-200
dark:border-green-800
rounded-xl
p-4
bg-green-50
dark:bg-green-950
text-gray-900
dark:text-white
"
> 


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



      <p
className="
text-gray-600
dark:text-gray-300
leading-7
"
>

        {product.description ||  
          "Premium quality cosmetic product."}  

      </p>  


    </div>  






    {/* Premium Related Products */}

<div className="mt-12">


<h3 className="
  text-2xl
  font-bold
  mb-5
  text-gray-900
  dark:text-white
">

  🛍️ Related Products

</h3>




<div className="
  grid
  grid-cols-2
  gap-4
">


{
relatedProducts.map((item)=>(


<Link

key={item.id}

href={`/products/${item.id}`}

className="
 bg-white
 dark:bg-gray-700
 rounded-2xl
 overflow-hidden
 shadow-md
 hover:shadow-xl
 transition
 duration-300
"

>



{/* Image */}

<div className="
 bg-gray-100
 dark:bg-gray-800
 p-3
">


<img

src={
 item.image ||
 "/placeholder.png"
}

alt={item.name}

className="
 w-full
 h-36
 object-contain
 rounded-xl
 hover:scale-105
 transition
 duration-300
"

/>


</div>






{/* Details */}

<div className="p-3">



<h4 className="
 font-bold
 text-sm
 line-clamp-2
 text-gray-900
 dark:text-white
">

{item.name}

</h4>





<div className="
 flex
 items-center
 justify-between
 mt-3
">


<p className="
 text-green-600
 font-bold
 text-lg
">

₹{item.price}

</p>




<span className="
 bg-green-100
 dark:bg-green-900
 text-green-700
 dark:text-green-300
 text-xs
 px-2
 py-1
 rounded-full
">

⭐ 4.8

</span>



</div>



</div>



</Link>


))
}


</div>


</div>

{/* Action Buttons */}

<div
  className="
    mt-8
    flex
    flex-col
    sm:flex-row
    gap-3
  "
>

  {/* Add To Cart */}

  <button

    disabled={(product.stock ?? 0) <= 0}

    onClick={() => addToCart(product)}

    className={`
      flex-1
      py-4
      rounded-xl
      font-bold
      flex
      items-center
      justify-center
      gap-2
      transition
      active:scale-95
      hover:shadow-lg

      ${
        (product.stock ?? 0) <= 0

        ?

        "bg-gray-400 cursor-not-allowed text-white"

        :

        "bg-green-600 hover:bg-green-700 text-white"

      }

    `}

  >

    <ShoppingCart size={20} />

    {
      (product.stock ?? 0) > 0
      ?
      "Add to Cart"
      :
      "Out of Stock"
    }

  </button>





  {/* Buy Now */}

  <button

    disabled={(product.stock ?? 0) <= 0}

    onClick={() => {

      if((product.stock ?? 0) > 0){

        addToCart(product);

        router.push("/checkout");

      }

    }}

    className={`
      flex-1
      py-4
      rounded-xl
      font-bold
      transition
      active:scale-95
      hover:shadow-lg

      ${
        (product.stock ?? 0) <= 0

        ?

        "bg-gray-400 cursor-not-allowed text-white"

        :

        "bg-yellow-500 hover:bg-yellow-600 text-black"

      }

    `}

  >

    {
      (product.stock ?? 0) > 0
      ?
      "⚡ Buy Now"
      :
      "Unavailable"
    }

  </button>


</div>


</div> 
{/* Product Info End */}



</main>

);

}
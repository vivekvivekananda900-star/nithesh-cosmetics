"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
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

  images?: string[];

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


const {data,error} = await supabase

.from("products")

.select("*");



if(error){

throw error;

}




const list:Product[] =

data.map((item)=>({


id:item.id,


name:item.name || "",


price:Number(item.price) || 0,


mrp:Number(item.mrp) || 0,


discount:Number(item.discount) || 0,


category:item.category || "",


description:item.description || "",





image:
item.images?.[0] ||
item.image ||
"",



images:item.images || [],



rating:
Number(item.rating) || 4.8,



deliveryFee:
Number(item.deliveryfee) || 0,


}));



setProducts(list);



}
catch(error){


console.log(
"Product loading error:",
error
);


}


};



fetchProducts();



},[]);








const filteredProducts = products.filter((product)=>{


const searchText =
(search || urlSearch)
.toLowerCase();



const searchMatch =

product.name
.toLowerCase()
.includes(searchText)

||

product.category
.toLowerCase()
.includes(searchText);




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

<main

className="
min-h-screen
bg-orange-50
text-gray-900
p-4
"

>



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





<h1

className="
text-3xl
font-bold
text-center
my-6
"

>

Our Products

</h1>






<div

className="
flex
flex-col
md:flex-row
gap-4
mb-6
"

>


<input

type="text"

placeholder="🔍 Search products..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

className="
flex-1
border
rounded-lg
p-3
bg-white
"

/>





<select

value={selectedCategory}

onChange={(e)=>
setSelectedCategory(e.target.value)
}

className="
border
rounded-lg
p-3
bg-white
"

>


<option value="All">

All Categories

</option>



{
[

...new Set(
products.map(
(p)=>p.category
)
)

].map((category)=>(


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







<div

className="
grid
grid-cols-2
md:grid-cols-4
gap-4
"

>


{

filteredProducts.map((product)=>{


const cartItem =
cart.find(
(item)=>item.id===product.id
);



return (


<div

key={product.id}

className="
bg-white
p-3
rounded-xl
shadow-md
"

>



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
"

/>


</Link>






<Link

href={`/products/${product.id}`}

>


<h2

className="
mt-2
font-bold
line-clamp-2
"

>

{product.name}

</h2>


</Link>






<p className="text-sm">

{product.category}

</p>






<p

className="
text-xl
font-bold
text-green-600
mt-2
"

>

₹{product.price}

</p>





{
product.discount &&

<p className="text-green-600">

Save ₹{product.discount}

</p>

}






{
cartItem ?


<div

className="
flex
justify-center
items-center
gap-4
mt-3
"

>


<button

onClick={()=>
decreaseQuantity(product.id)
}

className="
bg-red-500
text-white
px-3
py-1
rounded
"

>

➖

</button>




<span>

{cartItem.quantity}

</span>





<button

onClick={()=>
increaseQuantity(product.id)
}

className="
bg-green-600
text-white
px-3
py-1
rounded
"

>

➕

</button>



</div>



:


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

🛒 Add To Cart

</button>




<button

onClick={()=>{

addToCart(product);

window.location.href="/checkout";

}}

className="
w-full
bg-yellow-500
py-2
rounded-lg
mt-2
font-bold
"

>

⚡ Buy Now

</button>



</>


}



</div>


);


})


}



</div>



</main>

);


}
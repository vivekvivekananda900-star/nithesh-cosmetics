"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";


interface Product {

  id:string;

  name:string;

  image?:string;

  price:number;

}


interface Arrival {

  id:string;

  productId:string;

  product?:Product;

}



export default function NewArrivalsAdmin(){


const [products,setProducts] =
useState<Product[]>([]);


const [arrivals,setArrivals] =
useState<Arrival[]>([]);


const [selectedProduct,setSelectedProduct] =
useState("");





const loadProducts = async()=>{


const snapshot =
await getDocs(
collection(db,"products")
);


setProducts(

snapshot.docs.map((item)=>({

id:item.id,

...(item.data() as Omit<Product,"id">)

}))

);


};






const loadArrivals = async()=>{


const snapshot =
await getDocs(
collection(db,"newArrivals")
);



const list:Arrival[]=[];



for(const item of snapshot.docs){


const data=item.data();



const productSnap =
await getDoc(

doc(
db,
"products",
data.productId
)

);



if(productSnap.exists()){


list.push({

id:item.id,

productId:data.productId,

product:{

id:productSnap.id,

...(productSnap.data() as Omit<Product,"id">)

}

});


}


}



setArrivals(list);


};






useEffect(()=>{

loadProducts();

loadArrivals();

},[]);







const addArrival = async()=>{


if(!selectedProduct)
return;



await addDoc(

collection(db,"newArrivals"),

{

productId:selectedProduct,

active:true

}

);



setSelectedProduct("");

loadArrivals();


};







const deleteArrival = async(id:string)=>{


await deleteDoc(

doc(
db,
"newArrivals",
id
)

);



loadArrivals();


};








return (

<main
className="
min-h-screen
bg-gray-100
dark:bg-gray-950
p-6
"
>


<h1
className="
text-3xl
font-bold
mb-8
dark:text-white
"
>

⭐ New Arrivals Management

</h1>







<div
className="
bg-white
dark:bg-gray-900
p-6
rounded-xl
shadow
max-w-xl
"
>


<select

value={selectedProduct}

onChange={(e)=>setSelectedProduct(e.target.value)}

className="
w-full
border
p-3
rounded
mb-4
"

>


<option value="">
Select Product
</option>



{

products.map((product)=>(

<option

key={product.id}

value={product.id}

>

{product.name}

</option>

))

}


</select>






<button

onClick={addArrival}

className="
bg-green-600
text-white
px-6
py-3
rounded-lg
font-bold
"

>

➕ Add New Arrival

</button>


</div>








<div
className="
mt-8
grid
md:grid-cols-3
gap-5
"
>


{

arrivals.map((item)=>(


<div

key={item.id}

className="
bg-white
dark:bg-gray-900
rounded-xl
shadow
overflow-hidden
"

>


<img

src={
item.product?.image ||
"/placeholder.png"
}

className="
w-full
h-40
object-contain
bg-gray-100
"

/>





<div className="p-4">


<h2 className="
font-bold
dark:text-white
">

{item.product?.name}

</h2>



<p className="
text-green-600
font-bold
mt-2
">

₹{item.product?.price}

</p>





<button

onClick={()=>deleteArrival(item.id)}

className="
mt-4
bg-red-600
text-white
px-4
py-2
rounded
w-full
"

>

Remove

</button>


</div>


</div>


))

}


</div>




</main>

);


}
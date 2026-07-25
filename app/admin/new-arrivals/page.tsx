"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


interface Product {

  id:string;

  name:string;

  image?:string;

  price:number;

}


interface Arrival {

  id:string;

  product_id:string;

  product?:Product;

}





export default function NewArrivalsAdmin(){


const router = useRouter();



const [products,setProducts] =
useState<Product[]>([]);



const [arrivals,setArrivals] =
useState<Arrival[]>([]);



const [selectedProduct,setSelectedProduct] =
useState("");



const [loading,setLoading] =
useState(true);







useEffect(()=>{

checkAdmin();

},[]);









async function checkAdmin(){


const {
 data:{
  user
 }
}=await supabase.auth.getUser();




if(!user){

router.push("/login");

return;

}




const {data:profile}=await supabase

.from("profiles")

.select("role")

.eq("uuid",user.id)

.maybeSingle();





if(profile?.role !== "admin"){

router.push("/");

return;

}



loadProducts();

loadArrivals();


}










async function loadProducts(){



const {
data,
error
}=await supabase

.from("products")

.select("*");





if(error){

console.log(error);

return;

}




setProducts(data || []);



}











async function loadArrivals(){



const {
data,
error
}=await supabase

.from("new_arrivals")

.select(`
id,
product_id,
products(
id,
name,
image,
price
)
`)

.order(
"created_at",
{
ascending:false
}
);





if(error){

console.log(error);

return;

}




const formatted =
data?.map((item:any)=>({

id:item.id,

product_id:item.product_id,

product:item.products


})) || [];





setArrivals(formatted);



setLoading(false);


}









async function addArrival(){



if(!selectedProduct){

alert("Select product");

return;

}





const {
error
}=await supabase

.from("new_arrivals")

.insert({

product_id:selectedProduct,

active:true

});






if(error){

alert(error.message);

return;

}





setSelectedProduct("");

loadArrivals();



}









async function deleteArrival(
id:string
){



await supabase

.from("new_arrivals")

.delete()

.eq(
"id",
id
);




loadArrivals();


}








if(loading){

return(

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
">

Loading...

</div>

);

}








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

onChange={(e)=>
setSelectedProduct(e.target.value)
}

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

onClick={()=>
deleteArrival(item.id)
}

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
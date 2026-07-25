"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


interface Product {

  id:string;

  name:string;

  price:number;

  mrp?:number;

  discount?:number;

  category:string;

  description?:string;

  image?:string;

}




export default function AdminProducts(){


const router = useRouter();


const [products,setProducts] =
useState<Product[]>([]);


const [search,setSearch] =
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
.eq("id",user.id)
.single();





if(profile?.role !== "admin"){

router.push("/");

return;

}



fetchProducts();


}









async function fetchProducts(){


const {
data,
error
}=await supabase

.from("products")

.select("*")

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



setProducts(data || []);

setLoading(false);



}









const filteredProducts =
products.filter((product)=>

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
)

);









async function deleteProduct(
id:string
){


const ok =
confirm(
"Delete this product?"
);



if(!ok)
return;





const {
error
}=await supabase

.from("products")

.delete()

.eq(
"id",
id
);






if(error){

alert(error.message);

return;

}





alert(
"✅ Product Deleted Successfully"
);



fetchProducts();



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

<main className="
min-h-screen
bg-gray-100
p-8
">



<div className="
flex
justify-between
items-center
mb-8
">



<h1 className="
text-4xl
font-bold
">

Manage Products

</h1>





<Link

href="/admin/add-product"

className="
bg-green-600
text-white
px-5
py-3
rounded-lg
hover:bg-green-700
"

>

➕ Add Product

</Link>




</div>







<input

type="text"

placeholder="🔍 Search Product..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

className="
w-full
border
p-3
rounded-lg
mb-6
"

/>







<div className="
overflow-x-auto
">



<table className="
w-full
bg-white
rounded-xl
shadow-lg
">



<thead className="
bg-black
text-white
">



<tr>

<th className="p-4">
Image
</th>


<th className="p-4">
Name
</th>


<th className="p-4">
Category
</th>


<th className="p-4">
Price
</th>


<th className="p-4">
Actions
</th>


</tr>



</thead>






<tbody>


{

filteredProducts.map((product)=>(


<tr

key={product.id}

className="
border-b
hover:bg-gray-50
"

>



<td className="p-4">


{

product.image ? (

<img

src={product.image}

alt={product.name}

className="
w-16
h-16
object-cover
rounded-lg
"

/>


)

:

(

<span className="
text-gray-400
">

No Image

</span>

)

}



</td>







<td className="
p-4
font-semibold
">

{product.name}

</td>







<td className="p-4">

{product.category}

</td>







<td className="p-4">

₹{product.price}

</td>







<td className="p-4">


<div className="
flex
gap-2
">



<Link

href={`/admin/edit-product/${product.id}`}

className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
hover:bg-blue-700
"

>

✏️ Edit

</Link>







<button

onClick={()=>
deleteProduct(product.id)
}

className="
bg-red-600
text-white
px-4
py-2
rounded-lg
hover:bg-red-700
"

>

🗑 Delete

</button>




</div>



</td>





</tr>



))


}



</tbody>



</table>



</div>







{

filteredProducts.length === 0 && (

<div className="
text-center
mt-10
text-gray-500
text-lg
">

No products found.

</div>

)

}




</main>

);


}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


interface Product {

  name:string;

  price:number;

  quantity:number;

}



interface Order {

  id:string;

  customer_name?:string;

  phone?:string;

  address?:string;

  products?:Product[];

  total?:number;

  status?:string;

  location?:string;

}







export default function OrdersPage(){


const router = useRouter();


const [orders,setOrders] =
useState<Order[]>([]);


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




fetchOrders();



}










async function fetchOrders(){


const {
data,
error
}=await supabase

.from("orders")

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





setOrders(
(data || []) as Order[]
);



setLoading(false);


}









async function updateOrder(

id:string,

status:string,

location:string

){



const {
error
}=await supabase

.from("orders")

.update({

status,

location,

updated_at:new Date()

})

.eq(
"id",
id
);






if(error){

alert(error.message);

return;

}





alert(
"Order Updated ✅"
);



fetchOrders();



}









if(loading){

return(

<div className="
min-h-screen
flex
items-center
justify-center
font-bold
text-xl
">

Loading Orders...

</div>

);

}








return (

<div className="
max-w-6xl
mx-auto
p-6
">





<h1 className="
text-4xl
font-bold
mb-8
">

Admin Orders 📦

</h1>







{

orders.length === 0 ? (


<p className="
text-gray-500
">

No Orders Found

</p>



)

:

(


orders.map((order)=>(


<div

key={order.id}

className="
border
rounded-xl
p-6
mb-6
shadow
bg-white
"

>




<h2 className="
text-2xl
font-bold
">

{order.customer_name || "Unknown Customer"}

</h2>




<p>
📱 {order.phone || "No Phone"}
</p>



<p>
📍 {order.address || "No Address"}
</p>








<h3 className="
font-bold
mt-5
">

Products

</h3>







{

order.products?.length ? (


order.products.map(
(item,index)=>(


<p key={index}>

{item.name}

{" × "}

{item.quantity}

{" = ₹"}

{item.price * item.quantity}


</p>



)


)


)

:(


<p className="
text-gray-500
">

No products found

</p>


)



}







<h2 className="
text-xl
font-bold
mt-4
">

Total: ₹{order.total || 0}

</h2>









<div className="
mt-5
flex
gap-3
items-center
flex-wrap
">





<select

id={`status-${order.id}`}

defaultValue={
order.status || "Pending"
}

className="
border
p-2
rounded
"

>


<option>
Pending
</option>


<option>
Confirmed
</option>


<option>
Shipped
</option>


<option>
Out for Delivery
</option>


<option>
Delivered
</option>


</select>







<input

id={`location-${order.id}`}

defaultValue={
order.location || ""
}

placeholder="Delivery Location"

className="
border
p-2
rounded
"

/>








<button

onClick={()=>{


const status =
(
document.getElementById(
`status-${order.id}`
) as HTMLSelectElement
).value;



const location =
(
document.getElementById(
`location-${order.id}`
) as HTMLInputElement
).value;




updateOrder(
order.id,
status,
location
);



}}


className="
bg-black
text-white
px-5
py-2
rounded-lg
"

>

Update

</button>





</div>






</div>



))


)


}



</div>


);


}
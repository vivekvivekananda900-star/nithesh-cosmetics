"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";

import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";


interface Product {
  name: string;
  price: number;
  quantity: number;
}


interface Order {
  id: string;

  customerName?: string;

  phone?: string;

  address?: string;

  products?: Product[];

  total?: number;

  status?: string;

  location?: string;
}



export default function OrdersPage() {


  const [orders, setOrders] =
    useState<Order[]>([]);



  const fetchOrders = async () => {

    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );


    const snapshot =
      await getDocs(q);



    const data =
      snapshot.docs.map((item)=>({

        id:item.id,

        ...(item.data() as Omit<Order,"id">),

      }));


    setOrders(data);

  };




  useEffect(()=>{

    fetchOrders();

  },[]);





  const updateOrder = async(
    id:string,
    status:string,
    location:string
  )=>{


    await updateDoc(

      doc(db,"orders",id),

      {
        status,
        location,
        updatedAt:Timestamp.now()
      }

    );


    fetchOrders();

  };
return (
  <AdminGuard>

    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-8">
        Admin Orders 📦
      </h1>


      {orders.map((order)=>(

        <div
          key={order.id}
          className="border rounded-xl p-6 mb-6 shadow"
        >

          <h2 className="text-2xl font-bold">
            {order.customerName || "Unknown Customer"}
          </h2>


          <p>
            📱 {order.phone || "No Phone"}
          </p>


          <p>
            📍 {order.address || "No Address"}
          </p>



          <h3 className="font-bold mt-5">
            Products
          </h3>


          {order.products &&
          order.products.length > 0 ? (

            order.products.map(
              (item,index)=>(

                <p key={index}>

                  {item.name}
                  {" x "}
                  {item.quantity}
                  {" = "}
                  ₹
                  {item.price * item.quantity}

                </p>

              )

            )

          ) : (

            <p className="text-gray-500">
              No products found
            </p>

          )}



          <h2 className="text-xl font-bold mt-4">
            Total: ₹{order.total || 0}
          </h2>



          <div className="mt-5">

            <label className="font-bold">
              Order Status:
            </label>


            <select
              id={`status-${order.id}`}
              defaultValue={order.status || "Pending"}
              className="ml-3 border p-2 rounded"
            >

              <option>Pending</option>
              <option>Confirmed</option>
              <option>Shipped</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>

            </select>

          </div>



          <div className="mt-4">

            <label className="font-bold">
              🚚 Delivery Location:
            </label>


            <input
              id={`location-${order.id}`}
              defaultValue={order.location || ""}
              placeholder="Example: Hyderabad Hub"
              className="ml-3 border p-2 rounded"
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

              className="ml-3 bg-black text-white px-5 py-2 rounded"

            >

              Update

            </button>


          </div>


        </div>

      ))}


    </div>

  </AdminGuard>
);

}
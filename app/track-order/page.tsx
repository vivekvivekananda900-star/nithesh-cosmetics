"use client";

import { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";


interface Product {
  name: string;
  price: number;
  quantity: number;
}


interface Order {

  customerName?: string;

  phone?: string;

  address?: string;

  total?: number;

  status?: string;

  location?: string;

  products?: Product[];

}



export default function TrackOrderPage() {


  const [orderId,setOrderId] =
    useState("");

  const [order,setOrder] =
    useState<Order | null>(null);

  const [loading,setLoading] =
    useState(false);

  const [error,setError] =
    useState("");




  const trackOrder = ()=>{


    if(!orderId.trim()){

      setError("Please enter Order ID");

      return;

    }



    setLoading(true);

    setError("");



    const docRef =
      doc(
        db,
        "orders",
        orderId.trim()
      );




    onSnapshot(
      docRef,
      (docSnap)=>{


        if(docSnap.exists()){


          setOrder(
            docSnap.data() as Order
          );


          setLoading(false);


        }
        else{


          setOrder(null);

          setError(
            "Order not found"
          );

          setLoading(false);


        }


      }
    );


  };







  const steps = [

    "Pending",

    "Confirmed",

    "Shipped",

    "Out for Delivery",

    "Delivered"

  ];






  return (

    <main className="min-h-screen bg-gray-100 flex justify-center p-6">


      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">


        <h1 className="text-3xl font-bold text-center mb-6">

          📦 Track Your Order

        </h1>





        <input

          type="text"

          placeholder="Enter Order ID"

          value={orderId}

          onChange={(e)=>
            setOrderId(e.target.value)
          }

          className="w-full border rounded-lg p-3 mb-4"

        />





        <button

          onClick={trackOrder}

          className="w-full bg-green-600 text-white py-3 rounded-lg"

        >

          {loading
          ? "Tracking..."
          : "Track Order"}

        </button>







        {error && (

          <p className="text-red-600 mt-4 text-center">

            {error}

          </p>

        )}







        {order && (

          <div className="mt-6 bg-gray-50 border rounded-lg p-4">



            <h2 className="text-xl font-bold mb-4">

              📋 Order Details

            </h2>





            <p>
              👤 {order.customerName}
            </p>


            <p>
              📱 {order.phone}
            </p>


            <p>
              📍 {order.address}
            </p>


            <p className="mt-2 font-bold">

              Total: ₹{order.total || 0}

            </p>







            <h3 className="font-bold mt-5">

              🛒 Products

            </h3>




            {order.products?.map(
              (item,index)=>(

                <p key={index}>

                  {item.name}
                  {" x "}
                  {item.quantity}

                </p>

              )
            )}









            <div className="mt-6 border-t pt-4">


              <h3 className="text-lg font-bold text-center mb-4">

                🚚 Order Tracking

              </h3>






              {steps.map((step,index)=>{


                const current =
                steps.indexOf(
                  order.status || "Pending"
                );



                return (

                <div
                key={step}
                className={`p-3 mb-2 rounded-lg text-center font-bold
                ${
                  index <= current
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-500"
                }`}
                >

                {index <= current
                ? "✅"
                : "⚪"}

                {" "}
                {step}

                </div>

                );


              })}





            </div>








            <div className="mt-5 bg-blue-100 p-3 rounded-lg text-center">

              📍 Current Location:

              <br/>

              <b>
                {order.location || "Not updated"}
              </b>


            </div>





          </div>

        )}



      </div>


    </main>

  );

}
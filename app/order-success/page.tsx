"use client";

import { useSearchParams } from "next/navigation";
import { generateInvoice } from "@/app/utils/generateInvoice";


export default function OrderSuccessPage() {


  const searchParams =
    useSearchParams();


  const orderId =
    searchParams.get("orderId") || "";



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">


      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">


        <h1 className="text-3xl font-bold text-green-600">

          Order Placed Successfully 🎉

        </h1>



        <p className="mt-4 text-gray-700">

          Thank you for your order.

        </p>




        <div className="mt-5 border rounded-lg p-4">

          <p className="font-bold">

            Order ID

          </p>


          <p className="break-all">

            {orderId}

          </p>


        </div>






        <p className="mt-5">

          Your invoice has been generated.

        </p>






        <button

          onClick={() => window.print()}

          className="mt-6 bg-black text-white px-6 py-3 rounded-lg"

        >

          Print Invoice 🧾

        </button>




        <a

          href="/"

          className="block mt-4 text-blue-600"

        >

          Continue Shopping 🛒

        </a>



      </div>



    </div>

  );

}
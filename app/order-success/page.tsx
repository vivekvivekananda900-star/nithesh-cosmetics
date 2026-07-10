"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


function OrderSuccessContent() {

  const searchParams = useSearchParams();

  const orderId =
    searchParams.get("orderId") || "";


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">


        <div className="text-6xl mb-4">
          🎉
        </div>


        <h1 className="text-3xl font-bold text-green-600">
          Order Placed Successfully
        </h1>


        <p className="mt-4 text-gray-600">
          Thank you for shopping with Nithesh Cosmetics.
        </p>


        <div className="mt-6 border rounded-lg p-4 bg-gray-50">

          <p className="font-bold">
            Order ID
          </p>

          <p className="break-all text-sm mt-2">
            {orderId}
          </p>

        </div>


        <p className="mt-5 text-gray-700">
          Your invoice PDF has been generated 🧾
        </p>


        <button
          onClick={() => window.print()}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg w-full"
        >
          Print / Save Invoice 🧾
        </button>


        <Link
          href="/"
          className="block mt-5 text-blue-600"
        >
          Continue Shopping 🛒
        </Link>


      </div>

    </div>

  );
}



export default function OrderSuccessPage() {

  return (

    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >

      <OrderSuccessContent />

    </Suspense>

  );

}
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";


export default function MyOrdersPage() {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {

        if (user) {
          fetchOrders(user.uid);
        } else {
          setLoading(false);
        }

      }
    );


    return () => unsubscribe();

  }, []);





  const fetchOrders = async (uid:string) => {

    try {

      const q = query(

        collection(db,"orders"),

        where(
          "userId",
          "==",
          uid
        ),

        orderBy(
          "createdAt",
          "desc"
        )

      );


      const snapshot =
        await getDocs(q);



      const data =
        snapshot.docs.map((doc)=>({

          id: doc.id,

          ...doc.data()

        }));



      setOrders(data);



    } catch(error) {

      console.log(
        "Orders error:",
        error
      );

    }


    setLoading(false);

  };






  if(loading){

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h2 className="text-xl font-bold">
          Loading Orders...
        </h2>

      </div>

    );

  }






  return (

    <main className="min-h-screen bg-gray-100 p-5">


      <h1 className="text-3xl font-bold mb-6">

        📦 My Orders

      </h1>





      {
        orders.length === 0 ? (

          <div className="bg-white rounded-xl p-6 shadow">

            <p className="text-gray-500">

              No orders found.

            </p>

          </div>


        ) : (


          orders.map((order)=> (

            <div

              key={order.id}

              className="bg-white rounded-xl shadow p-5 mb-5"

            >


              <h2 className="font-bold">

                Order ID:
                <span className="text-sm ml-2">
                  {order.id}
                </span>

              </h2>



              <p className="mt-2">

                Status:

                <span
                  className={`
                  ml-2 font-bold
                  ${
                    order.status === "Delivered"
                    ? "text-green-600"
                    :
                    order.status === "Shipped"
                    ? "text-blue-600"
                    :
                    "text-orange-600"
                  }
                  `}
                >

                  {order.status}

                </span>

              </p>




              <p className="mt-2 font-semibold">

                Total: ₹{order.total}

              </p>




              <h3 className="font-bold mt-4">

                Products

              </h3>



              {
                (order.products || order.items || [])
                .map(
                  (item:any,index:number)=> (

                  <div
                    key={index}
                    className="border-b py-2"
                  >

                    {item.name}

                    {" × "}

                    {item.quantity || item.qty || 1}


                    <span className="ml-2">

                      ₹
                      {
                        item.price *
                        (item.quantity || item.qty || 1)
                      }

                    </span>


                  </div>

                ))

              }



            </div>

          ))

        )
      }


    </main>

  );

}
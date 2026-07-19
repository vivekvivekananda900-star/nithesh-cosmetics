"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";

import {
  collection,
  getDocs,
  query,
  where,
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

          setOrders([]);
          setLoading(false);

        }

      }
    );


    return () => unsubscribe();

  }, []);






  const fetchOrders = async (uid: string) => {

    try {

      const q = query(

        collection(db, "orders"),

        where(
          "userId",
          "==",
          uid
        )

      );



      const snapshot =
        await getDocs(q);



      const data: any[] =
        snapshot.docs.map((doc) => ({

          id: doc.id,

          ...doc.data(),

        }));



      setOrders(data);



    } catch(error) {

      console.log(
        "Orders Error:",
        error
      );

    }


    setLoading(false);

  };







  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-xl
        font-bold
      ">

        Loading Orders...

      </div>

    );

  }







  return (

    <main className="
      min-h-screen
      bg-gray-100
      p-5
    ">


      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">

        📦 My Orders

      </h1>





      {
        orders.length === 0 ? (

          <div className="
            bg-white
            p-6
            rounded-xl
            shadow
          ">

            <p className="text-gray-500">

              No orders found.

            </p>

          </div>


        ) : (


          orders.map((order) => (


            <div

              key={order.id}

              className="
                bg-white
                rounded-xl
                shadow
                p-5
                mb-5
              "

            >


              <h2 className="font-bold">

                Order ID:

                <span className="
                  text-sm
                  ml-2
                  text-gray-600
                ">

                  {order.id}

                </span>

              </h2>





              <p className="mt-3">

                Status:

                <span className="
                  ml-2
                  font-bold
                  text-orange-600
                ">

                  {order.status || "Pending"}

                </span>

              </p>





              <p className="
                mt-2
                font-bold
              ">

                Total:
                ₹{order.total}

              </p>





              <p className="mt-2">

                Delivery Address:

                <span className="ml-2 text-gray-600">

                  {order.address}

                </span>

              </p>





              <h3 className="
                font-bold
                mt-5
                mb-2
              ">

                Products

              </h3>





              {
                (order.products || []).map(
                  (item:any, index:number) => (

                    <div

                      key={index}

                      className="
                        border-b
                        py-2
                        flex
                        justify-between
                      "

                    >

                      <span>

                        {item.name}

                        <br />

                        Qty:
                        {item.quantity || 1}

                      </span>



                      <span className="font-bold">

                        ₹
                        {
                          item.price *
                          (item.quantity || 1)
                        }

                      </span>


                    </div>

                  )
                )

              }





            </div>


          ))


        )

      }



    </main>

  );

}
"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

import { generateInvoice } from "@/app/utils/generateInvoice";


export default function CheckoutPage() {


  const {
    cart,
    clearCart,
  } = useCart();


  const router = useRouter();


  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");




  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );





  const placeOrder = async () => {


    if (
      !name ||
      !phone ||
      !address
    ) {

      alert(
        "Please fill all details"
      );

      return;

    }



    if (cart.length === 0) {

      alert(
        "Your cart is empty"
      );

      return;

    }




    try {


      const orderRef =
        await addDoc(
          collection(
            db,
            "orders"
          ),
          {

            customerName:name,

            phone:phone,

            address:address,

            products:cart,

            total:total,

            status:"Pending",

            createdAt:
              Timestamp.now(),

          }
        );




      // Generate Invoice

      try {

        generateInvoice(

          orderRef.id,

          {
            name,
            phone,
            address,
          },

          cart,

          total

        );

      } catch(error) {

        console.log(
          "Invoice Error",
          error
        );

      }





      let message =
`🛒 *Nithesh Cosmetics Order*

🧾 Order ID:
${orderRef.id}

👤 Name:
${name}

📱 Phone:
${phone}

📍 Address:
${address}

📦 Products:
`;





      cart.forEach((item)=>{


        message +=
`
${item.name}

Quantity:
${item.quantity}

Price:
₹${item.price}

`;

      });





      message +=
`
💰 Total:
₹${total}

Thank you 🙏`;





      const whatsappNumber =
        "919676578296";





      const whatsappURL =
`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;





      window.open(
        whatsappURL,
        "_blank"
      );





      clearCart();



      router.push(
        `/order-success?orderId=${orderRef.id}`
      );




    } catch(error) {


      console.log(error);


      alert(
        "Order failed. Try again."
      );


    }


  };






  return (

    <div className="max-w-6xl mx-auto p-6">


      <h1 className="text-4xl font-bold mb-8">
        Checkout 🛒
      </h1>





      <div className="grid md:grid-cols-2 gap-8">


        <div className="space-y-5">


          <input

            type="text"

            placeholder="Full Name"

            value={name}

            onChange={(e)=>
              setName(e.target.value)
            }

            className="w-full border p-3 rounded-lg"

          />



          <input

            type="tel"

            placeholder="Phone Number"

            value={phone}

            onChange={(e)=>
              setPhone(e.target.value)
            }

            className="w-full border p-3 rounded-lg"

          />



          <textarea

            placeholder="Delivery Address"

            value={address}

            onChange={(e)=>
              setAddress(e.target.value)
            }

            className="w-full border p-3 rounded-lg h-32"

          />


        </div>






        <div className="border rounded-xl p-6">


          <h2 className="text-2xl font-bold mb-5">
            Order Summary
          </h2>





          {cart.map((item)=>(


            <div

              key={item.id}

              className="flex justify-between border-b py-3"

            >


              <div>

                <h3 className="font-semibold">
                  {item.name}
                </h3>


                <p>
                  Qty: {item.quantity}
                </p>


              </div>




              <p className="font-bold">

                ₹
                {item.price *
                item.quantity}

              </p>



            </div>


          ))}






          <h2 className="text-3xl font-bold mt-6">

            Total:
            ₹{total}

          </h2>






          <button

            onClick={placeOrder}

            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"

          >

            Place Order 📲

          </button>




        </div>


      </div>


    </div>

  );


}
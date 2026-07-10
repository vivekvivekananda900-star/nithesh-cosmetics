"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";


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






  const placeOrder = () => {


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






    let message =
`🛒 *Nithesh Cosmetics Order*

👤 Name: ${name}

📱 Phone: ${phone}

📍 Address:
${address}

📦 Products:
`;




    cart.forEach((item) => {

      message +=
`
${item.name}
Quantity: ${item.quantity}
Price: ₹${item.price}
`;

    });





    message +=
`
💰 Total Amount: ₹${total}
`;



    const whatsappNumber =
      "9676578296";



    const url =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;



    window.open(
      url,
      "_blank"
    );



    clearCart();


    router.push("/");

  };






  return (

    <div className="max-w-5xl mx-auto p-6">


      <h1 className="text-4xl font-bold mb-8">

        Checkout 🛒

      </h1>





      <div className="grid md:grid-cols-2 gap-8">



        <div className="space-y-4">


          <input

            type="text"

            placeholder="Full Name"

            value={name}

            onChange={(e) =>
              setName(e.target.value)
            }

            className="w-full border p-3 rounded-lg"

          />





          <input

            type="tel"

            placeholder="Phone Number"

            value={phone}

            onChange={(e) =>
              setPhone(e.target.value)
            }

            className="w-full border p-3 rounded-lg"

          />





          <textarea

            placeholder="Delivery Address"

            value={address}

            onChange={(e) =>
              setAddress(e.target.value)
            }

            className="w-full border p-3 rounded-lg h-32"

          />



        </div>
        <div className="border rounded-xl p-6">


          <h2 className="text-2xl font-bold mb-5">
            Order Summary
          </h2>




          {cart.length === 0 ? (

            <p>
              Your cart is empty
            </p>

          ) : (

            cart.map((item) => (

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
                  ₹{item.price * item.quantity}
                </p>


              </div>

            ))

          )}





          <div className="mt-6 border-t pt-4">

            <h3 className="text-2xl font-bold">
              Total: ₹{total}
            </h3>


          </div>






          <button

            onClick={placeOrder}

            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"

          >

            Place Order on WhatsApp 📲

          </button>



        </div>



      </div>


    </div>

  );


}
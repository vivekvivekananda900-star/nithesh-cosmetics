"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/app/lib/supabase";
import { useCart } from "@/app/context/CartContext";
import { generateInvoice } from "@/app/lib/generateInvoice";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  deliveryFee?: number;
}

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");


  const productTotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );


  const deliveryFee = cart.reduce(
    (sum, item) =>
      sum + (item.deliveryFee || 0) * item.quantity,
    0
  );


  const total = productTotal + deliveryFee;


  useEffect(() => {
    loadProfile();
  }, []);


  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
      router.push("/login");
      return;
    }


    const { data, error } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("uuid", user.id)
        .single();


    if (error) {
      console.log(error);
      return;
    }


    setName(data.name || "");
    setPhone(data.phone || "");
    setAddress(data.address || "");

  }



  function getCurrentLocation() {

    if (!navigator.geolocation) {

      alert("Location not supported");
      return;

    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;


        setAddress(
          `https://maps.google.com/?q=${lat},${lng}`
        );

      },


      () => {

        alert(
          "Please allow location permission."
        );

      }

    );

  }



  async function placeOrder() {

    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {

      alert("Please fill all details.");
      return;

    }


    if (cart.length === 0) {

      alert("Your cart is empty.");
      return;

    }


    setLoading(true);


    try {


      const {
        data: { user },
      } = await supabase.auth.getUser();



      if (!user) {

        alert("Please login first.");
        router.push("/login");
        return;

      }



      const { data, error } =
        await supabase
          .from("orders")
          .insert([
            {

              user_id: user.id,

              customer_name: name,

              phone,

              address,

              products: cart,

              product_total: productTotal,

              delivery_fee: deliveryFee,

              total,

              payment_method: paymentMethod,

              payment_status: "Pending",

              status: "Pending",

            },

          ])
          .select()
          .single();



      if (error) {

        console.log(error);

        alert(error.message);

        return;

      }



      generateInvoice(

        data.id,

        {
          name,
          phone,
          address,
        },

        cart,

        productTotal,

        deliveryFee,

        total

      );



      let message =
`🛍️ *Nithesh Cosmetics*

🆔 Order ID: ${data.id}

👤 Name: ${name}

📞 Phone: ${phone}

📍 Address:
${address}

----------------------

`;


      cart.forEach((item) => {

        message +=
`${item.name}

Qty : ${item.quantity}

Price : ₹${item.price}

----------------------

`;

      });
      message +=
`Product Total : ₹${productTotal}

Delivery Fee : ₹${deliveryFee}

Grand Total : ₹${total}

Payment : ${paymentMethod}

Thank You ❤️`;


      const whatsappURL =
        `https://wa.me/919676578296?text=${encodeURIComponent(
          message
        )}`;


      window.open(
        whatsappURL,
        "_blank"
      );


      clearCart();


      router.push(
        `/order-success?orderId=${data.id}`
      );


    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong while placing order."
      );


    } finally {

      setLoading(false);

    }

  }



  return (

    <main className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">


        <h1 className="text-4xl font-bold mb-8 text-center">
          Checkout 🛒
        </h1>



        <div className="grid lg:grid-cols-2 gap-8">



          {/* Customer Details */}

          <div className="bg-white rounded-2xl shadow-lg p-6">


            <h2 className="text-2xl font-bold mb-6">
              Customer Details
            </h2>



            <input

              className="w-full border rounded-lg p-3 mb-4"

              placeholder="Full Name"

              value={name}

              onChange={(e)=>setName(e.target.value)}

            />



            <input

              className="w-full border rounded-lg p-3 mb-4"

              placeholder="Phone Number"

              value={phone}

              onChange={(e)=>setPhone(e.target.value)}

            />



            <textarea

              className="w-full border rounded-lg p-3 h-32 mb-4"

              placeholder="Delivery Address"

              value={address}

              onChange={(e)=>setAddress(e.target.value)}

            />



            <button

              onClick={getCurrentLocation}

              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold"

            >

              📍 Use Current Location

            </button>




            <h2 className="text-xl font-bold mt-8 mb-4">

              Payment Method

            </h2>




            <select

              value={paymentMethod}

              onChange={(e)=>setPaymentMethod(e.target.value)}

              className="w-full border rounded-lg p-3"

            >

              <option>
                Cash on Delivery
              </option>

              <option>
                UPI
              </option>

              <option>
                PhonePe
              </option>

              <option>
                Google Pay
              </option>

              <option>
                Paytm
              </option>

            </select>



          </div>





          {/* Order Summary */}


          <div className="bg-white rounded-2xl shadow-lg p-6">


            <h2 className="text-2xl font-bold mb-6">

              Order Summary

            </h2>




            <div className="space-y-4">


              {cart.map((item)=> (

                <div

                  key={item.id}

                  className="flex justify-between border-b pb-3"

                >


                  <div>

                    <p className="font-semibold">
                      {item.name}
                    </p>


                    <p className="text-gray-500">
                      Qty : {item.quantity}
                    </p>


                  </div>



                  <p className="font-bold">

                    ₹{item.price * item.quantity}

                  </p>


                </div>

              ))}


            </div>




            <hr className="my-6"/>




            <div className="flex justify-between mb-3">

              <span>
                Products Total
              </span>


              <b>
                ₹{productTotal}
              </b>

            </div>




            <div className="flex justify-between mb-3">

              <span>
                Delivery Fee
              </span>


              <b>

                {
                  deliveryFee === 0
                  ? "Free"
                  : `₹${deliveryFee}`
                }

              </b>

            </div>




            <div className="flex justify-between text-2xl font-bold mt-5">

              <span>
                Grand Total
              </span>


              <span>
                ₹{total}
              </span>


            </div>




            <button

              disabled={loading}

              onClick={placeOrder}

              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 text-lg font-bold disabled:opacity-50"

            >

              {
                loading
                ?
                "Placing Order..."
                :
                "Place Order 🛍️"
              }


            </button>



            <p className="text-center text-sm text-gray-500 mt-4">

              Your order is securely processed and will appear in your account after confirmation.

            </p>



          </div>



        </div>


      </div>


    </main>

  );

}
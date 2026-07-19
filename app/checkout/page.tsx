"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db, auth } from "@/app/lib/firebase";
import { generateInvoice } from "@/app/lib/generateInvoice";


export default function CheckoutPage() {


  const {
    cart,
    clearCart,
  } = useCart();


  const router = useRouter();


  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");





  useEffect(()=>{


    const loadProfile = async()=>{


      const user =
        auth.currentUser;


      if(!user) return;



      const snap =
        await getDoc(
          doc(
            db,
            "users",
            user.uid
          )
        );



      if(snap.exists()){


        const data =
          snap.data();



        setName(
          data.name || ""
        );


        setPhone(
          data.phone || ""
        );


        setAddress(
          data.address || ""
        );


      }


    };


    loadProfile();


  },[]);







  const productTotal =
    cart.reduce(
      (sum,item)=>
        sum +
        item.price *
        item.quantity,

      0
    );





  // Delivery Fee

  const deliveryFee =
    productTotal >= 500
      ? 0
      : 50;



  const total =
    productTotal +
    deliveryFee;








  // Current Location

  const getCurrentLocation = ()=>{


    if(!navigator.geolocation){

      alert(
        "Location not supported"
      );

      return;

    }



    navigator.geolocation.getCurrentPosition(


      (position)=>{


        const lat =
          position.coords.latitude;


        const lng =
          position.coords.longitude;



        const location =
          `https://maps.google.com/?q=${lat},${lng}`;



        setAddress(location);



        alert(
          "Current location added 📍"
        );


      },



      ()=>{

        alert(
          "Please allow location permission"
        );

      }


    );


  };








  const placeOrder = async()=>{


    if(
      !name ||
      !phone ||
      !address
    ){

      alert(
        "Please fill all details"
      );

      return;

    }




    if(cart.length===0){

      alert(
        "Cart is empty"
      );

      return;

    }






    try{


      const user =
        auth.currentUser;




      const orderRef =
        await addDoc(

          collection(
            db,
            "orders"
          ),

          {


            userId:
              user?.uid || "",


            customerName:name,


            phone,


            address,



            products:cart,



            productTotal,



            deliveryFee,



            total,



            status:
              "Pending",



            createdAt:
              Timestamp.now()


          }

        );







      generateInvoice(

        orderRef.id,

        {
          name,
          phone,
          address
        },

        cart,

        total

      );







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

Qty:
${item.quantity}

Price:
₹${item.price}

`;

      });





      message +=
`
🚚 Delivery Fee:
₹${deliveryFee}

💰 Total:
₹${total}

Thank you 🙏`;







      const whatsappURL =
`https://wa.me/919676578296?text=${encodeURIComponent(message)}`;





      window.open(
        whatsappURL,
        "_blank"
      );





      clearCart();



      router.push(
        `/order-success?orderId=${orderRef.id}`
      );





    }
    catch(error){


      console.log(error);


      alert(
        "Order failed"
      );


    }


  };







  return (

    <main className="max-w-6xl mx-auto p-6">


      <h1 className="text-4xl font-bold mb-8">
        Checkout 🛒
      </h1>





      <div className="grid md:grid-cols-2 gap-8">



        <div className="space-y-4">


          <input

            value={name}

            onChange={(e)=>
              setName(e.target.value)
            }

            placeholder="Full Name"

            className="
            w-full
            border
            p-3
            rounded-lg
            "

          />





          <input

            value={phone}

            onChange={(e)=>
              setPhone(e.target.value)
            }

            placeholder="Phone Number"

            className="
            w-full
            border
            p-3
            rounded-lg
            "

          />







          <button

            onClick={getCurrentLocation}

            className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-lg
            font-bold
            "

          >

            📍 Use Current Location

          </button>







          <textarea

            value={address}

            onChange={(e)=>
              setAddress(e.target.value)
            }

            placeholder="Delivery Address"

            className="
            w-full
            border
            p-3
            rounded-lg
            h-32
            "

          />



        </div>







        <div className="
        border
        rounded-xl
        p-6
        ">



          <h2 className="text-2xl font-bold mb-5">
            Order Summary
          </h2>





          {cart.map((item)=>(


            <div
              key={item.id}
              className="
              flex
              justify-between
              border-b
              py-3
              "
            >


              <span>

                {item.name}
                <br/>
                Qty: {item.quantity}

              </span>


              <b>

                ₹{item.price * item.quantity}

              </b>


            </div>


          ))}






          <p className="mt-4">

            Products:
            ₹{productTotal}

          </p>



          <p>

            Delivery:
            {
              deliveryFee === 0
              ? "Free"
              : `₹${deliveryFee}`
            }

          </p>





          <h2 className="
          text-3xl
          font-bold
          mt-5
          ">

            Total:
            ₹{total}

          </h2>






          <button

            onClick={placeOrder}

            className="
            mt-6
            w-full
            bg-green-600
            text-white
            py-3
            rounded-lg
            font-bold
            "

          >

            Place Order 📲

          </button>



        </div>


      </div>


    </main>

  );


}
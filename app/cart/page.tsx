"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";


export default function CartPage() {


  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();


  const router = useRouter();



  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );



  return (

    <div className="max-w-5xl mx-auto p-6">


      <h1 className="text-4xl font-bold mb-8">
        My Cart 🛒
      </h1>



      {cart.length === 0 ? (

        <p className="text-xl">
          Your cart is empty
        </p>


      ) : (

        <>

          {cart.map((item) => (

            <div
              key={item.id}
              className="border rounded-xl p-5 mb-5 flex justify-between items-center"
            >


              <div className="flex gap-5 items-center">


                <img
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  className="w-24 h-24 object-contain border rounded"
                />


                <div>

                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>


                  <p className="text-green-600 font-bold">
                    ₹{item.price}
                  </p>


                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="text-red-500 mt-2"
                  >
                    Remove
                  </button>


                </div>

              </div>





              <div className="flex items-center gap-4">


                <button
                  onClick={() =>
                    decreaseQuantity(item.id)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  -
                </button>


                <span className="text-xl font-bold">
                  {item.quantity}
                </span>


                <button
                  onClick={() =>
                    increaseQuantity(item.id)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  +
                </button>


              </div>


            </div>


          ))}




          <div className="mt-10">


            <h2 className="text-3xl font-bold">
              Total: ₹{total}
            </h2>



            <button
              onClick={() => router.push("/checkout")}
              className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold"
            >
              Proceed to Checkout 🛒
            </button>


          </div>


        </>

      )}


    </div>

  );

}
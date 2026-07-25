"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const router = useRouter();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 999 ? 0 : 50;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

        <ShoppingCart
          size={90}
          className="text-orange-500"
        />

        <h1 className="text-3xl font-bold mt-6">
          Your Cart is Empty
        </h1>

        <p className="text-gray-500 mt-2 text-center">
          Looks like you haven't added anything yet.
        </p>

        <button
          onClick={() => router.push("/products")}
          className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold"
        >
          Continue Shopping
        </button>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 pb-32">

      {/* Header */}

      <div className="sticky top-0 bg-white shadow-sm z-30">

        <div className="flex items-center gap-4 p-4">

          <button onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </button>

          <h1 className="text-2xl font-bold">
            My Cart
          </h1>

        </div>

      </div>

      {/* Cart Items */}

      <div className="p-4 space-y-4">

        {cart.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl shadow p-4 flex gap-4"
          >

            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              className="w-28 h-28 rounded-2xl object-contain bg-gray-100"
            />

            <div className="flex-1">

              <h2 className="font-bold text-lg line-clamp-2">
                {item.name}
              </h2>

              <p className="text-orange-500 mt-2 font-bold text-xl">
                ₹{item.price}
              </p>

              <div className="flex items-center gap-3 mt-4">

                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center"
                >
                  <Minus size={18} />
                </button>

                <span className="font-bold text-lg">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>

              </div>

            </div>

            <button
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="text-red-500" />
            </button>

          </div>

        ))}

      </div>

      {/* Bill Summary */}

      <div className="mx-4 bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Price Details
        </h2>

        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span>Delivery</span>

          <span className="text-green-600">
            {delivery === 0 ? "FREE" : `₹${delivery}`}
          </span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <div className="mt-5 space-y-2 text-sm text-gray-500">

          <div className="flex items-center gap-2">
            <Truck size={16} />
            Free delivery above ₹999
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            100% Secure Checkout
          </div>

        </div>

      </div>

      {/* Bottom Checkout */}

      <div className="fixed bottom-20 left-0 right-0 bg-white border-t shadow-xl p-4">

        <div className="max-w-5xl mx-auto flex items-center justify-between">

          <div>

            <p className="text-gray-500 text-sm">
              Total Amount
            </p>

            <h2 className="text-2xl font-bold text-orange-500">
              ₹{total}
            </h2>

          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold"
          >
            Checkout
          </button>

        </div>

      </div>

    </main>
  );
}
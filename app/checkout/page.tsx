"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  UserRound,
} from "lucide-react";

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
  const [locationLoading, setLocationLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const productTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = cart.reduce(
    (sum, item) =>
      sum + (item.deliveryFee || 0) * item.quantity,
    0
  );

  const total = productTotal + deliveryFee;

  const formatPrice = (price: number) =>
    price.toLocaleString("en-IN");

  /*
  ========================================
  LOAD PROFILE ONLY IF USER ALREADY EXISTS
  ========================================

  Important:
  We DO NOT redirect to login anymore.

  If an old customer is already logged in,
  we simply load their name/phone/address.

  If no user exists, checkout continues
  normally as guest checkout.
  */

  useEffect(() => {
    loadExistingProfile();
  }, []);

  async function loadExistingProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("name, phone, address")
        .eq("uuid", user.id)
        .maybeSingle();

      if (error) {
        console.log("Profile not found:", error.message);
        return;
      }

      if (!data) {
        return;
      }

      setName(data.name || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
    } catch (error) {
      console.log("Profile loading error:", error);
    }
  }

  /*
  ========================================
  CURRENT LOCATION
  ========================================
  */

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Location is not supported on this device.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setAddress(
          `https://maps.google.com/?q=${lat},${lng}`
        );

        setLocationLoading(false);
      },

      (error) => {
        console.log("Location error:", error);

        setLocationLoading(false);

        if (error.code === 1) {
          alert(
            "Location permission denied. Please enter your address manually."
          );
        } else {
          alert(
            "Unable to get your location. Please enter your address manually."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /*
  ========================================
  GET CUSTOMER / GUEST USER
  ========================================
  */

  async function getCheckoutUser() {
    /*
      First check whether customer
      already has a Supabase session.
    */

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return user;
    }

    /*
      No login?

      Create anonymous user silently.

      Customer does NOT see:
      - Login
      - Signup
      - Email
      - Password
      - Email confirmation
    */

    const {
      data,
      error,
    } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error(
        "Anonymous sign-in error:",
        error
      );

      throw new Error(
        "Guest checkout is currently unavailable. Please try again."
      );
    }

    if (!data.user) {
      throw new Error(
        "Unable to start guest checkout."
      );
    }

    return data.user;
  }

  /*
  ========================================
  PLACE ORDER
  ========================================
  */

  async function placeOrder() {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      /*
      ========================================
      GET EXISTING USER OR CREATE GUEST
      ========================================
      */

      const checkoutUser =
        await getCheckoutUser();

      /*
      ========================================
      CREATE ORDER
      ========================================
      */

      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: checkoutUser.id,

            customer_name: name.trim(),

            phone: cleanPhone,

            address: address.trim(),

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
        console.error(
          "Order creation error:",
          error
        );

        alert(
          `Unable to place order: ${error.message}`
        );

        return;
      }

      if (!data) {
        alert(
          "Order could not be created. Please try again."
        );

        return;
      }

      /*
      ========================================
      GENERATE INVOICE
      ========================================
      */

      try {
        generateInvoice(
          data.id,

          {
            name: name.trim(),
            phone: cleanPhone,
            address: address.trim(),
          },

          cart as CartItem[],

          productTotal,

          deliveryFee,

          total
        );
      } catch (invoiceError) {
        console.error(
          "Invoice error:",
          invoiceError
        );
      }

      /*
      ========================================
      WHATSAPP MESSAGE
      ========================================
      */

      let message = `🛍️ *Nithesh Cosmetics*

🆔 Order ID: ${data.id}

👤 Name: ${name.trim()}

📞 Phone: ${cleanPhone}

📍 Address:
${address.trim()}

----------------------

`;

      cart.forEach((item) => {
        message += `${item.name}

Qty : ${item.quantity}

Price : ₹${formatPrice(item.price)}

Total : ₹${formatPrice(
          item.price * item.quantity
        )}

----------------------

`;
      });

      message += `Product Total : ₹${formatPrice(
        productTotal
      )}

Delivery Fee : ₹${formatPrice(
        deliveryFee
      )}

Grand Total : ₹${formatPrice(total)}

Payment : ${paymentMethod}

Thank You ❤️`;

      const whatsappURL =
        `https://wa.me/919676578296?text=${encodeURIComponent(
          message
        )}`;

      /*
      ========================================
      CLEAR CART
      ========================================
      */

      clearCart();

      /*
      ========================================
      OPEN WHATSAPP
      ========================================
      */

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      /*
      ========================================
      ORDER SUCCESS PAGE
      ========================================
      */

      router.push(
        `/order-success?orderId=${data.id}`
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          "Something went wrong while placing your order."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff5eb]
        to-white
        pb-28
        text-gray-900
        md:pb-16
      "
    >
      {/* Background Glow */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            -left-32
            top-20
            h-80
            w-80
            rounded-full
            bg-orange-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-36
            top-[500px]
            h-96
            w-96
            rounded-full
            bg-rose-200/20
            blur-3xl
          "
        />
      </div>

      {/* Header */}

      <div
        className="
          sticky
          top-0
          z-40
          border-b
          border-gray-100
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            gap-3
            px-4
            py-4
            sm:px-6
            lg:px-8
          "
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-gray-200
              bg-white
              text-gray-700
              shadow-sm
              transition-all
              hover:border-orange-200
              hover:bg-orange-50
              hover:text-orange-600
              active:scale-95
            "
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-orange-500
                sm:text-xs
              "
            >
              Nithesh Cosmetics
            </p>

            <h1
              className="
                text-xl
                font-black
                tracking-tight
                sm:text-2xl
              "
            >
              Secure Checkout
            </h1>
          </div>

          <div
            className="
              ml-auto
              hidden
              items-center
              gap-2
              rounded-full
              bg-green-50
              px-4
              py-2
              text-xs
              font-bold
              text-green-700
              sm:flex
            "
          >
            <ShieldCheck size={15} />
            Secure
          </div>
        </div>
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-4
          py-6
          sm:px-6
          sm:py-10
          lg:px-8
        "
      >
        {/* Guest Checkout Info */}

        <div
          className="
            mb-5
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-green-100
            bg-green-50
            p-4
            text-green-800
            shadow-sm
          "
        >
          <CheckCircle2
            size={21}
            className="shrink-0"
          />

          <div>
            <p className="text-sm font-bold">
              No login required
            </p>

            <p className="mt-0.5 text-xs text-green-700">
              Enter your delivery details and place
              your order directly.
            </p>
          </div>
        </div>

        {/* Checkout Progress */}

        <div
          className="
            mb-6
            grid
            grid-cols-3
            gap-2
            sm:mb-10
            sm:gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-orange-100
              bg-white
              p-3
              shadow-sm
              sm:p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-orange-100
                text-orange-600
              "
            >
              <ShoppingBag size={18} />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold text-orange-600">
                Step 1
              </p>

              <p className="text-sm font-semibold">
                Cart
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-orange-300
              bg-orange-50
              p-3
              shadow-sm
              sm:p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-orange-500
                text-white
              "
            >
              <CreditCard size={18} />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold text-orange-600">
                Step 2
              </p>

              <p className="text-sm font-semibold">
                Checkout
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-3
              shadow-sm
              sm:p-4
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-gray-100
                text-gray-500
              "
            >
              <CheckCircle2 size={18} />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-400">
                Step 3
              </p>

              <p className="text-sm font-semibold">
                Done
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            grid
            gap-6
            lg:grid-cols-[1fr_420px]
            lg:gap-8
          "
        >
          {/* Customer Details */}

          <section
            className="
              rounded-[30px]
              border
              border-gray-100
              bg-white
              p-5
              shadow-[0_12px_45px_rgba(15,23,42,0.06)]
              sm:p-7
            "
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-orange-50
                  text-orange-600
                "
              >
                <UserRound size={22} />
              </div>

              <div>
                <h2
                  className="
                    text-xl
                    font-black
                    tracking-tight
                    sm:text-2xl
                  "
                >
                  Delivery Details
                </h2>

                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  No account required
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Name */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Full Name
                </label>

                <input
                  type="text"
                  autoComplete="name"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50/70
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-orange-100
                    sm:text-base
                  "
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              {/* Phone */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Smartphone
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50/70
                      py-3.5
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      transition-all
                      placeholder:text-gray-400
                      focus:border-orange-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-orange-100
                      sm:text-base
                    "
                    placeholder="Enter 10-digit phone number"
                    value={phone}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setPhone(
                        value.slice(0, 10)
                      );
                    }}
                  />
                </div>
              </div>

              {/* Address */}

              <div>
                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Delivery Address
                </label>

                <textarea
                  className="
                    min-h-32
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50/70
                    px-4
                    py-3.5
                    text-sm
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-orange-100
                    sm:text-base
                  "
                  placeholder="House number, street, area, city..."
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />
              </div>

              {/* Current Location */}

              <button
                type="button"
                disabled={locationLoading}
                onClick={getCurrentLocation}
                className="
                  flex
                  min-h-14
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-blue-100
                  bg-blue-50
                  px-5
                  py-3
                  font-bold
                  text-blue-700
                  transition-all
                  hover:border-blue-200
                  hover:bg-blue-100
                  active:scale-[0.98]
                  disabled:pointer-events-none
                  disabled:opacity-60
                "
              >
                {locationLoading ? (
                  <>
                    <span
                      className="
                        h-5
                        w-5
                        animate-spin
                        rounded-full
                        border-2
                        border-blue-200
                        border-t-blue-700
                      "
                    />

                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin size={19} />
                    Use Current Location
                  </>
                )}
              </button>
            </div>

            {/* Payment */}

            <div
              className="
                mt-8
                border-t
                border-gray-100
                pt-7
              "
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-green-50
                    text-green-600
                  "
                >
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    Payment Method
                  </h2>

                  <p className="text-xs text-gray-500">
                    Choose your preferred payment
                  </p>
                </div>
              </div>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                className="
                  w-full
                  cursor-pointer
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-4
                  font-semibold
                  outline-none
                  transition-all
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              >
                <option>
                  Cash on Delivery
                </option>

                <option>UPI</option>
                <option>PhonePe</option>
                <option>Google Pay</option>
                <option>Paytm</option>
              </select>
            </div>
          </section>

          {/* Order Summary */}

          <section className="lg:sticky lg:top-28 lg:h-fit">
            <div
              className="
                overflow-hidden
                rounded-[30px]
                border
                border-gray-100
                bg-white
                shadow-[0_12px_45px_rgba(15,23,42,0.06)]
              "
            >
              <div
                className="
                  border-b
                  border-gray-100
                  bg-gradient-to-r
                  from-orange-50
                  to-white
                  p-5
                  sm:p-6
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      text-orange-600
                      shadow-sm
                    "
                  >
                    <PackageCheck size={21} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black">
                      Order Summary
                    </h2>

                    <p className="text-xs text-gray-500">
                      {cart.length}{" "}
                      {cart.length === 1
                        ? "product"
                        : "products"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {cart.length === 0 ? (
                  <div className="py-10 text-center">
                    <ShoppingBag
                      size={38}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 font-bold text-gray-700">
                      Your cart is empty
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        router.push("/products")
                      }
                      className="
                        mt-4
                        rounded-xl
                        bg-orange-500
                        px-5
                        py-2.5
                        text-sm
                        font-bold
                        text-white
                      "
                    >
                      Shop Products
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="
                        max-h-[320px]
                        space-y-4
                        overflow-y-auto
                        pr-1
                      "
                    >
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-gray-100
                            bg-gray-50/70
                            p-3
                          "
                        >
                          {item.image && (
                            <div
                              className="
                                flex
                                h-16
                                w-16
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-2xl
                                bg-white
                              "
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-1.5
                                "
                              />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p
                              className="
                                line-clamp-2
                                text-sm
                                font-bold
                                leading-5
                                text-gray-900
                              "
                            >
                              {item.name}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                font-medium
                                text-gray-500
                              "
                            >
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <p
                            className="
                              shrink-0
                              text-sm
                              font-black
                              text-orange-600
                            "
                          >
                            ₹
                            {formatPrice(
                              item.price *
                                item.quantity
                            )}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="my-6 h-px bg-gray-100" />

                    <div className="space-y-4">
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          text-sm
                        "
                      >
                        <span className="text-gray-500">
                          Products Total
                        </span>

                        <span className="font-bold text-gray-800">
                          ₹
                          {formatPrice(
                            productTotal
                          )}
                        </span>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          text-sm
                        "
                      >
                        <span className="text-gray-500">
                          Delivery Fee
                        </span>

                        {deliveryFee === 0 ? (
                          <span
                            className="
                              rounded-full
                              bg-green-50
                              px-3
                              py-1
                              text-xs
                              font-extrabold
                              text-green-600
                            "
                          >
                            FREE
                          </span>
                        ) : (
                          <span className="font-bold text-gray-800">
                            ₹
                            {formatPrice(
                              deliveryFee
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="my-6 h-px bg-gray-100" />

                    <div
                      className="
                        flex
                        items-end
                        justify-between
                        gap-3
                      "
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Grand Total
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          Final payable amount
                        </p>
                      </div>

                      <p
                        className="
                          text-2xl
                          font-black
                          tracking-tight
                          text-orange-600
                          sm:text-3xl
                        "
                      >
                        ₹{formatPrice(total)}
                      </p>
                    </div>

                    {/* Trust Info */}

                    <div className="mt-6 grid gap-3">
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          bg-gray-50
                          p-3
                        "
                      >
                        <ShieldCheck
                          size={18}
                          className="
                            shrink-0
                            text-green-600
                          "
                        />

                        <div>
                          <p className="text-xs font-bold">
                            Secure Checkout
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-500">
                            No login or email required.
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          bg-gray-50
                          p-3
                        "
                      >
                        <Truck
                          size={18}
                          className="
                            shrink-0
                            text-orange-600
                          "
                        />

                        <div>
                          <p className="text-xs font-bold">
                            Delivery Confirmation
                          </p>

                          <p className="mt-0.5 text-[11px] text-gray-500">
                            We will contact you using
                            your phone number.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Place Order */}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={placeOrder}
                      className="
                        mt-6
                        flex
                        min-h-14
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-gradient-to-r
                        from-orange-500
                        to-orange-600
                        px-6
                        py-4
                        text-base
                        font-black
                        text-white
                        shadow-[0_12px_30px_rgba(249,115,22,0.28)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-[0_16px_38px_rgba(249,115,22,0.35)]
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {loading ? (
                        <>
                          <span
                            className="
                              h-5
                              w-5
                              animate-spin
                              rounded-full
                              border-2
                              border-white/40
                              border-t-white
                            "
                          />

                          Placing Order...
                        </>
                      ) : (
                        <>
                          <ShoppingBag
                            size={19}
                          />

                          Place Order
                        </>
                      )}
                    </button>

                    <p
                      className="
                        mt-4
                        text-center
                        text-[11px]
                        leading-5
                        text-gray-500
                        sm:text-xs
                      "
                    >
                      No account or email
                      confirmation required.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  ShoppingCart,
  User,
  Bell,
  Heart,
  MapPin,
} from "lucide-react";

import { useCart } from "@/app/context/CartContext";
import SideDrawer from "./SideDrawer";


export default function Navbar() {

  const { cart } = useCart();

  const [drawerOpen, setDrawerOpen] = useState(false);


  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );


  return (

    <>

      <header className="
        sticky
        top-0
        z-50
        w-full
        overflow-hidden
        bg-orange-500
        text-white
        shadow-lg
      ">


        <div className="
          flex
          items-center
          justify-between
          w-full
          px-3
          sm:px-4
          py-3
          sm:py-4
        ">


          <button
            onClick={() => setDrawerOpen(true)}
            className="
              p-2
              rounded-full
              hover:bg-orange-600
              transition
              shrink-0
            "
          >

            <Menu size={22}/>

          </button>



          <div className="
            flex-1
            text-center
            px-2
            min-w-0
          ">

            <h1 className="
              text-lg
              sm:text-2xl
              md:text-3xl
              font-black
              tracking-wide
              uppercase
              truncate
            ">

              Nithesh Cosmetics

            </h1>


            <p className="
              text-[11px]
              sm:text-xs
              text-orange-100
            ">

              Barber & Cosmetics Store

            </p>


          </div>




          <Link
            href="/account"
            className="
              w-9
              h-9
              rounded-full
              bg-white
              text-orange-500
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            <User size={20}/>

          </Link>


        </div>




        <div className="px-3 sm:px-4 pb-3">


          <div className="
            bg-white
            rounded-2xl
            p-3
            sm:p-4
            text-black
            shadow
            w-full
          ">


            <div className="flex items-center gap-3">


              <MapPin
                size={18}
                className="text-orange-500 shrink-0"
              />


              <div className="min-w-0">


                <p className="text-[11px] text-gray-500">
                  Deliver to
                </p>


                <h3 className="font-bold text-sm sm:text-base">
                  Nagarkurnool
                </h3>


                <p className="text-[11px] text-gray-500">
                  Near VKR Hospital
                </p>


              </div>


            </div>


          </div>


        </div>


      </header>




      <div className="
        w-full
        z-40
        bg-white
        shadow-sm
      ">


        <div className="
          flex
          justify-around
          py-2.5
          sm:py-3
        ">


          <Link href="/wishlist">

            <Heart size={22}/>

          </Link>



          <Link href="/notifications">

            <Bell size={22}/>

          </Link>




          <Link
            href="/cart"
            className="relative"
          >

            <ShoppingCart size={22}/>


            {cartCount > 0 && (

              <span className="
                absolute
                -top-1.5
                -right-1.5
                bg-red-600
                text-white
                text-[10px]
                rounded-full
                min-w-[18px]
                h-[18px]
                flex
                items-center
                justify-center
              ">

                {cartCount}

              </span>

            )}


          </Link>


        </div>


      </div>




      <SideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />


    </>

  );

}
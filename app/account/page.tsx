"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Gift,
} from "lucide-react";


export default function AccountPage() {

  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    loadUser();
  }, []);



  async function loadUser() {

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();


    setUser(user);
    setLoading(false);

  }



  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/login");

  }



  if(loading){

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  }



  return (

    <main className="min-h-screen bg-gray-100">


      {/* Header */}

      <div className="sticky top-0 z-10 bg-white shadow p-4">

        <h1 className="text-2xl font-bold text-center">
          👤 My Account
        </h1>

      </div>



      <div className="p-4">



        {/* Profile Card */}

        <Link href="/account">

        <div className="
        bg-white
        rounded-2xl
        shadow
        p-5
        flex
        items-center
        justify-between
        hover:bg-gray-50
        ">


          <div className="flex items-center gap-4">


            <div className="
            w-16
            h-16
            rounded-full
            bg-orange-500
            flex
            items-center
            justify-center
            text-white
            ">

              <User size={32}/>

            </div>



            <div>


              <h2 className="font-bold text-lg">

                {
                  user?.user_metadata?.name
                  || "Customer"
                }

              </h2>



              <p className="text-gray-500">

                {user?.email}

              </p>



              <p className="text-gray-500">

                {
                  user?.user_metadata?.phone
                  || "No Phone"
                }

              </p>


            </div>


          </div>


          <ChevronRight/>


        </div>

        </Link>




        {/* Menu */}

        <div className="
        bg-white
        rounded-2xl
        shadow
        mt-5
        divide-y
        ">


          <MenuItem
          icon={<Package size={20}/>}
          title="My Orders"
          href="/orders"
          />


          <MenuItem
          icon={<Heart size={20}/>}
          title="Wishlist"
          href="/wishlist"
          />


          <MenuItem
          icon={<MapPin size={20}/>}
          title="My Addresses"
          href="/addresses"
          />


          <MenuItem
          icon={<CreditCard size={20}/>}
          title="Payment Methods"
          href="/payments"
          />


          <MenuItem
          icon={<Bell size={20}/>}
          title="Notifications"
          href="/notifications"
          />


          <MenuItem
          icon={<Gift size={20}/>}
          title="Offers & Coupons"
          href="/offers"
          />


          <MenuItem
          icon={<Settings size={20}/>}
          title="Account Settings"
          href="/settings"
          />


          <MenuItem
          icon={<HelpCircle size={20}/>}
          title="Help & Support"
          href="/help"
          />



          <button
          onClick={handleLogout}
          className="
          w-full
          flex
          items-center
          justify-between
          p-4
          hover:bg-gray-50
          text-red-500
          "
          >


            <div className="flex items-center gap-3">

              <LogOut size={20}/>

              <span>
                Logout
              </span>

            </div>


            <ChevronRight size={18}/>


          </button>


        </div>




        <p className="text-center text-gray-500 text-sm mt-6">

          Nithesh Cosmetics v1.0.0

        </p>



      </div>


    </main>

  );

}




function MenuItem({
  icon,
  title,
  href,
}:{
  icon:React.ReactNode;
  title:string;
  href:string;
}){

  return (

    <Link
    href={href}
    className="
    flex
    items-center
    justify-between
    p-4
    hover:bg-gray-50
    "
    >

      <div className="flex items-center gap-3">

        {icon}

        <span className="font-medium">
          {title}
        </span>

      </div>


      <ChevronRight size={18}/>


    </Link>

  );

}
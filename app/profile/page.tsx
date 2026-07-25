"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


export default function ProfilePage() {

  const router = useRouter();


  const [userId, setUserId] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);

  const [longitude, setLongitude] = useState<number | null>(null);


  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);



  useEffect(() => {

    loadProfile();

  }, []);




  async function loadProfile() {


    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();



    if (!user) {

      router.push("/login");

      return;

    }



    setUserId(user.id);



    const {
      data,
      error
    } = await supabase

      .from("profiles")

      .select("*")

      .eq("uuid", user.id)

      .single();



    if (error) {

      console.log(error);

    }



    if (data) {


      setName(data.name || "");

      setEmail(data.email || user.email || "");

      setPhone(data.phone || "");

      setAddress(data.address || "");

      setLatitude(data.latitude || null);

      setLongitude(data.longitude || null);


    }



    setLoading(false);

  }





  function getCurrentLocation() {


    if (!navigator.geolocation) {

      alert("Location not supported");

      return;

    }



    navigator.geolocation.getCurrentPosition(

      async(position) => {


        const lat = position.coords.latitude;

        const lng = position.coords.longitude;


        const mapLink =
          `https://maps.google.com/?q=${lat},${lng}`;



        setLatitude(lat);

        setLongitude(lng);



        await supabase

          .from("profiles")

          .update({

            latitude: lat,

            longitude: lng,

            location: mapLink

          })

          .eq("uuid", userId);



        alert("📍 Location saved");


      },


      () => {

        alert("Please allow location permission");

      }

    );

  }






  async function saveProfile() {


    if (phone.length !== 10) {

      alert("Enter valid 10 digit phone number");

      return;

    }



    try {


      setSaving(true);



      await supabase

        .from("profiles")

        .update({

          phone,

          address,

          latitude,

          longitude

        })

        .eq("uuid", userId);



      alert("✅ Profile updated");


    }

    catch(error) {

      console.log(error);

      alert("Update failed");

    }

    finally {

      setSaving(false);

    }

  }






  async function logout() {


    await supabase.auth.signOut();

    router.push("/login");


  }






  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Loading Profile...

      </div>

    );

  }






  return (

    <main className="
      min-h-screen
      bg-orange-50
      p-4
    ">


      <div className="
        max-w-md
        mx-auto
        bg-white
        rounded-3xl
        shadow-xl
        p-6
      ">



        <h1 className="
          text-3xl
          font-black
          text-center
          text-orange-500
          mb-6
        ">

          👤 My Account

        </h1>




        <label className="font-semibold">
          Name
        </label>

        <input

          value={name}

          disabled

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
            bg-gray-100
          "

        />





        <label className="font-semibold">
          Email
        </label>


        <input

          value={email}

          disabled

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
            bg-gray-100
          "

        />





        <label className="font-semibold">
          Phone
        </label>


        <input

          value={phone}

          onChange={(e)=>setPhone(e.target.value)}

          placeholder="Enter phone number"

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
          "

        />





        <label className="font-semibold">
          Address
        </label>


        <textarea

          value={address}

          onChange={(e)=>setAddress(e.target.value)}

          placeholder="Delivery address"

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
            h-28
          "

        />





        <button

          onClick={getCurrentLocation}

          className="
            w-full
            bg-orange-500
            text-white
            py-3
            rounded-xl
            mb-3
            font-bold
          "

        >

          📍 Use Current Location

        </button>





        <button

          onClick={saveProfile}

          className="
            w-full
            bg-green-600
            text-white
            py-3
            rounded-xl
            font-bold
          "

        >

          {saving ? "Saving..." : "Save Profile"}

        </button>





        <button

          onClick={logout}

          className="
            w-full
            bg-red-600
            text-white
            py-3
            rounded-xl
            mt-4
            font-bold
          "

        >

          🚪 Logout

        </button>



      </div>


    </main>

  );

}
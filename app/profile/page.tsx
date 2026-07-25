"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


export default function ProfilePage() {


  const router = useRouter();


  const [userId,setUserId] = useState("");

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");

  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");

  const [latitude,setLatitude] = useState<number | null>(null);
  const [longitude,setLongitude] = useState<number | null>(null);

  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);





  useEffect(()=>{


    loadProfile();


  },[]);





  const loadProfile = async()=>{


    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();



    if(!user){

      router.push("/login");
      return;

    }



    setUserId(user.id);



    const {
      data,
      error
    } = await supabase
      .from("users")
      .select("*")
      .eq("id",user.id)
      .single();




    if(data){


      setName(
        data.name || ""
      );


      setEmail(
        data.email || user.email || ""
      );


      setPhone(
        data.phone || ""
      );


      setAddress(
        data.address || ""
      );


      setLatitude(
        data.latitude || null
      );


      setLongitude(
        data.longitude || null
      );


    }



    setLoading(false);


  };









  const getCurrentLocation = ()=>{


    if(!navigator.geolocation){


      alert(
        "Location not supported"
      );

      return;

    }



    navigator.geolocation.getCurrentPosition(

      async(position)=>{


        const lat =
          position.coords.latitude;


        const lng =
          position.coords.longitude;



        const mapLink =
          `https://maps.google.com/?q=${lat},${lng}`;



        setLatitude(lat);

        setLongitude(lng);



        const {
          data:{
            user
          }
        } = await supabase.auth.getUser();



        if(user){


          await supabase
          .from("users")
          .update({

            latitude:lat,

            longitude:lng,

            location:mapLink

          })
          .eq(
            "id",
            user.id
          );


        }



        alert(
          "Location saved!"
        );


      },


      ()=>{


        alert(
          "Please allow location permission"
        );


      }

    );


  };









  const saveProfile = async()=>{


    if(phone.length !== 10){


      alert(
        "Enter valid 10 digit phone number"
      );


      return;

    }



    try{


      setSaving(true);



      await supabase
      .from("users")
      .update({

        phone,

        address,

        latitude,

        longitude

      })
      .eq(
        "id",
        userId
      );




      alert(
        "Profile updated successfully!"
      );



    }
    catch(error){


      console.log(error);


      alert(
        "Update failed"
      );


    }
    finally{


      setSaving(false);


    }


  };









  const logout = async()=>{


    await supabase.auth.signOut();


    router.push(
      "/login"
    );


  };









  if(loading){


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
    bg-gray-100
    p-4
    ">


      <div className="
      max-w-md
      mx-auto
      bg-white
      rounded-2xl
      shadow-xl
      p-6
      ">



        <h1 className="
        text-3xl
        font-bold
        text-center
        mb-6
        text-orange-600
        ">

          👤 My Profile

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
        rounded-lg
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
        rounded-lg
        mb-4
        bg-gray-100
        "

        />






        <label className="font-semibold">
          Phone Number
        </label>


        <input

        type="tel"

        value={phone}

        onChange={(e)=>
          setPhone(e.target.value)
        }

        placeholder="Enter phone number"

        className="
        w-full
        border
        p-3
        rounded-lg
        mb-4
        "

        />






        <label className="font-semibold">
          Delivery Address
        </label>


        <textarea

        value={address}

        onChange={(e)=>
          setAddress(e.target.value)
        }

        placeholder="Enter address"

        className="
        w-full
        border
        p-3
        rounded-lg
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
        rounded-lg
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
        rounded-lg
        font-bold
        "

        >

          {
          saving
          ? "Saving..."
          : "Save Profile"
          }

        </button>







        <button

        onClick={logout}

        className="
        w-full
        bg-red-600
        text-white
        py-3
        rounded-lg
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
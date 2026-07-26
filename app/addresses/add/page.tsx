"use client";

import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AddAddressPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [loading, setLoading] = useState(false);


  const saveAddress = async () => {

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      alert("Please fill all fields");
      return;
    }


    setLoading(true);


    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();



    if (!user) {

      alert("Please login first");
      setLoading(false);
      return;

    }



    const { error } = await supabase
      .from("addresses")
      .insert({

        user_id: user.id,
        name,
        phone,
        address,
        city,
        state,
        pincode,

      });



    if (error) {

      console.log(error);
      alert(error.message);

    } else {

      alert("Address saved successfully");

      router.push("/addresses");

    }


    setLoading(false);

  };



  return (

    <main className="min-h-screen bg-gray-100">


      {/* Header */}

      <div className="sticky top-0 bg-white shadow p-4 flex items-center gap-3">


        <Link href="/addresses">

          <ChevronLeft size={26}/>

        </Link>


        <h1 className="text-xl font-bold">
          Add New Address
        </h1>


      </div>



      <div className="p-4">


        <div className="bg-white rounded-2xl shadow p-5 space-y-4">


          <div className="flex justify-center">

            <MapPin
              size={45}
              className="text-orange-500"
            />

          </div>



          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-xl p-3"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />



          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border rounded-xl p-3"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />



          <textarea
            placeholder="Full Address"
            rows={3}
            className="w-full border rounded-xl p-3"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
          />



          <input
            type="text"
            placeholder="City"
            className="w-full border rounded-xl p-3"
            value={city}
            onChange={(e)=>setCity(e.target.value)}
          />



          <input
            type="text"
            placeholder="State"
            className="w-full border rounded-xl p-3"
            value={state}
            onChange={(e)=>setState(e.target.value)}
          />



          <input
            type="text"
            placeholder="Pincode"
            className="w-full border rounded-xl p-3"
            value={pincode}
            onChange={(e)=>setPincode(e.target.value)}
          />



          <button
            onClick={saveAddress}
            disabled={loading}
            className="
            w-full
            bg-orange-500
            text-white
            py-4
            rounded-2xl
            font-semibold
            "
          >

            {
              loading
              ? "Saving..."
              : "Save Address"
            }

          </button>


        </div>


      </div>


    </main>

  );

}
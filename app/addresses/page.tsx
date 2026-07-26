"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  ChevronLeft,
  Pencil,
  Trash2,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";


type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};


export default function AddressesPage() {


  const [addresses,setAddresses] = useState<Address[]>([]);
  const [loading,setLoading] = useState(true);



  useEffect(()=>{

    fetchAddresses();

  },[]);



  const fetchAddresses = async()=>{


    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();



    if(!user){

      setLoading(false);
      return;

    }



    const {data,error}=await supabase
    .from("addresses")
    .select("*")
    .eq("user_id",user.id)
    .order("created_at",{ascending:false});



    if(error){

      console.log(error);

    }
    else{

      setAddresses(data || []);

    }



    setLoading(false);

  };




  const deleteAddress = async(id:string)=>{


    const confirmDelete = confirm(
      "Delete this address?"
    );


    if(!confirmDelete) return;



    const {error}=await supabase
    .from("addresses")
    .delete()
    .eq("id",id);



    if(!error){

      setAddresses(
        addresses.filter(
          item=>item.id!==id
        )
      );

    }


  };



  return (

    <main className="min-h-screen bg-gray-100">


      {/* Header */}

      <div className="sticky top-0 z-10 bg-white shadow p-4 flex items-center gap-3">

        <Link href="/account">

          <ChevronLeft size={26}/>

        </Link>


        <h1 className="text-xl font-bold">
          My Addresses
        </h1>


      </div>



      <div className="p-4">



        {
          loading && (

            <p className="text-center">
              Loading addresses...
            </p>

          )
        }




        {
          !loading && addresses.length===0 && (

            <div className="bg-white rounded-2xl p-6 text-center">

              <MapPin
              className="mx-auto text-orange-500"
              size={40}
              />

              <p className="mt-3 text-gray-600">
                No address saved
              </p>

            </div>

          )
        }





        {
          addresses.map((item)=>(
            

            <div
            key={item.id}
            className="bg-white rounded-2xl shadow p-5 mb-4"
            >


              <div className="flex justify-between">


                <div className="flex gap-3">


                  <MapPin
                  className="text-orange-500 mt-1"
                  />


                  <div>


                    <h2 className="font-bold text-lg">
                      Home
                    </h2>


                    <p className="text-gray-600 mt-2">
                      {item.name}
                    </p>


                    <p className="text-gray-600">
                      {item.phone}
                    </p>


                    <p className="text-gray-600">
                      {item.address}
                    </p>


                    <p className="text-gray-600">
                      {item.city}, {item.state} - {item.pincode}
                    </p>


                  </div>


                </div>




                <button
                onClick={()=>deleteAddress(item.id)}
                >

                  <Trash2
                  size={20}
                  className="text-red-500"
                  />

                </button>



              </div>



            </div>


          ))
        }





        <Link
        href="/addresses/add"
        className="
        w-full
        bg-orange-500
        text-white
        py-4
        rounded-2xl
        font-semibold
        flex
        items-center
        justify-center
        gap-2
        "
        >

          <Plus size={20}/>

          Add New Address

        </Link>



      </div>



    </main>

  );

}
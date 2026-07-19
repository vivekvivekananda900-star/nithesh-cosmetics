"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";


export default function ProfilePage() {


  const router = useRouter();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");

  const [phone,setPhone] = useState("");
  const [address,setAddress] = useState("");

  const [latitude,setLatitude] = useState<number | null>(null);
  const [longitude,setLongitude] = useState<number | null>(null);

  const [loading,setLoading] = useState(true);





  useEffect(()=>{


    const loadProfile = async()=>{


      const user = auth.currentUser;



      if(!user){

        router.push("/login");

        return;

      }



      const userRef =
        doc(
          db,
          "users",
          user.uid
        );



      const snapshot =
        await getDoc(userRef);



      if(snapshot.exists()){


        const data =
          snapshot.data();



        setName(
          data.name || ""
        );


        setEmail(
          data.email || ""
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



    loadProfile();


  },[router]);







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

        setAddress(mapLink);




        const user =
          auth.currentUser;



        if(user){


          await updateDoc(

            doc(
              db,
              "users",
              user.uid
            ),

            {

              latitude:lat,

              longitude:lng,

              location:mapLink,

              address:mapLink

            }

          );


        }



        alert(
          "Current location added!"
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


    const user =
      auth.currentUser;



    if(!user) return;




    await updateDoc(

      doc(
        db,
        "users",
        user.uid
      ),

      {

        phone,

        address,

        latitude,

        longitude

      }

    );



    alert(
      "Profile updated successfully!"
    );


  };







  const logout = async()=>{


    await signOut(auth);


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

        Loading...

      </div>

    );


  }







  return (

    <main className="
      min-h-screen
      bg-gray-100
      p-6
    ">



      <div className="
        max-w-md
        mx-auto
        bg-white
        rounded-xl
        shadow-lg
        p-6
      ">



        <h1 className="
          text-3xl
          font-bold
          text-center
          mb-6
        ">

          👤 My Profile

        </h1>





        <label>
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





        <label>
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







        <label>
          Phone Number
        </label>


        <input

          type="tel"

          placeholder="Enter phone number"

          value={phone}

          onChange={(e)=>
            setPhone(
              e.target.value
            )
          }


          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
          "

        />







        <label>
          Delivery Address
        </label>



        <textarea


          placeholder="Enter address"


          value={address}


          onChange={(e)=>
            setAddress(
              e.target.value
            )
          }


          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
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
            mb-3
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

          Save Profile

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
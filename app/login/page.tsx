"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


export default function LoginPage() {

  const router = useRouter();


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);



  async function handleLogin(
    e: React.FormEvent
  ){

    e.preventDefault();


    try {

      setLoading(true);



      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({

        email,

        password,

      });



      if(error){

        throw error;

      }



      const user = data.user;



      if(!user){

        throw new Error(
          "Login failed"
        );

      }




      // Check User Role

      const {
        data: profile,
        error: profileError
      } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();



      if(profileError){

        throw profileError;

      }




      if(profile?.role === "admin"){

        router.push("/admin");

      }
      else{

        router.push("/profile");

      }



    }
    catch(error:any){

      alert(error.message);

    }
    finally{

      setLoading(false);

    }

  }




  return (

    <main className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gray-100
    ">


      <form
      onSubmit={handleLogin}
      className="
      bg-white
      p-8
      rounded-xl
      shadow-lg
      w-96
      "
      >


        <h1 className="
        text-3xl
        font-bold
        text-center
        mb-6
        ">
          Login
        </h1>



        <input
        type="email"
        placeholder="Email"
        className="
        w-full
        border
        p-3
        rounded-lg
        mb-4
        "
        value={email}
        onChange={(e)=>
          setEmail(e.target.value)
        }
        />



        <input
        type="password"
        placeholder="Password"
        className="
        w-full
        border
        p-3
        rounded-lg
        mb-4
        "
        value={password}
        onChange={(e)=>
          setPassword(e.target.value)
        }
        />



        <button
        disabled={loading}
        className="
        w-full
        bg-blue-600
        text-white
        py-3
        rounded-lg
        "
        >

        {
          loading
          ?
          "Logging in..."
          :
          "Login"
        }

        </button>


      </form>


    </main>

  );

}
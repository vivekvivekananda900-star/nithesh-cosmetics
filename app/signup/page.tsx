"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


export default function SignupPage() {

  const router = useRouter();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);



  async function handleSignup(
    e: React.FormEvent
  ) {

    e.preventDefault();


    try {

      setLoading(true);



      // Create Supabase Auth User
      const {
        data,
        error
      } = await supabase.auth.signUp({

        email,

        password,

      });



      if(error) {

        throw error;

      }



      const user = data.user;



      if(!user){

        throw new Error(
          "User creation failed"
        );

      }




      // Create Profile
      const {
        error: profileError
      } = await supabase
      .from("profiles")
      .insert({

        id: user.id,

        name,

        email,

        role: "user"

      });



      if(profileError){

        throw profileError;

      }




      alert(
        "Account created successfully!"
      );


      router.push("/profile");


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
      onSubmit={handleSignup}
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
          Create Account
        </h1>



        <input
        placeholder="Name"
        className="
        w-full
        border
        p-3
        rounded-lg
        mb-4
        "
        value={name}
        onChange={(e)=>
          setName(e.target.value)
        }
        />



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
        bg-green-600
        text-white
        py-3
        rounded-lg
        "
        >

        {
          loading
          ?
          "Creating..."
          :
          "Sign Up"
        }

        </button>



      </form>


    </main>

  );

}
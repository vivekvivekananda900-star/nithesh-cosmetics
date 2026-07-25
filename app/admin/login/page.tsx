"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


export default function AdminLoginPage() {

  const router = useRouter();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);



  async function handleLogin(
    e: React.FormEvent
  ) {

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



      if (error) throw error;



      const user = data.user;



      if (!user) {

        throw new Error("Login failed");

      }





      const {
        data: profile,
        error: profileError
      } = await supabase

        .from("profiles")

        .select("role")

        .eq("uuid", user.id)

        .single();




      if (profileError) {

        throw profileError;

      }





      if (profile?.role === "admin") {


        alert("✅ Admin Login Successful");


        router.push("/admin");


      }

      else {


        await supabase.auth.signOut();


        alert("❌ Access denied. Admin only");


      }





    }

    catch(error:any) {


      alert(error.message);


    }

    finally {


      setLoading(false);


    }


  }





  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-orange-50
      px-4
    ">


      <form

        onSubmit={handleLogin}

        className="
          bg-white
          w-full
          max-w-md
          p-8
          rounded-3xl
          shadow-xl
        "

      >


        <h1 className="
          text-3xl
          font-black
          text-center
          text-orange-500
          mb-6
        ">

          Admin Login

        </h1>




        <input

          type="email"

          placeholder="Admin Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          required

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
          "

        />





        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

          required

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-6
          "

        />





        <button

          type="submit"

          disabled={loading}

          className="
            w-full
            bg-orange-500
            text-white
            py-3
            rounded-xl
            font-bold
            hover:bg-orange-600
            transition
          "

        >

          {
            loading
            ? "Logging in..."
            : "Login as Admin"
          }


        </button>



      </form>


    </main>

  );

}
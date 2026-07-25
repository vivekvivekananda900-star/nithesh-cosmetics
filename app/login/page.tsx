"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function LoginPage() {

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

        .maybeSingle();



      if (profileError) {

        throw profileError;

      }




      alert("✅ Login Successful");



      // Admin Login

      if (profile?.role === "admin") {

        router.push("/admin");

      }


      // User Login

      else {

        router.push("/");

      }



    }

    catch (error: any) {

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

          Welcome Back

        </h1>




        <input

          type="email"

          placeholder="Email"

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-4
          "

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          required

        />




        <input

          type="password"

          placeholder="Password"

          className="
            w-full
            border
            p-3
            rounded-xl
            mb-6
          "

          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
          }

          required

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
              : "Login"
          }


        </button>



        <p className="
          text-center
          mt-5
          text-sm
        ">

          Don't have an account?


          <Link

            href="/signup"

            className="
              ml-1
              text-orange-500
              font-bold
            "

          >

            Create Account

          </Link>


        </p>



      </form>


    </main>

  );

}
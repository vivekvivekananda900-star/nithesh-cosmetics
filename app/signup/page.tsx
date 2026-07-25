"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignupPage() {

  const router = useRouter();


  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);



  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();


    try {

      setLoading(true);



      const {
        data,
        error
      } = await supabase.auth.signUp({

        email,

        password,

      });



      if (error) throw error;



      if (!data.user) {

        throw new Error("User not created");

      }




      const {
        error: profileError
      } = await supabase

        .from("profiles")

        .insert({

          uuid: data.user.id,

          name: name.trim(),

          email: email.trim(),

          role: "user",

        });



      if (profileError) throw profileError;



      alert("✅ Account Created Successfully");



      // Directly go Home

      router.push("/");



    }

    catch (err: any) {

      alert(err.message);

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

        onSubmit={handleSignup}

        className="
          bg-white
          w-full
          max-w-md
          rounded-3xl
          shadow-xl
          p-8
        "

      >


        <h1 className="
          text-3xl
          font-black
          text-center
          text-orange-500
          mb-6
        ">

          Create Account

        </h1>




        <input

          type="text"

          placeholder="Full Name"

          value={name}

          onChange={(e)=>setName(e.target.value)}

          required

          className="
            w-full
            border
            rounded-xl
            p-3
            mb-4
          "

        />




        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

          required

          className="
            w-full
            border
            rounded-xl
            p-3
            mb-4
          "

        />




        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

          required

          minLength={6}

          className="
            w-full
            border
            rounded-xl
            p-3
            mb-6
          "

        />




        <button

          type="submit"

          disabled={loading}

          className="
            w-full
            bg-orange-500
            hover:bg-orange-600
            text-white
            py-3
            rounded-xl
            font-bold
          "

        >

          {
            loading
            ? "Creating..."
            : "Create Account"
          }


        </button>




        <p className="
          text-center
          mt-5
          text-sm
        ">

          Already have an account?


          <Link

            href="/login"

            className="
              ml-1
              text-orange-500
              font-bold
            "

          >

            Login

          </Link>


        </p>



      </form>


    </main>

  );

}
"use client";

import { useState } from "react";
import { 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { 
  doc, 
  setDoc 
} from "firebase/firestore";

import { auth, db } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";


export default function SignupPage(){

  const router = useRouter();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);



  const handleSignup = async(
    e:React.FormEvent
  )=>{

    e.preventDefault();


    try{

      setLoading(true);


      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );


      const user =
        userCredential.user;



      await setDoc(
        doc(db,"users",user.uid),
        {

          name,

          email,

          createdAt:
            new Date()

        }
      );



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


  };



  return(

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
          mb-4"
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
          mb-4"
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
          mb-4"
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
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";


export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [loading,setLoading] =
    useState(true);


  useEffect(()=>{

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user)=>{

          if(!user){

            router.push("/admin/login");

          } else {

            setLoading(false);

          }

        }
      );


    return ()=>unsubscribe();


  },[router]);



  if(loading){

    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking Admin...
      </div>
    );

  }


  return children;

}
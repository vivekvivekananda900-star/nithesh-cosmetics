"use client";

import { auth } from "@/app/lib/firebase";
import { useEffect, useState } from "react";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);


  useEffect(() => {

    setUser(auth.currentUser);

  }, []);


  return (

    <main className="min-h-screen bg-gray-100 p-5">

      <h1 className="text-3xl font-bold mb-6">
        👤 My Profile
      </h1>


      <div className="bg-white rounded-xl shadow p-5">

        {
          user ? (

            <>
              <p className="font-semibold">
                Email:
              </p>

              <p className="text-gray-600">
                {user.email}
              </p>
            </>

          ) : (

            <p>
              Please login to view profile.
            </p>

          )
        }

      </div>

    </main>

  );
}
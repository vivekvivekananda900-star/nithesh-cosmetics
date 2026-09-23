"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/app/lib/supabase";

import {
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      setLoading(true);

      /* =========================
         CHECK AUTH USER
      ========================= */

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        router.replace(
          "/admin/login"
        );

        return;
      }

      /* =========================
         CHECK ADMIN ROLE
      ========================= */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq("uuid", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Admin role check error:",
          profileError
        );

        router.replace(
          "/admin/login"
        );

        return;
      }

      if (
        profile?.role !==
        "admin"
      ) {
        await supabase.auth.signOut();

        router.replace(
          "/admin/login"
        );

        return;
      }

      setAuthorized(true);
    } catch (error) {
      console.error(
        "Admin guard error:",
        error
      );

      router.replace(
        "/admin/login"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          bg-gradient-to-br
          from-gray-950
          via-gray-900
          to-black
          px-4
          text-white
        "
      >
        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-32
            top-20
            h-80
            w-80
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            bottom-20
            h-80
            w-80
            rounded-full
            bg-amber-500/10
            blur-3xl
          "
        />

        <div className="relative z-10 text-center">

          <div
            className="
              relative
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
            "
          >
            <div
              className="
                absolute
                inset-0
                animate-spin
                rounded-[24px]
                border-2
                border-transparent
                border-t-orange-500
                border-r-orange-500
              "
            />

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-white/5
                text-orange-400
                backdrop-blur-xl
              "
            >
              <ShieldCheck
                size={27}
              />
            </div>
          </div>

          <p
            className="
              mt-5
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              text-orange-400
            "
          >
            Nithesh Cosmetics
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-black
              sm:text-2xl
            "
          >
            Verifying Admin Access
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-400
            "
          >
            Checking secure admin credentials...
          </p>

        </div>
      </main>
    );
  }

  /* =========================
     NOT AUTHORIZED
  ========================= */

  if (!authorized) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gray-950
          px-4
          text-white
        "
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-red-500/10
              text-red-400
            "
          >
            <LockKeyhole
              size={28}
            />
          </div>

          <p className="mt-4 font-bold">
            Access Denied
          </p>

        </div>
      </main>
    );
  }

  return <>{children}</>;
}
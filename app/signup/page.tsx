"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (name.trim().length < 2) {
      alert("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      /* =========================
         CREATE AUTH USER
      ========================= */

      const { data, error } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,

          options: {
            data: {
              name: name.trim(),
            },
          },
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          "User account could not be created."
        );
      }

      /* =========================
         CHECK SESSION
      ========================= */

      const { data: sessionData } =
        await supabase.auth.getSession();

      /*
        If email confirmation is enabled,
        Supabase may create the auth user
        without returning an active session.
      */

      if (!sessionData.session) {
        alert(
          "âœ… Account created!\n\nPlease check your email and verify your account before logging in."
        );

        router.push("/login");

        return;
      }

      /* =========================
         CREATE PROFILE
      ========================= */

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .insert({
          uuid: data.user.id,

          name: name.trim(),

          email: email.trim(),

          role: "user",
        });

      if (profileError) {
        throw profileError;
      }

      alert(
        "âœ… Account Created Successfully"
      );

      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }

  const passwordStrong =
    password.length >= 6;

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
        from-[#fffaf5]
        via-[#fff3e9]
        to-[#fff8f3]
        px-4
        py-10
      "
    >
      {/* =========================
          ANIMATED BACKGROUND
      ========================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            signup-blob-one
            absolute
            -left-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-orange-300/30
            blur-3xl
          "
        />

        <div
          className="
            signup-blob-two
            absolute
            -right-28
            top-1/3
            h-80
            w-80
            rounded-full
            bg-rose-300/25
            blur-3xl
          "
        />

        <div
          className="
            signup-blob-three
            absolute
            -bottom-28
            left-1/3
            h-80
            w-80
            rounded-full
            bg-amber-200/30
            blur-3xl
          "
        />

        <Sparkles
          size={22}
          className="
            sparkle-one
            absolute
            left-[10%]
            top-[18%]
            text-orange-300
          "
        />

        <Sparkles
          size={18}
          className="
            sparkle-two
            absolute
            right-[12%]
            top-[14%]
            text-rose-300
          "
        />

        <Sparkles
          size={20}
          className="
            sparkle-three
            absolute
            bottom-[15%]
            right-[17%]
            text-orange-300
          "
        />

      </div>

      {/* =========================
          SIGNUP CONTAINER
      ========================== */}

      <div
        className="
          signup-card
          relative
          z-10
          w-full
          max-w-md
        "
      >
        {/* Brand */}

        <div className="mb-6 text-center">

          <div
            className="
              brand-icon
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-[26px]
              bg-gradient-to-br
              from-orange-500
              to-amber-400
              text-white
              shadow-[0_15px_40px_rgba(249,115,22,0.28)]
            "
          >
            <Sparkles size={34} />
          </div>

          <p
            className="
              mt-5
              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]
              text-orange-500
              sm:text-xs
            "
          >
            Nithesh Cosmetics
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-black
              tracking-tight
              text-gray-900
              sm:text-4xl
            "
          >
            Create Account
          </h1>

          <p
            className="
              mx-auto
              mt-2
              max-w-xs
              text-sm
              leading-6
              text-gray-500
            "
          >
            Join Nithesh Cosmetics and discover
            premium beauty products made for you.
          </p>

        </div>

        {/* =========================
            FORM
        ========================== */}

        <form
          onSubmit={handleSignup}
          className="
            rounded-[30px]
            border
            border-white/80
            bg-white/95
            p-5
            shadow-[0_25px_70px_rgba(15,23,42,0.12)]
            backdrop-blur-xl
            sm:p-8
          "
        >
          {/* Secure badge */}

          <div className="mb-6 flex justify-center">

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-green-100
                bg-green-50
                px-4
                py-2
                text-xs
                font-bold
                text-green-700
              "
            >
              <ShieldCheck size={15} />

              Secure Registration
            </div>

          </div>

          {/* =========================
              NAME
          ========================== */}

          <div className="mb-4">

            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-gray-600
              "
            >
              Full Name
            </label>

            <div className="group relative">

              <User
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  transition-colors
                  group-focus-within:text-orange-500
                "
              />

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                autoComplete="name"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-4
                  pl-12
                  pr-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-gray-400
                  hover:border-orange-200
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                  sm:text-base
                "
              />

            </div>

          </div>

          {/* =========================
              EMAIL
          ========================== */}

          <div className="mb-4">

            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-gray-600
              "
            >
              Email Address
            </label>

            <div className="group relative">

              <Mail
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  transition-colors
                  group-focus-within:text-orange-500
                "
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-4
                  pl-12
                  pr-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-gray-400
                  hover:border-orange-200
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                  sm:text-base
                "
              />

            </div>

          </div>

          {/* =========================
              PASSWORD
          ========================== */}

          <div>

            <label
              className="
                mb-2
                block
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-gray-600
              "
            >
              Password
            </label>

            <div className="group relative">

              <LockKeyhole
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  transition-colors
                  group-focus-within:text-orange-500
                "
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
                minLength={6}
                autoComplete="new-password"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  py-4
                  pl-12
                  pr-12
                  text-sm
                  text-gray-900
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-gray-400
                  hover:border-orange-200
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                  sm:text-base
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  rounded-lg
                  p-1
                  text-gray-400
                  transition-all
                  hover:bg-orange-50
                  hover:text-orange-500
                "
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

            {/* Password Strength */}

            <div
              className="
                mt-3
                rounded-2xl
                bg-gray-50
                p-3
              "
            >
              <div className="flex items-center justify-between">

                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Password Security
                </span>

                <span
                  className={`text-[10px] font-black ${
                    passwordStrong
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {passwordStrong
                    ? "Good"
                    : `${password.length}/6`}
                </span>

              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">

                <div
                  className={`
                    h-full
                    rounded-full
                    transition-all
                    duration-500

                    ${
                      password.length ===
                      0
                        ? "w-0"
                        : password.length <
                          6
                        ? "w-1/2 bg-orange-400"
                        : "w-full bg-green-500"
                    }
                  `}
                />

              </div>

              <div className="mt-2 flex items-center gap-1.5">

                <div
                  className={`
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full

                    ${
                      passwordStrong
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }
                  `}
                >
                  <Check
                    size={10}
                    strokeWidth={3}
                  />
                </div>

                <p className="text-[10px] text-gray-500">
                  Minimum 6 characters
                </p>

              </div>

            </div>

          </div>

          {/* =========================
              CREATE BUTTON
          ========================== */}

          <button
            type="submit"
            disabled={loading}
            className="
              group
              relative
              mt-6
              flex
              min-h-14
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-orange-500
              via-orange-500
              to-amber-500
              px-6
              py-4
              text-base
              font-black
              text-white
              shadow-[0_14px_35px_rgba(249,115,22,0.30)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_42px_rgba(249,115,22,0.38)]
              active:scale-[0.98]
              disabled:pointer-events-none
              disabled:opacity-70
            "
          >
            {/* Shine */}

            <span
              className="
                absolute
                inset-y-0
                -left-20
                w-16
                rotate-12
                bg-white/30
                blur-md
                transition-all
                duration-700
                group-hover:left-[120%]
              "
            />

            {loading ? (
              <>
                <span
                  className="
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />

                Creating Account...
              </>
            ) : (
              <>
                Create Account

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  â†’
                </span>
              </>
            )}

          </button>

          {/* Divider */}

          <div className="my-6 flex items-center gap-3">

            <div className="h-px flex-1 bg-gray-100" />

            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Already a member?
            </span>

            <div className="h-px flex-1 bg-gray-100" />

          </div>

          {/* Login */}

          <Link
            href="/login"
            className="
              flex
              min-h-13
              w-full
              items-center
              justify-center
              rounded-2xl
              border
              border-orange-200
              bg-orange-50
              px-5
              py-3.5
              text-sm
              font-bold
              text-orange-600
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-orange-300
              hover:bg-orange-100
              active:scale-[0.98]
            "
          >
            Login to Existing Account
          </Link>

        </form>

        {/* Footer */}

        <p
          className="
            mt-6
            text-center
            text-[11px]
            leading-5
            text-gray-400
          "
        >
          By creating an account, you agree to
          Nithesh Cosmetics terms and privacy policy.
        </p>

      </div>

      {/* =========================
          ANIMATIONS
      ========================== */}

      

    </main>
  );
}

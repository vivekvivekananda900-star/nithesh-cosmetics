"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /* =========================
     LOGIN
  ========================= */

  async function handleLogin(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage(
        "Please enter your email address."
      );

      return;
    }

    if (!password) {
      setErrorMessage(
        "Please enter your password."
      );

      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: cleanEmail,
            password,
          }
        );

      if (error) {
        const message =
          error.message
            ?.toLowerCase()
            .trim() || "";

        if (
          message.includes(
            "invalid login credentials"
          )
        ) {
          setErrorMessage(
            "Incorrect email or password."
          );

          return;
        }

        setErrorMessage(
          "Login failed. Please check your email and password."
        );

        return;
      }

      const user =
        data.user;

      if (!user) {
        setErrorMessage(
          "Login failed. Please try again."
        );

        return;
      }

      /* =========================
         GET USER ROLE
      ========================= */

      const {
        data: profile,
        error:
          profileError,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq(
          "uuid",
          user.id
        )
        .maybeSingle();

      if (profileError) {
        console.error(
          "Profile role error:",
          profileError
        );
      }

      /* =========================
         REDIRECT
      ========================= */

      if (
        profile?.role ===
        "admin"
      ) {
        router.replace(
          "/admin"
        );
      } else {
        router.replace("/");
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

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
        via-[#fff3e8]
        to-[#fff8f3]
        px-4
        py-10
      "
    >
      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-24
            -top-20
            h-72
            w-72
            rounded-full
            bg-orange-300/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-24
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
            absolute
            bottom-[-100px]
            left-1/3
            h-80
            w-80
            rounded-full
            bg-yellow-200/30
            blur-3xl
          "
        />

        <Sparkles
          size={24}
          className="
            absolute
            left-[12%]
            top-[20%]
            animate-pulse
            text-orange-300
          "
        />

        <Sparkles
          size={18}
          className="
            absolute
            right-[12%]
            top-[15%]
            animate-pulse
            text-rose-300
          "
        />

        <Sparkles
          size={20}
          className="
            absolute
            bottom-[15%]
            right-[18%]
            animate-pulse
            text-orange-300
          "
        />
      </div>

      {/* Main Card */}

      <div
        className="
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
            <Sparkles
              size={34}
            />
          </div>

          <p
            className="
              mt-5
              text-[11px]
              font-black
              uppercase
              tracking-[0.22em]
              text-orange-500
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
            Welcome Back
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
            Sign in to continue
            shopping for your
            favourite beauty
            products.
          </p>
        </div>

        {/* Login Form */}

        <form
          onSubmit={
            handleLogin
          }
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

          <div
            className="
              mb-6
              flex
              justify-center
            "
          >
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
              <ShieldCheck
                size={15}
              />

              Secure Login
            </div>
          </div>

          {/* Error */}

          {errorMessage && (
            <div
              className="
                mb-5
                flex
                items-start
                gap-3
                rounded-2xl
                border
                border-red-100
                bg-red-50
                p-4
              "
            >
              <AlertCircle
                size={20}
                className="
                  mt-0.5
                  shrink-0
                  text-red-500
                "
              />

              <div>
                <p
                  className="
                    text-sm
                    font-bold
                    text-red-700
                  "
                >
                  Login Error
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-red-600
                  "
                >
                  {
                    errorMessage
                  }
                </p>
              </div>
            </div>
          )}

          {/* Email */}

          <div className="mb-4">
            <label
              htmlFor="email"
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
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(
                    e.target.value
                  );

                  setErrorMessage(
                    ""
                  );
                }}
                required
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

          {/* Password */}

          <div className="mb-2">
            <label
              htmlFor="password"
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
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                value={
                  password
                }
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  );

                  setErrorMessage(
                    ""
                  );
                }}
                required
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
                    (
                      previous
                    ) =>
                      !previous
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
                  <EyeOff
                    size={
                      19
                    }
                  />
                ) : (
                  <Eye
                    size={
                      19
                    }
                  />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}

          <div
            className="
              mb-6
              flex
              justify-end
            "
          >
            <Link
              href="/forgot-password"
              className="
                text-xs
                font-bold
                text-orange-500
                transition-all
                hover:text-orange-600
                hover:underline
              "
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="
              group
              relative
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
              hover:-translate-y-0.5
              hover:shadow-[0_18px_42px_rgba(249,115,22,0.38)]
              active:scale-[0.98]
              disabled:pointer-events-none
              disabled:opacity-70
            "
          >
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

                Logging in...
              </>
            ) : (
              <>
                Login

                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </>
            )}
          </button>

          {/* Divider */}

          <div
            className="
              my-6
              flex
              items-center
              gap-3
            "
          >
            <div className="h-px flex-1 bg-gray-100" />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-gray-400
              "
            >
              New Customer?
            </span>

            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Signup */}

          <Link
            href="/signup"
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
            Create New Account
          </Link>
        </form>

        <p
          className="
            mt-6
            text-center
            text-[11px]
            leading-5
            text-gray-400
          "
        >
          Nithesh Cosmetics •
          Secure Customer Login
        </p>
      </div>
    </main>
  );
}
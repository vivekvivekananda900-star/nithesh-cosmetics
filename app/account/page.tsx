"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Gift,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
    setLoading(false);
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await supabase.auth.signOut();

      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf5] via-white to-[#fff1e8]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf5] via-[#fff7f0] to-white pb-28 text-gray-900">

      {/* Background Glow */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute -right-32 top-[500px] h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />
      </div>

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-30 border-b border-gray-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-4 sm:px-6">

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500 sm:text-xs">
              Nithesh Cosmetics
            </p>

            <h1 className="mt-0.5 text-xl font-black tracking-tight sm:text-2xl">
              My Account
            </h1>
          </div>

        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-3 py-5 sm:px-6 sm:py-8">

        {/* ================= PROFILE CARD ================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-orange-100
            bg-gradient-to-br
            from-orange-500
            via-orange-500
            to-amber-400
            p-5
            text-white
            shadow-[0_18px_50px_rgba(249,115,22,0.25)]
            sm:rounded-[34px]
            sm:p-7
          "
        >

          {/* Decorative Circles */}

          <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10 blur-xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-yellow-200/15 blur-2xl" />

          <div className="relative z-10">

            <div className="mb-5 flex items-center justify-between">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-md sm:text-xs">
                <Sparkles size={13} />
                Premium Member
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                <ShieldCheck size={19} />
              </div>

            </div>

            <div className="flex items-center gap-4 sm:gap-5">

              {/* Avatar */}

              <div
                className="
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-[24px]
                  border
                  border-white/30
                  bg-white/20
                  shadow-lg
                  backdrop-blur-xl
                  sm:h-24
                  sm:w-24
                  sm:rounded-[28px]
                "
              >
                <User
                  size={40}
                  strokeWidth={1.8}
                />
              </div>

              {/* Details */}

              <div className="min-w-0 flex-1">

                <p className="text-xs font-medium text-white/75">
                  Welcome back
                </p>

                <h2 className="mt-1 truncate text-xl font-black sm:text-2xl">
                  {user?.user_metadata?.name || "Customer"}
                </h2>

                <p className="mt-1 truncate text-xs text-white/85 sm:text-sm">
                  {user?.email}
                </p>

                <p className="mt-1 text-xs text-white/85 sm:text-sm">
                  {user?.user_metadata?.phone || "Phone not added"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ================= QUICK ACCOUNT TITLE ================= */}

        <div className="mb-3 mt-7 flex items-end justify-between px-1 sm:mt-9">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
              Account
            </p>

            <h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
              Manage Your Account
            </h2>
          </div>

        </div>

        {/* ================= MENU ================= */}

        <div
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-gray-100
            bg-white
            shadow-[0_12px_45px_rgba(15,23,42,0.06)]
            sm:rounded-[32px]
          "
        >
          <MenuItem
            icon={<Package size={20} />}
            title="My Orders"
            subtitle="Track and view your orders"
            href="/orders"
            iconClass="bg-blue-50 text-blue-600"
          />

          <MenuItem
            icon={<Heart size={20} />}
            title="Wishlist"
            subtitle="Your favourite products"
            href="/wishlist"
            iconClass="bg-rose-50 text-rose-500"
          />

          <MenuItem
            icon={<MapPin size={20} />}
            title="My Addresses"
            subtitle="Manage delivery addresses"
            href="/addresses"
            iconClass="bg-orange-50 text-orange-600"
          />

          <MenuItem
            icon={<CreditCard size={20} />}
            title="Payment Methods"
            subtitle="Manage your payment options"
            href="/payments"
            iconClass="bg-green-50 text-green-600"
          />

          <MenuItem
            icon={<Bell size={20} />}
            title="Notifications"
            subtitle="Manage alerts and updates"
            href="/notifications"
            iconClass="bg-violet-50 text-violet-600"
          />

          <MenuItem
            icon={<Gift size={20} />}
            title="Offers & Coupons"
            subtitle="View available discounts"
            href="/offers"
            iconClass="bg-amber-50 text-amber-600"
          />

          <MenuItem
            icon={<Settings size={20} />}
            title="Account Settings"
            subtitle="Update your account preferences"
            href="/settings"
            iconClass="bg-gray-100 text-gray-700"
          />

          <MenuItem
            icon={<HelpCircle size={20} />}
            title="Help & Support"
            subtitle="We're here to help you"
            href="/help"
            iconClass="bg-cyan-50 text-cyan-600"
          />
        </div>

        {/* ================= LOGOUT ================= */}

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            mt-5
            flex
            min-h-14
            w-full
            items-center
            justify-between
            rounded-[22px]
            border
            border-red-100
            bg-white
            px-4
            py-3
            text-red-500
            shadow-[0_8px_25px_rgba(15,23,42,0.04)]
            transition-all
            duration-300
            hover:border-red-200
            hover:bg-red-50
            active:scale-[0.99]
            disabled:opacity-60
            sm:px-5
          "
        >
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50">
              <LogOut size={19} />
            </div>

            <div className="text-left">

              <p className="text-sm font-bold sm:text-base">
                {loggingOut ? "Logging out..." : "Logout"}
              </p>

              <p className="mt-0.5 text-[10px] text-red-400 sm:text-xs">
                Sign out from your account
              </p>

            </div>

          </div>

          <ChevronRight size={18} />
        </button>

        {/* ================= APP INFO ================= */}

        <div className="mt-7 text-center">

          <p className="text-xs font-semibold text-gray-400">
            Nithesh Cosmetics
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            Version 1.0.0
          </p>

        </div>

      </div>
    </main>
  );
}

/* ================= MENU ITEM ================= */

function MenuItem({
  icon,
  title,
  subtitle,
  href,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  iconClass: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        items-center
        justify-between
        border-b
        border-gray-100
        px-4
        py-4
        transition-all
        duration-300
        last:border-b-0
        hover:bg-orange-50/40
        active:bg-orange-50
        sm:px-5
      "
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            transition-transform
            duration-300
            group-hover:scale-105
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs">
            {subtitle}
          </p>

        </div>

      </div>

      <ChevronRight
        size={18}
        className="shrink-0 text-gray-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange-500"
      />
    </Link>
  );
}
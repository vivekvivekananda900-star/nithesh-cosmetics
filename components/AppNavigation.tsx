"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";

export default function AppNavigation() {
  const pathname = usePathname();

  const hiddenRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
  ];

  const shouldHide =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/admin");

  if (shouldHide) {
    return null;
  }

  return <BottomNavigation />;
}
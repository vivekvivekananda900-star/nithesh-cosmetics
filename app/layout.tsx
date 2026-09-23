import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

import { CartProvider } from "./context/CartContext";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AppNavigation from "@/components/AppNavigation";

export const metadata: Metadata = {
  title: {
    default:
      "Nithesh Cosmetics | Premium Beauty & Barber Products",
    template:
      "%s | Nithesh Cosmetics",
  },

  description:
    "Shop premium cosmetics, professional barber tools, skincare and beauty products at Nithesh Cosmetics.",

  keywords: [
    "Nithesh Cosmetics",
    "Barber Products",
    "Cosmetics Store",
    "Beauty Products",
    "Salon Accessories",
    "Professional Barber Tools",
    "Skincare Products",
  ],

  verification: {
    google:
      "pWtGfiF52iPtZYPNjLkqeGmXyDZrjIuB3SiGFpwASPA",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className="
          min-h-screen
          overflow-x-hidden
          bg-white
          text-gray-900
          antialiased
          selection:bg-orange-200
          selection:text-orange-950
        "
      >
        <CartProvider>

          {children}

          <AppNavigation />

        </CartProvider>

        <FloatingWhatsApp />

      </body>
    </html>
  );
}
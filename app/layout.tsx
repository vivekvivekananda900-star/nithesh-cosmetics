import type { Metadata, Viewport } from "next";
import "./globals.css";

import { CartProvider } from "./context/CartContext";

import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BottomNavigation from "@/components/BottomNavigation";

export const metadata: Metadata = {
  title: "Nithesh Cosmetics | Premium Beauty & Barber Products",

  description:
    "Shop premium cosmetics, professional barber tools, skincare and beauty products at Nithesh Cosmetics.",

  keywords: [
    "Nithesh Cosmetics",
    "Barber Products",
    "Cosmetics Store",
    "Beauty Products",
    "Salon Accessories",
  ],

  verification: {
    google: "pWtGfiF52iPtZYPNjLkqeGmXyDZrjIuB3SiGFpwASPA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      <head>
        <meta
          name="color-scheme"
          content="light dark"
        />
      </head>

      <body className="page">

        <CartProvider>

          {children}

          <BottomNavigation />

        </CartProvider>

        <FloatingWhatsApp />

      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import BottomNavigation from "@/components/BottomNavigation";

export const metadata: Metadata = {
  title: "Nithesh Cosmetics",
  description: "Barber & Cosmetics Products Store",
  verification: {
    google: "pWtGfiF52iPtZYPNjLkqeGmXyDZrjIuB3SiGFpwASPA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <head>
        <meta name="color-scheme" content="light" />
      </head>

      <body>

        <CartProvider>

          {children}

          <BottomNavigation />

        </CartProvider>


        <FloatingWhatsApp />

      </body>

    </html>
  );
}
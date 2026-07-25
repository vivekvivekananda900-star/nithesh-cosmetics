"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function TestPage() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    async function test() {
      const { error } = await supabase.from("products").select("*").limit(1);

      if (error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("✅ Supabase Connected Successfully");
      }
    }

    test();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-2xl font-bold">
      {message}
    </div>
  );
}
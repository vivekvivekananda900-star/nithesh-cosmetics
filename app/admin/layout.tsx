import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  // Allow admin login page
  if (!user) {
    return <>{children}</>;
  }


  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("uuid", user.id)
    .maybeSingle();


  if (error || profile?.role !== "admin") {
    redirect("/");
  }


  return (
    <>
      {children}
    </>
  );
}
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";


const supabaseUrl =
  "https://ybhqjwybkhzygfbntkax.supabase.co";


const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliaHFqd3lia2h6eWdmYm50a2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjQ1NTIsImV4cCI6MjEwMDQ0MDU1Mn0.r992Ktx8qj-XJaiazLZ_VczWtzK9sqlz58qJCzfDi2w";


export async function createClient() {

  const cookieStore = await cookies();


  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {

        getAll() {
          return cookieStore.getAll();
        },


        setAll(cookiesToSet) {

          try {

            cookiesToSet.forEach(
              ({ name, value, options }) => {

                cookieStore.set(
                  name,
                  value,
                  options
                );

              }
            );

          } catch {}

        },

      },
    }
  );
}
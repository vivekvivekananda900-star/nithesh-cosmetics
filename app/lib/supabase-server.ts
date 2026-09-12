import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";


const supabaseUrl =
  "https://yjamlvxpmczmwyyakmrt.supabase.co/rest/v1/";


const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYW1sdnhwbWN6bXd5eWFrbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNDEyMzAsImV4cCI6MjEwNDcxNzIzMH0.2hSij0Eg3EYNXlIvPU9kHxWHVXLdKrBy7ZWqcKuO0PQ";


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
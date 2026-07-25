import { createClient } from "@supabase/supabase-js";


const supabaseUrl =
"https://ybhqjwybkhzygfbntkax.supabase.co";


const supabaseAnonKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliaHFqd3lia2h6eWdmYm50a2F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjQ1NTIsImV4cCI6MjEwMDQ0MDU1Mn0.r992Ktx8qj-XJaiazLZ_VczWtzK9sqlz58qJCzfDi2w";


export const supabase =
createClient(
  supabaseUrl,
  supabaseAnonKey
);
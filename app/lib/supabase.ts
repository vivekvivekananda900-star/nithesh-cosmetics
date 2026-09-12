import { createClient } from "@supabase/supabase-js";


const supabaseUrl =
"https://yjamlvxpmczmwyyakmrt.supabase.co";


const supabaseAnonKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYW1sdnhwbWN6bXd5eWFrbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNDEyMzAsImV4cCI6MjEwNDcxNzIzMH0.2hSij0Eg3EYNXlIvPU9kHxWHVXLdKrBy7ZWqcKuO0PQ";


export const supabase =
createClient(
  supabaseUrl,
  supabaseAnonKey
);
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pjegwrjxooaemxlpkwxy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Thiếu cấu hình Supabase URL hoặc Anon Key!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

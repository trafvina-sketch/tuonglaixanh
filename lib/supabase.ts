import { createClient } from "@supabase/supabase-js";

const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZGpjaWxuZWJ6cXd5Ymh3ZHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzI4ODgsImV4cCI6MjEwNTgwODg4OH0.XjHWn949gqoQUl9Z_M7D_BIhVwYlL-SS7tPhXa7Acec";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://drdjcilnebzqwybhwdvi.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Thiếu cấu hình Supabase URL hoặc Anon Key trong process.env, sử dụng fallback dự phòng!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from "@supabase/supabase-js";

const FALLBACK_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZGpjaWxuZWJ6cXd5Ymh3ZHZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDIzMjg4OCwiZXhwIjoyMTA1ODA4ODg4fQ.sAvAsCW4PqqGK85TOFdprGpEufj_73M-PGynF9XRmR4";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://drdjcilnebzqwybhwdvi.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SERVICE_KEY;

// Chỉ sử dụng ở Server Components hoặc API Route Handlers (Tuyệt đối không rò rỉ ra Client)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});


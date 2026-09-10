import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this file from a "use client" component --
// it uses the service role key, which bypasses Row Level Security
// entirely. Only use it in API routes / server components.
//
// Add SUPABASE_SERVICE_ROLE_KEY to .env.local and your Vercel env vars
// (Supabase -> Project Settings -> API -> service_role key). Do NOT
// prefix it with NEXT_PUBLIC_.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local and your Vercel project env vars (server-only, no NEXT_PUBLIC_ prefix)."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

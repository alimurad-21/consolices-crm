import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client — used in server components and API routes
// Reads auth cookies so queries run as the logged-in user
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from a Server Component where
            // cookies can't be mutated — safe to ignore.
          }
        },
      },
    }
  );
}

// Alias so existing imports keep working
export { createServerSupabaseClient as createServerClient };

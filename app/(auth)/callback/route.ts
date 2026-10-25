import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      const cookieStore = await cookies();
      cookieStore.set(
        "apparchar_session",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email || "",
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "Usuario Parche",
          role: data.user.user_metadata?.role || "user",
          authenticatedAt: new Date().toISOString(),
        }),
        {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        }
      );
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si falló la autenticación con OAuth, redirige a login con mensaje
  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}

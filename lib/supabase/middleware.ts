import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

/**
 * Actualiza la sesión de Supabase y gestiona la redirección de rutas protegidas y de autenticación.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Si las credenciales aún no están configuradas (placeholder), permitimos el paso en desarrollo
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder")) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresca la sesión si ha expirado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginOrRegister =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublicOrAuthRoute =
    isLoginOrRegister ||
    pathname.startsWith("/callback") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/join") ||
    pathname.startsWith("/invite");

  // Si no está autenticado y no es ruta pública/auth, redirige al login
  if (!user && !isPublicOrAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si ya tiene sesión activa y accede a login o register, redirigir al destino pendiente o a inicio
  if (user && isLoginOrRegister) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const url = request.nextUrl.clone();
    if (redirectParam && redirectParam.startsWith("/")) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

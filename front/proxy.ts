import { NextResponse, type NextRequest } from "next/server";

/**
 * ===================================================================
 * Route Guard / Auth Guard - Next.js Proxy
 * Ubicación: front/proxy.ts
 *
 * Controla el acceso a rutas privadas, permite rutas públicas,
 * y habilita el acceso híbrido a enlaces de invitación compartidos.
 * ===================================================================
 */

// 1. Rutas Públicas (Autenticación y recuperación)
const PUBLIC_PREFIXES = ["/login", "/register", "/recuperar", "/callback"];

// 2. Rutas Híbridas / Enlaces de Invitación Compartidos (Accesibles sin login)
const HYBRID_PREFIXES = ["/join", "/invite", "/api/health"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = request.cookies.get("apparchar_session");
  const isAuthenticated = !!sessionCookie?.value;

  // Comprueba si la ruta es pública
  const isPublicRoute = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Comprueba si la ruta es de invitación compartida o híbrida
  const isHybridRoute = HYBRID_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // -------------------------------------------------------------
  // CASO 1: Usuario NO autenticado intentando entrar a ruta privada
  // -------------------------------------------------------------
  if (!isAuthenticated && !isPublicRoute && !isHybridRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    
    // Preservar la URL de destino completa para redirección posterior al login
    const targetUrl = `${pathname}${search}`;
    loginUrl.searchParams.set("redirect", targetUrl);
    loginUrl.searchParams.set("reason", "unauthorized");

    return NextResponse.redirect(loginUrl);
  }

  // -------------------------------------------------------------
  // CASO 2: Usuario autenticado navegando hacia login o registro
  // -------------------------------------------------------------
  if (isAuthenticated && isPublicRoute && !pathname.startsWith("/callback")) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const destinationUrl = request.nextUrl.clone();

    // Si venía con intención de ir a una invitación o pantalla específica, lo enviamos allá
    if (redirectParam && redirectParam.startsWith("/")) {
      destinationUrl.pathname = redirectParam;
      destinationUrl.search = "";
    } else {
      destinationUrl.pathname = "/";
      destinationUrl.search = "";
    }

    return NextResponse.redirect(destinationUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * ponytail: sem backend ainda. A raiz "/" só precisa mandar o visitante pro
 * login, mas fazer isso com `redirect()` dentro de uma page server-component
 * dispara um `NEXT_REDIRECT` no render que o dev overlay do Next 16 reporta
 * como erro. Resolver na borda (proxy) redireciona antes de renderizar
 * qualquer segmento — sem ruído no terminal.
 *
 * Quando o guard de rota de verdade entrar, é aqui que ele cresce: checar o
 * cookie de sessão e mandar quem não estiver logado pro /login.
 */
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: "/",
};

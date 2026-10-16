"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import * as React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ModalProvider } from "./modal/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Instância por montagem, não em escopo de módulo: este componente também
  // renderiza no servidor, e um QueryClient de módulo seria compartilhado
  // entre requisições — o cache de um usuário vazaria para o próximo.
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
          <ModalProvider />
        </ThemeProvider>
      </TooltipProvider>
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

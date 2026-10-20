import type { Metadata } from "next";

import { BrandLogo } from "@/components/brand-logo";
import { CorporateLogo } from "@/components/corporate-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginBackground } from "@/components/ui/login-background";
import { Separator } from "@/components/ui/separator";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <LoginBackground />

      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Entrada só no card, sem escalonar os filhos: o formulário tem
          `autoFocus` no e-mail, então quem usa isso todo dia já está digitando
          antes de a animação terminar. Atraso por elemento atrasaria o campo
          além do dedo — atrito diário em troca de um charme visto uma vez.

          Só o deslocamento está atrás de `motion-safe`. As utilities
          `fade-in`/`slide-in-*` apenas setam variáveis que o keyframe `enter`
          lê, então remover `slide-in-from-bottom-2` tira o movimento e deixa o
          fade de pé: com movimento reduzido o card faz cross-fade no lugar.
          Fundo em movimento + card subindo é exatamente o par que incomoda
          quem desligou animação. */}
      <Card className="relative z-10 w-full max-w-sm animate-in bg-card/95 fade-in backdrop-blur duration-500 motion-safe:slide-in-from-bottom-2">
        <div className="flex items-center justify-center gap-5 px-(--card-spacing)">
          <BrandLogo />
          <Separator
            orientation="vertical"
            className="h-8 data-vertical:self-center"
          />
          <CorporateLogo className="ml-1" />
        </div>

        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="font-heading text-xl font-medium text-balance">
              Que bom ter você de volta!
            </h1>
          </CardTitle>
          <CardDescription>Entre com suas credenciais do 1one.</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Made with ♥️ by 360multi
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

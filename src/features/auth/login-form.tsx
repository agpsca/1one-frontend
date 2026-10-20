"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, KeyRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const loginSchema = z.object({
  email: z.email("Informe um e-mail valido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginSchema = z.infer<typeof loginSchema>;

/**
 * Credenciais + validacao de formato no cliente.
 *
 * ponytail: porta destrancada. Não há backend, sessão nem guard de rota — o
 * submit só confere o formato dos campos e navega. Qualquer e-mail e qualquer
 * senha entram, e /home é alcançável digitando a URL. É o combinado pra
 * destravar a navegação; tem que cair antes do primeiro dado real na tela.
 *
 * Quando o login de verdade entrar, é aqui que ele encaixa: a chamada vai pra
 * `features/auth/auth.api.ts`, o erro volta num `Callout` `destructive` dentro
 * do formulário (não em toast — a mensagem precisa ficar na tela enquanto o
 * usuário corrige o campo) e o resto deste componente não muda.
 */
export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // `isNavigating` fica true do push até o /home commitar — é o tempo real da
  // navegação (payload RSC do segmento, que é `instant = false`), não um timer.
  // Quando o login de verdade entrar, a chamada vai dentro desta transition e
  // a cortina passa a cobrir rede + navegação sem mudar nada aqui.
  const [isNavigating, startNavigation] = useTransition();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { errors, isSubmitting } = form.formState;
  const busy = isSubmitting || isNavigating;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(() => {
        startNavigation(() => {
          router.push("/home");
        });
      })}
    >
      <FieldGroup>
        <Field data-invalid={errors.email ? "true" : undefined}>
          <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="voce@exemplo.com"
            aria-invalid={!!errors.email}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={errors.password ? "true" : undefined}>
          <div className="flex items-center">
            <FieldLabel htmlFor="login-password">Senha</FieldLabel>
            {/* TODO: apontar pro fluxo de recuperacao quando ele existir.
                Até lá é `aria-disabled`, e não `disabled`: botão realmente
                desabilitado não recebe evento de ponteiro, e o Tooltip do
                Radix nunca abriria — o usuário clicaria no nada sem nenhuma
                explicação. Assim continua focável, o leitor de tela anuncia
                como desabilitado e o "Em breve" aparece. Não tem `onClick`,
                então não há o que barrar. */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-disabled
                  className="group ml-auto flex cursor-not-allowed items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {/* O Dark Reader reescreve `stroke` em SVG antes da
                      hidratação (`data-darkreader-inline-stroke`) e o React
                      acusa atributo divergente. Ícone decorativo e
                      `aria-hidden`: não tem estado nenhum cujo descasamento
                      importasse, então suprimir aqui não esconde bug. Só vale
                      para ícone presente no HTML inicial — a checagem de
                      hidratação não alcança o que monta depois. */}
                  <KeyRoundIcon
                    aria-hidden
                    suppressHydrationWarning
                    className="size-3.5 transition-transform group-hover:-rotate-12"
                  />
                  <span>Recuperar senha</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Em breve</TooltipContent>
            </Tooltip>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              aria-invalid={!!errors.password}
              className="pr-10"
              {...form.register("password")}
            />
            {/* Centrado por `inset-y-0 my-auto`, não por `-translate-y-1/2`:
                o Button tem `active:translate-y-px`, que no clique sobrescreve
                o translate e faria o olho pular pro topo do campo. */}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute inset-y-0 right-1 my-auto text-muted-foreground"
            >
              {/* só o olho fechado está no HTML inicial, então é só ele que a
                  checagem de hidratação alcança — ver o comentário acima */}
              {showPassword ? (
                <EyeOffIcon aria-hidden />
              ) : (
                <EyeIcon aria-hidden suppressHydrationWarning />
              )}
            </Button>
          </div>

          <FieldError errors={[errors.password]} />
        </Field>

        <Field>
          <Button type="submit" disabled={busy}>
            {busy ? "Entrando..." : "Entrar"}
          </Button>
        </Field>
      </FieldGroup>

      {/* Cortina da transição login → /home.

          Vai pro body por portal, não aqui na árvore: o Card tem
          `overflow-hidden` e ganha transform/filter durante a animação de
          entrada, e qualquer uma das duas coisas transforma um `fixed` filho
          em algo clipado ou ancorado no card em vez da viewport. O portal
          tira a cortina de baixo desse acoplamento — ela não depende de
          nenhum ancestral.

          Por que não há `typeof document` guard: `isNavigating` só pode ser
          true depois de um submit, então este galho nunca roda no servidor.

          O `delay-150 fill-mode-backwards` é o anti-flash, e é o motivo de
          não haver timer nenhum neste componente: o keyframe `enter` começa
          em opacity 0 e `backwards` mantém esse estado durante o atraso, então
          navegação que commita rápido desmonta a cortina antes de ela ter
          pintado um pixel. Quem vê a cortina é só quem tinha espera de fato.

          A cortina é véu, não tela nova: o `LoginBackground` continua montado
          embaixo e o `backdrop-blur` desfoca o gradiente dele ainda em
          movimento. Um segundo <Grainient> aqui custaria outro contexto WebGL
          e entraria com outra semente — corte visível, não continuidade.

          Fade sem `motion-safe` por ser opacidade pura, igual ao resto desta
          tela; o `animate-pulse` do logo também só mexe em opacidade. */}
      {isNavigating &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex animate-in flex-col items-center justify-center gap-4 bg-brand-dark-green/85 fade-in backdrop-blur-sm delay-150 duration-300 fill-mode-backwards"
          >
            <BrandLogo className="h-12 animate-pulse" />
            <p className="text-sm text-neutral-white/80">Entrando...</p>
          </div>,
          document.body,
        )}
    </form>
  );
}

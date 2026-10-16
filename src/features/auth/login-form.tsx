"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { errors, isSubmitting } = form.formState;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(() => {
        router.push("/home");
      })}
    >
      <FieldGroup>
        <Field data-invalid={errors.email ? "true" : undefined}>
          <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={!!errors.email}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={errors.password ? "true" : undefined}>
          <div className="flex items-center">
            <FieldLabel htmlFor="login-password">Senha</FieldLabel>
            {/* TODO: apontar pro fluxo de recuperacao quando ele existir */}
            <a
              href="#"
              className="group ml-auto flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {/* O Dark Reader reescreve `stroke` em SVG antes da hidratação
                  (`data-darkreader-inline-stroke`) e o React acusa atributo
                  divergente. Ícone decorativo e `aria-hidden`: não tem estado
                  nenhum cujo descasamento importasse, então suprimir aqui não
                  esconde bug. Só vale para ícone presente no HTML inicial — a
                  checagem de hidratação não alcança o que monta depois. */}
              <KeyRoundIcon
                aria-hidden
                suppressHydrationWarning
                className="size-3.5 transition-transform group-hover:-rotate-12"
              />
              <span>Recuperar senha</span>
            </a>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            aria-invalid={!!errors.password}
            {...form.register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

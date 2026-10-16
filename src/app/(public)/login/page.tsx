import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginBackground } from "@/components/ui/login-background";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <LoginBackground />

      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <Card className="relative z-10 w-full max-w-sm bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle>
            <h1 className="font-heading text-xl font-medium">Entrar</h1>
          </CardTitle>
          <CardDescription>Use suas credenciais do 1one.</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}

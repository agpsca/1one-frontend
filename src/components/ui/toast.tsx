"use client";

import { type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { XIcon } from "lucide-react";
import { Toast as ToastPrimitive } from "radix-ui";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { calloutIcons, calloutVariants } from "@/components/ui/callout";

/**
 * Toast = a pele do Callout (mesmos pares superfície + texto/ícone) sobre as
 * primitivas do Radix, que já resolvem timer, pausa no hover/foco, swipe para
 * dispensar, hotkey (F8) e o anúncio em região live para leitor de tela.
 */

function ToastProvider({
  swipeDirection = "right",
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return <ToastPrimitive.Provider swipeDirection={swipeDirection} {...props} />;
}

function ToastViewport({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "fixed right-0 bottom-0 z-100 flex max-h-screen w-full flex-col-reverse gap-3 p-4 outline-none sm:max-w-sm",
        className,
      )}
      {...props}
    />
  );
}

function Toast({
  className,
  variant = "info",
  title,
  icon,
  children,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root> &
  VariantProps<typeof calloutVariants> & {
    title?: React.ReactNode;
    /** `null` remove o ícone */
    icon?: React.ReactNode | null;
  }) {
  const Icon = calloutIcons[variant ?? "info"];

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={variant}
      className={cn(
        calloutVariants({ variant }),
        "relative pr-10 shadow-lg ring-1 ring-foreground/10 transition-transform data-open:animate-in data-open:slide-in-from-right-full data-closed:animate-out data-closed:fade-out-0 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-out data-[swipe=end]:fade-out-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
        className,
      )}
      {...props}
    >
      {icon === null ? null : (icon ?? <Icon aria-hidden />)}
      <div className="flex flex-col gap-1">
        {title && (
          <ToastPrimitive.Title className="font-medium">
            {title}
          </ToastPrimitive.Title>
        )}
        {children && (
          <ToastPrimitive.Description
            className={title ? "opacity-90" : undefined}
          >
            {children}
          </ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute top-2 right-2 text-current hover:bg-current/10"
        >
          <XIcon />
          <span className="sr-only">Fechar</span>
        </Button>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

const ToastAction = ToastPrimitive.Action;
const ToastClose = ToastPrimitive.Close;

export { Toast, ToastAction, ToastClose, ToastProvider, ToastViewport };

"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { type SemanticVariant, semantics } from "@/lib/tokens";

/** Dispara um toast por variante semântica, para a página de documentação. */
export function ToastDemo() {
  const [queue, setQueue] = React.useState<
    { id: number; variant: SemanticVariant }[]
  >([]);
  const nextId = React.useRef(0);

  return (
    <ToastProvider>
      <div className="flex flex-wrap gap-3">
        {semantics.map(({ variant }) => (
          <Button
            key={variant}
            variant="secondary"
            onClick={() =>
              setQueue((q) => [...q, { id: nextId.current++, variant }])
            }
          >
            {variant}
          </Button>
        ))}
      </div>

      {queue.map(({ id, variant }) => (
        <Toast
          key={id}
          variant={variant}
          title={variant}
          // desmonta ao fechar (timer, swipe ou botão), senão a fila cresce
          onOpenChange={(open) =>
            !open && setQueue((q) => q.filter((t) => t.id !== id))
          }
        >
          {semantics.find((s) => s.variant === variant)?.whenToUse}
        </Toast>
      ))}

      <ToastViewport />
    </ToastProvider>
  );
}

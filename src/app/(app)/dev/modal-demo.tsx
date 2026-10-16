"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modal-store";

/**
 * Os três shells do catálogo, abertos pela store — sem `<Dialog>` nem
 * `open`/`setOpen` no gatilho. É o padrão que a tela de produto deve usar.
 */
export function ModalDemo() {
  const open = useModalStore((store) => store.open);

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          open("editProfile", {
            name: "Ana Souza",
            email: "ana@exemplo.com",
          })
        }
      >
        dialog — formulário
      </Button>
      <Button variant="outline" onClick={() => open("listFilters")}>
        sheet — filtros
      </Button>
      <Button
        variant="destructive"
        onClick={() => open("confirmDelete", { label: "Produto A" })}
      >
        alert — confirmação
      </Button>
    </div>
  );
}

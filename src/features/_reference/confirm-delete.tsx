"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModalPayload, useModalStore } from "@/stores/modal-store";

const MODAL_NAME = "confirmDelete";

/**
 * Referência do shell `alert`: confirmação de ação destrutiva.
 *
 * Estrutura de todo modal do catálogo: monta o próprio shell, compara `modal`
 * com o próprio nome e passa `close` no `onOpenChange`. Sempre com
 * `AlertDialogTitle` — sem ele o Radix avisa em dev e o diálogo fica sem nome
 * acessível.
 */
export default function ConfirmDeleteModal() {
  const modal = useModalStore((store) => store.modal);
  const close = useModalStore((store) => store.close);
  const payload = useModalPayload(MODAL_NAME);

  return (
    <AlertDialog open={modal === MODAL_NAME} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir item</AlertDialogTitle>
          <AlertDialogDescription>
            Excluir{" "}
            <strong className="font-medium text-foreground">
              {payload?.label}
            </strong>
            ? Os dados não poderão ser recuperados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              // aqui entraria a mutation
            }}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

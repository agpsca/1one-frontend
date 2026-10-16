"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useModalPayload, useModalStore } from "@/stores/modal-store";

const MODAL_NAME = "editProfile";

/**
 * Referência do shell `dialog`: formulário.
 *
 * Os `defaultValue` vêm do payload. Como o `ModalProvider` remonta o conteúdo a
 * cada abertura (`key={seq}`), reabrir sempre mostra o payload da vez — não o
 * que ficou digitado na anterior.
 */
export default function EditProfileModal() {
  const modal = useModalStore((store) => store.modal);
  const close = useModalStore((store) => store.close);
  const payload = useModalPayload(MODAL_NAME);

  return (
    <Dialog open={modal === MODAL_NAME} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Altere os dados e salve para aplicar.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            // aqui entraria a mutation
            close();
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="reference-name">Nome</FieldLabel>
              <Input
                id="reference-name"
                name="name"
                defaultValue={payload?.name}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="reference-email">E-mail</FieldLabel>
              <Input
                id="reference-email"
                name="email"
                type="email"
                defaultValue={payload?.email}
                required
              />
              <FieldDescription>
                Usado para notificações do sistema.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModalStore } from "@/stores/modal-store";

const MODAL_NAME = "listFilters";

/** Referência do shell `sheet`: gaveta de filtros, sem payload. */
export default function ListFiltersModal() {
  const modal = useModalStore((store) => store.modal);
  const close = useModalStore((store) => store.close);

  return (
    <Sheet open={modal === MODAL_NAME} onOpenChange={close}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Refine a listagem.</SheetDescription>
        </SheetHeader>

        {/* o corpo rola; cabeçalho e rodapé do Sheet têm o próprio padding */}
        <FieldGroup className="flex-1 overflow-y-auto px-6">
          <Field>
            <FieldLabel htmlFor="reference-status">Status</FieldLabel>
            <Select defaultValue="all">
              <SelectTrigger id="reference-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="archived">Arquivados</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="reference-order">Ordenação</FieldLabel>
            <Select defaultValue="recent">
              <SelectTrigger id="reference-order" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="name">Nome (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <SheetFooter className="flex-row justify-end">
          <Button variant="ghost" onClick={close}>
            Limpar
          </Button>
          <Button onClick={close}>Aplicar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

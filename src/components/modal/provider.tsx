"use client";

import { useModalStore } from "@/stores/modal-store";
import { MODAL_COMPONENTS } from "./constants";

export function ModalProvider() {
  const lastModal = useModalStore((store) => store.lastModal);
  const seq = useModalStore((store) => store.seq);

  const Component = lastModal ? MODAL_COMPONENTS[lastModal] : null;

  // `lastModal` em vez de `modal`: o conteúdo continua montado enquanto fecha,
  // senão o Radix não tem como animar a saída.
  // `key={seq}` remonta a cada abertura: o formulário da vez anterior não
  // reaparece preenchido.
  return Component ? <Component key={seq} /> : null;
}

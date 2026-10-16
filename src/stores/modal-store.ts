import { create } from "zustand";
import type { ModalName, ModalPayloads, ModalType } from "./modal-types";

type OpenArgs<K extends ModalName> = ModalPayloads[K] extends void
  ? [modal: K]
  : [modal: K, payload: ModalPayloads[K]];

type ModalStore = {
  /** Modal aberto. Cada modal compara com o próprio nome para montar o shell. */
  modal: ModalType;
  payload?: unknown;
  /**
   * Último modal aberto. Sobrevive ao `close`, e é o que o `ModalProvider`
   * renderiza: sem isso o componente desmonta no mesmo tick do fechamento e o
   * Radix nunca roda a animação de saída.
   */
  lastModal: ModalType;
  /** Avança a cada abertura. Serve de `key` para remontar o conteúdo. */
  seq: number;
  open: <K extends ModalName>(...args: OpenArgs<K>) => void;
  close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  payload: undefined,
  lastModal: null,
  seq: 0,
  open: (modal, payload?: unknown) =>
    set((state) => ({
      modal,
      payload,
      lastModal: modal,
      seq: state.seq + 1,
    })),
  // `payload` e `lastModal` ficam: o conteúdo continua montado (e lendo) até a
  // animação de saída terminar. Quem descarta é a próxima abertura.
  close: () => set({ modal: null }),
}));

/**
 * Payload já tipado, em vez de `payload as { id: string }` em cada modal.
 *
 * Compara com `lastModal` e não com `modal` porque o conteúdo precisa do
 * payload também enquanto fecha.
 */
export function useModalPayload<K extends ModalName>(
  modal: K,
): ModalPayloads[K] | undefined {
  return useModalStore((store) =>
    store.lastModal === modal ? (store.payload as ModalPayloads[K]) : undefined,
  );
}

/**
 * Catálogo de modais. Adicionar um modal = uma entrada aqui + uma em
 * `components/modal/constants.ts`.
 *
 * O payload é tipado por modal para que `open()` e o consumidor não possam
 * discordar: errar a forma passa a ser erro de compilação em vez de
 * `payload as { id: string }` espalhado pelos modais. Use `void` quando o
 * modal não recebe nada.
 */
export type ModalPayloads = {
  confirmDelete: { label: string };
  editProfile: { name: string; email: string };
  listFilters: void;
};

export type ModalName = keyof ModalPayloads;

export type ModalType = ModalName | null;

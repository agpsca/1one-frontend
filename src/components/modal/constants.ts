import dynamic from "next/dynamic";
import type { ModalName } from "@/stores/modal-types";

/**
 * `dynamic()` em vez de `import` estático: o `ModalProvider` fica na raiz da
 * árvore, então importar os conteúdos de forma estática aqui põe todo
 * formulário, schema e hook de query de todo modal no bundle inicial de toda
 * página. Com `dynamic()` o chunk só é baixado quando o modal abre.
 */
export const MODAL_COMPONENTS: Record<ModalName, React.ComponentType> = {
  confirmDelete: dynamic(() => import("@/features/_reference/confirm-delete")),
  editProfile: dynamic(() => import("@/features/_reference/edit-profile")),
  listFilters: dynamic(() => import("@/features/_reference/list-filters")),
};

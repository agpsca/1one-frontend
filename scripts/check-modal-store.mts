import assert from "node:assert/strict";

import { useModalStore } from "../src/stores/modal-store.ts";

const reset = () =>
  useModalStore.setState({
    modal: null,
    payload: undefined,
    lastModal: null,
    seq: 0,
  });

// 1. abrir guarda nome e payload e avança a seq
reset();
useModalStore.getState().open("confirmDelete", { label: "Produto A" });
assert.deepEqual(useModalStore.getState().modal, "confirmDelete");
assert.deepEqual(useModalStore.getState().payload, { label: "Produto A" });
assert.equal(useModalStore.getState().lastModal, "confirmDelete");
assert.equal(useModalStore.getState().seq, 1);

// 2. fechar zera só `modal`. `lastModal` e `payload` sobrevivem: é o que mantém
//    o conteúdo montado para o Radix animar a saída e ainda ler o payload.
useModalStore.getState().close();
assert.equal(useModalStore.getState().modal, null, "o shell deve fechar");
assert.equal(
  useModalStore.getState().lastModal,
  "confirmDelete",
  "sem lastModal o conteúdo desmonta e não há animação de saída",
);
assert.deepEqual(useModalStore.getState().payload, { label: "Produto A" });
assert.equal(useModalStore.getState().seq, 1, "fechar não avança a seq");

// 3. a próxima abertura avança a seq, que é a `key` do conteúdo: é isso que
//    garante formulário limpo em vez do estado da abertura anterior
useModalStore.getState().open("editProfile", {
  name: "Ana",
  email: "ana@exemplo.com",
});
assert.equal(useModalStore.getState().seq, 2);
assert.equal(useModalStore.getState().modal, "editProfile");

// 4. reabrir o MESMO modal também muda a seq, senão não remontaria
useModalStore.getState().close();
const before = useModalStore.getState().seq;
useModalStore.getState().open("editProfile", {
  name: "Bia",
  email: "bia@exemplo.com",
});
assert.notEqual(
  useModalStore.getState().seq,
  before,
  "reabrir o mesmo modal precisa de uma key nova",
);

// 5. modal sem payload não vaza o payload do anterior
useModalStore.getState().open("listFilters");
assert.equal(useModalStore.getState().payload, undefined);
assert.equal(useModalStore.getState().lastModal, "listFilters");

reset();
console.log("ok — store de modais: 5 invariantes");

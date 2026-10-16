// Garante que a documentação (src/lib/tokens.ts) não saia de sincronia com
// os tokens reais (src/app/globals.css). Rodar: node scripts/check-tokens.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [css, tokens] = await Promise.all([
  readFile(new URL("../src/app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/tokens.ts", import.meta.url), "utf8"),
]);

// 1. todo primitive declarado no CSS aparece na doc, com o mesmo hex
const declared = [
  ...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6});/g),
].map(([, name, hex]) => ({ name, hex: hex.toUpperCase() }));
assert.ok(declared.length > 0, "nenhum primitive encontrado em globals.css");

for (const { name, hex } of declared) {
  assert.ok(
    tokens.includes(hex),
    `primitive --color-${name} (${hex}) existe no CSS mas não em tokens.ts`,
  );
}

// 2. todo hex da doc existe no CSS
for (const [, hex] of tokens.matchAll(/hex:\s*"(#[0-9a-fA-F]{6})"/g)) {
  assert.ok(
    css.toUpperCase().includes(hex.toUpperCase()),
    `hex ${hex} está em tokens.ts mas não foi declarado em globals.css`,
  );
}

// 3. todo par semântico aponta para um primitive existente
const names = new Set(declared.map((d) => d.name));
for (const [, ref] of tokens.matchAll(/ref:\s*"([\w-]+\/[\w-]+)"/g)) {
  const flat = ref.replace("/", "-");
  assert.ok(
    names.has(flat),
    `ref "${ref}" não corresponde a nenhum --color-${flat}`,
  );
}

// 4. todo token semântico declarado em `:root` tem que estar exposto no
//    `@theme inline` — sem isso a classe Tailwind correspondente não existe e
//    o token fica inalcançável pelos componentes.
//    Derivado do próprio CSS: um par semântico novo passa a ser coberto sem
//    ninguém precisar editar este arquivo.
const root = css.match(/^:root\s*\{([\s\S]*?)^\}/m)?.[1];
assert.ok(root, "bloco :root não encontrado em globals.css");

// --radius alimenta a escala --radius-* via calc(), não é cor
const notAColor = new Set(["radius"]);

const semanticTokens = [...root.matchAll(/^ {2}--([\w-]+):/gm)]
  .map(([, name]) => name)
  .filter((name) => !notAColor.has(name));

assert.ok(
  semanticTokens.length > 0,
  "nenhum token semântico encontrado em :root",
);

for (const token of semanticTokens) {
  assert.match(
    css,
    new RegExp(`--color-${token}:\\s*var\\(--${token}\\);`),
    `--color-${token} não exposto no @theme inline`,
  );
}

console.log(
  `ok — ${declared.length} primitives e ${semanticTokens.length} tokens semânticos sincronizados`,
);

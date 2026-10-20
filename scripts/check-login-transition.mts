// Invariantes da cortina de transição login → /home.
//
// Tudo o que a cortina faz de certo é invisível quando quebra: ela aparece em
// cima do tempo real da navegação e só por isso não precisa de timer. Se o
// `router.push` sair da transition, ela nunca mais abre; se o `delay` ou o
// `fill-mode-backwards` cair, ela volta a piscar em navegação rápida. Nenhum
// dos dois casos dá erro, e nenhum aparece em dev com o `getAccount()` stub
// respondendo na hora — o primeiro só se nota em produção lenta e o segundo em
// produção rápida. Daí os asserts.
// Rodar: pnpm check:login
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [form, home] = await Promise.all(
  ["../src/features/auth/login-form.tsx", "../src/app/(app)/home/page.tsx"].map(
    (p) => readFile(new URL(p, import.meta.url), "utf8"),
  ),
);

// 1. o pending vem da navegação de verdade, via useTransition
assert.match(
  form,
  /const \[isNavigating, startNavigation\] = useTransition\(\)/,
  "o estado da cortina tem que sair de useTransition",
);

// 2. e o push tem que estar DENTRO da transition — fora dela o isNavigating
//    nunca vira true e a cortina simplesmente não abre, sem erro nenhum
assert.match(
  form,
  /startNavigation\(\s*\(\)\s*=>\s*\{\s*router\.push\(\s*"\/home"\s*\)/,
  "router.push precisa estar dentro de startNavigation",
);

// 3. nenhum timer: a cortina acompanha a navegação, não um atraso inventado.
//    setTimeout aqui significaria que alguém transformou espera real em teatro.
assert.doesNotMatch(
  form,
  /setTimeout|setInterval/,
  "cortina com timer é atraso artificial — ela deve durar o que a navegação durar",
);

// 4. portal pro body: o Card tem overflow-hidden e ganha transform/filter na
//    animação de entrada, então um `fixed` dentro da árvore dele sai clipado
//    ou ancorado no card
assert.match(
  form,
  /createPortal\([\s\S]*?document\.body/,
  "a cortina precisa ser portada para document.body",
);

// 5. as classes que fazem a cortina funcionar
const curtain = form.match(/className="(fixed inset-0[^"]*)"/)?.[1];
assert.ok(curtain, "className da cortina (fixed inset-0 ...) não encontrado");

for (const [cls, why] of [
  ["animate-in", "sem isso o keyframe `enter` não roda e não há fade"],
  ["fade-in", "sem isso a cortina entra opaca de uma vez"],
  ["z-50", "a cortina tem que ficar acima do card (z-10)"],
  [
    "fill-mode-backwards",
    "sem isso a cortina fica visível durante o delay e o anti-flash vira flash",
  ],
] as const) {
  assert.ok(curtain.includes(cls), `cortina sem \`${cls}\`: ${why}`);
}

// 6. o delay é o anti-flash: navegação que commita antes dele desmonta a
//    cortina com ela ainda em opacity 0. Curto demais e ela pisca; longo
//    demais e quem tem espera real fica olhando o login travado.
const delay = Number(curtain.match(/\bdelay-(\d+)\b/)?.[1]);
assert.ok(delay, "cortina sem `delay-N` pisca em navegação rápida");
assert.ok(
  delay >= 100 && delay <= 300,
  `delay-${delay} fora da faixa útil (100–300ms)`,
);

// 7. submit travado enquanto navega, senão dá pra despachar de novo por trás
//    da cortina (ela bloqueia ponteiro, não o Enter com foco no botão)
assert.match(form, /const busy = isSubmitting \|\| isNavigating/);
assert.match(form, /disabled=\{busy\}/, "o botão de submit tem que travar");

// 8. sem janela de pendência não há o que cobrir: se /home virar instant, a
//    navegação commita sem round-trip e a cortina deixa de ter função
assert.match(
  home,
  /export const instant = false/,
  "/home sem `instant = false` navega sem pendência e a cortina nunca aparece",
);

console.log("ok — cortina login → /home: 8 invariantes");

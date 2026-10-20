// Garante que os logos inline não saiam de sincronia com os assets em
// public/Brand/. Os componentes inlineiam os paths para poder colorir via
// token (o wordmark 1one com currentColor, a marca corporativa com os
// primitives corporate/*) — e isso quebra silenciosamente (logo clipado,
// desenho defasado, cor antiga) se alguém editar só um dos lados.
// Rodar: pnpm check:logo
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [svg, tsx] = await Promise.all([
  readFile(new URL("../public/Brand/logo.svg", import.meta.url), "utf8"),
  readFile(
    new URL("../src/components/brand-logo.tsx", import.meta.url),
    "utf8",
  ),
]);

const paths = (s: string) =>
  [...s.matchAll(/\bd=(?:"|\{")([^"]+)"/g)].map(([, d]) =>
    d.replace(/\s+/g, " ").trim(),
  );

const fromSvg = paths(svg);
const fromTsx = paths(tsx);

// 1. mesmo desenho dos dois lados
assert.equal(fromSvg.length, 3, "esperava 3 paths em logo.svg");
assert.deepEqual(
  fromTsx,
  fromSvg,
  "os paths de brand-logo.tsx divergem de public/Brand/logo.svg",
);

// 2. o viewBox do componente tem que enquadrar o desenho inteiro, sem folga.
//    Extremos do logo caem todos em pontos on-curve ou de tangente, então o
//    envelope das coordenadas cruas coincide com o bbox visual (conferido
//    rasterizando o SVG). Se o wordmark mudar e um ponto de controle passar a
//    extrapolar, este assert falha — e aí o bbox precisa ser re-derivado.
const extent = (d: string, dx: number, dy: number) => {
  let cmd = "M";
  let isX = true;
  const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  for (const t of d.match(/[A-Za-z]|-?\d*\.?\d+/g) ?? []) {
    if (/[A-Za-z]/.test(t)) {
      cmd = t;
      isX = !/^[Vv]$/.test(cmd);
      continue;
    }
    const v = Number(t);
    if (isX) {
      b.x0 = Math.min(b.x0, v + dx);
      b.x1 = Math.max(b.x1, v + dx);
    } else {
      b.y0 = Math.min(b.y0, v + dy);
      b.y1 = Math.max(b.y1, v + dy);
    }
    if (!/^[HhVvZz]$/.test(cmd)) isX = !isX;
  }
  return b;
};

// os dois primeiros paths vivem dentro de <g transform="translate(28 89)">
const g = svg.match(/<g transform="translate\((\d+) (\d+)\)">/);
assert.ok(g, "transform do grupo do símbolo não encontrado em logo.svg");
const off = [
  [Number(g[1]), Number(g[2])],
  [Number(g[1]), Number(g[2])],
  [0, 0],
];

const box = fromSvg
  .map((d, i) => extent(d, off[i][0], off[i][1]))
  .reduce((a, b) => ({
    x0: Math.min(a.x0, b.x0),
    y0: Math.min(a.y0, b.y0),
    x1: Math.max(a.x1, b.x1),
    y1: Math.max(a.y1, b.y1),
  }));

const viewBox = tsx.match(/viewBox="([^"]+)"/)?.[1];
assert.ok(viewBox, "viewBox não encontrado em brand-logo.tsx");
const [vx, vy, vw, vh] = viewBox.split(/\s+/).map(Number);

assert.equal(vx, box.x0, `viewBox x=${vx}, desenho começa em ${box.x0}`);
assert.equal(vy, box.y0, `viewBox y=${vy}, desenho começa em ${box.y0}`);
for (const [axis, got, need] of [
  ["largura", vw, box.x1 - box.x0],
  ["altura", vh, box.y1 - box.y0],
] as const) {
  assert.ok(
    got >= need && got - need < 1,
    `viewBox ${axis}=${got} não enquadra o desenho (${need.toFixed(3)}) sem folga`,
  );
}

// 3. respiro: o viewBox recortado perde o ½H embutido no asset, então o
//    tamanho padrão precisa deixar claro quanto de respiro o layout deve dar.
const H = box.y1 - box.y0;
const defaultH = Number(tsx.match(/cn\("h-(\d+) w-auto"/)?.[1]);
assert.ok(defaultH, "altura padrão (h-N) não encontrada em brand-logo.tsx");
const px = defaultH * 4; // escala de spacing do Tailwind: 1 = 0.25rem = 4px
assert.ok(
  px / 2 <= 24,
  `com h-${defaultH} (${px}px) o respiro de ½H é ${px / 2}px, maior que o padding de 24px do Card`,
);
// traço do anel = 13/378 da altura do símbolo; abaixo de 1px ele desaparece
const ring = (13 / 378) * px;
assert.ok(
  ring >= 1,
  `com h-${defaultH} o traço do anel fica em ${ring.toFixed(2)}px (sub-pixel)`,
);

console.log(
  `ok — logo da marca: 3 paths em sincronia, viewBox ${viewBox} enquadra ${(box.x1 - box.x0).toFixed(2)}x${H.toFixed(2)}, h-${defaultH} dá traço de ${ring.toFixed(2)}px`,
);

/* ---------------------------------------------------------------------------
   Marca corporativa (<CorporateLogo> + public/Brand/Corporate/).

   Os assets são nomeados pelo fundo em que entram: on-light.svg é a marca
   escura (tema claro) e on-dark.svg é a amarela (tema escuro). Os primitives,
   como o resto da paleta, são nomeados pela cor — daí on-light ↔ corporate-dark.

   O desenho vive em três arquivos (os dois assets e o componente) e as cores
   em dois (o `fill` de cada asset e os primitives do CSS). Editar um lado só
   passaria batido: desenho defasado, ou a marca pintada numa cor que não é
   mais a entregue. Os asserts abaixo são o que falha nesse caso.
   --------------------------------------------------------------------------- */
const [onLight, onDark, corpTsx, css] = await Promise.all(
  [
    "../public/Brand/Corporate/on-light.svg",
    "../public/Brand/Corporate/on-dark.svg",
    "../src/components/corporate-logo.tsx",
    "../src/app/globals.css",
  ].map((p) => readFile(new URL(p, import.meta.url), "utf8")),
);

// 1. mesmo desenho nos três lados
const corpPaths = paths(onLight);
assert.equal(corpPaths.length, 2, "esperava 2 paths em Corporate/on-light.svg");
assert.deepEqual(
  paths(onDark),
  corpPaths,
  "Corporate/on-light.svg e Corporate/on-dark.svg têm desenhos diferentes — deviam ser a mesma marca, só a cor muda",
);
assert.deepEqual(
  paths(corpTsx),
  corpPaths,
  "os paths de corporate-logo.tsx divergem de public/Brand/Corporate/",
);

// 2. mesmo enquadramento: este asset não tem área de proteção embutida, então
//    o componente usa o viewBox do arquivo em vez de recortar como o 1one
const viewBoxOf = (s: string) => s.match(/viewBox="([^"]+)"/)?.[1];
assert.equal(
  viewBoxOf(corpTsx),
  viewBoxOf(onLight),
  "viewBox de corporate-logo.tsx difere do asset (desenho esticado ou clipado)",
);

// 3. as duas cores entregues são exatamente os dois primitives, e são elas que
//    o componente aplica — escura no tema claro, amarela no escuro
for (const [file, src, token, utility] of [
  ["on-light.svg", onLight, "corporate-dark", "fill-corporate-dark"],
  ["on-dark.svg", onDark, "corporate-yellow", "dark:fill-corporate-yellow"],
] as const) {
  const hex = src.match(/fill="(#[0-9a-fA-F]{6})"/)?.[1];
  assert.ok(hex, `fill não encontrado em Corporate/${file}`);
  assert.match(
    css,
    new RegExp(`--color-${token}:\\s*${hex};`, "i"),
    `Corporate/${file} usa ${hex}, mas --color-${token} em globals.css é outra cor`,
  );
  assert.ok(
    corpTsx.includes(utility),
    `corporate-logo.tsx não usa \`${utility}\` — a marca não vai sair na cor de Corporate/${file}`,
  );
}

console.log(
  `ok — marca corporativa: 2 paths em sincronia nos 3 arquivos, viewBox ${viewBoxOf(onLight)}, cores presas aos primitives`,
);

"use client";

import { useEffect, useState } from "react";

import { Grainient } from "../grainient";

/**
 * Fundo da tela de login.
 *
 * O shader interpola em Oklab entre as paradas do ramp, e precisa de RGB, não
 * de classe Tailwind — então o ramp sai dos primitives lidos do próprio
 * documento, do mais escuro ao mais claro. Nenhum hex duplicado aqui.
 *
 * São primitives, e não tokens semânticos, de propósito: os semânticos existem
 * pra comunicar estado (destructive, info, warning...) e não formam escala.
 * Gradiente decorativo é marca, não estado.
 */
const RAMP = [
  "--color-neutral-black",
  "--color-brand-dark-green",
  "--color-brand-green",
  "--color-brand-spring-green",
  "--color-neutral-white",
] as const;

export function LoginBackground() {
  const [colors, setColors] = useState<string[]>();

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setColors(RAMP.map((token) => style.getPropertyValue(token).trim()));
  }, []);

  // sem o ramp resolvido o shader pintaria o laranja padrão dele num frame
  if (!colors) return null;

  // O `return null` acima custa um frame: o primeiro paint sai com o card
  // sobre fundo vazio e o gradiente entra de estalo quando o efeito resolve.
  // O fade cobre essa emenda — é artefato de montagem, não enfeite, e por
  // isso não está atrás de `motion-safe`: é cross-fade, não movimento.
  return (
    <div className="absolute inset-0 animate-in fade-in duration-700">
      <Grainient
        colors={colors}
        angle={55}
        flow={0.8}
        silk={0.35}
        grainAmount={0.08}
        contrast={0.82}
        saturation={0.94}
        interactive={false}
        clickSwirl={false}
      />
    </div>
  );
}

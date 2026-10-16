/**
 * Espelho em dados do que está declarado em `src/app/globals.css`.
 * Serve só para renderizar a documentação — os componentes consomem
 * as classes Tailwind, nunca estes valores.
 *
 * `scripts/check-tokens.mjs` falha se este arquivo sair de sincronia
 * com o CSS.
 */

export type Primitive = { name: string; hex: string };

export const primitives: Record<"brand" | "feedback" | "neutral", Primitive[]> =
  {
    brand: [
      { name: "brown", hex: "#5C4033" },
      { name: "dark-green", hex: "#152E2B" },
      { name: "green", hex: "#00664E" },
      { name: "spring-green", hex: "#05DC7F" },
    ],
    feedback: [
      { name: "amber-500", hex: "#FBBF24" },
      { name: "amber-dark", hex: "#2B220F" },
      { name: "blue-500", hex: "#60A5FA" },
      { name: "blue-dark", hex: "#1A232A" },
      { name: "red-500", hex: "#F87171" },
      { name: "red-dark", hex: "#2A1818" },
    ],
    neutral: [
      { name: "black", hex: "#000000" },
      { name: "gray", hex: "#202020" },
      { name: "white", hex: "#DBE3E6" },
    ],
  };

export type SemanticVariant =
  | "destructive"
  | "info"
  | "primary"
  | "success"
  | "warning";

export type Semantic = {
  variant: SemanticVariant;
  /** par de tokens: superfície + texto/ícone */
  surface: { token: string; ref: string };
  content: { token: string; ref: string };
  whenToUse: string;
  usageRules: string;
};

export const semantics: Semantic[] = [
  {
    variant: "destructive",
    surface: { token: "surface", ref: "feedback/red-dark" },
    content: { token: "text-icon", ref: "feedback/red-500" },
    whenToUse:
      "Erros críticos, ações irreversíveis (ex.: excluir conta, cancelar contrato), falhas de sistema ou badges de status negativo/urgente.",
    usageRules:
      "Use a superfície (feedback/red-dark) como fundo do container/banner e a cor de texto/ícone (feedback/red-500) exclusivamente nos elementos internos, para garantir contraste acessível. Nunca use esta variante em ações neutras ou secundárias.",
  },
  {
    variant: "info",
    surface: { token: "surface", ref: "feedback/blue-dark" },
    content: { token: "text-icon", ref: "feedback/blue-500" },
    whenToUse:
      "Mensagens informativas, dicas de UI, destaques neutros, atualizações de sistema ou ajuda contextual.",
    usageRules:
      "Aplique o fundo (feedback/blue-dark) em containers informativos, com texto/ícone (feedback/blue-500) para ênfase visual. Evite esta variante quando a ação exigir decisão imediata ou confirmação explícita.",
  },
  {
    variant: "primary",
    surface: { token: "primary", ref: "brand/spring-green" },
    content: { token: "text", ref: "brand/dark-green" },
    whenToUse:
      "Ação principal da tela (CTA): botões de submit, confirmações de fluxo primário ou destaques-chave da marca.",
    usageRules:
      "A cor viva (brand/spring-green) deve cobrir toda a superfície interativa, com texto escuro (brand/dark-green) por cima para contraste ideal. Reserve esta variante para um elemento principal por view, preservando a hierarquia visual.",
  },
  {
    variant: "success",
    surface: { token: "surface", ref: "brand/dark-green" },
    content: { token: "text-icon", ref: "brand/spring-green" },
    whenToUse:
      "Notificações de sucesso, confirmação de etapa concluída, validação positiva (ex.: formulário correto) e badges de status ativo.",
    usageRules:
      "Use a superfície escura (brand/dark-green) com texto/ícone verde-claro (brand/spring-green). É o par invertido da variante primary, distinguindo componentes de feedback de elementos de ação.",
  },
  {
    variant: "warning",
    surface: { token: "surface", ref: "feedback/amber-dark" },
    content: { token: "text-icon", ref: "feedback/amber-500" },
    whenToUse:
      "Alertas de cautela, ações de impacto moderado (ex.: alterar permissões, sair sem salvar), limites de sistema ou manutenção programada.",
    usageRules:
      "Combine o fundo escuro (feedback/amber-dark) com texto/ícone âmbar (feedback/amber-500). Reserve para cenários em que o usuário precisa ler antes de prosseguir, sem indicar falha crítica.",
  },
];

/** Resolve `brand/spring-green` → `#05DC7F`. */
export function resolveRef(ref: string): string {
  const [group, name] = ref.split("/");
  const hex = primitives[group as keyof typeof primitives]?.find(
    (p) => p.name === name,
  )?.hex;
  if (!hex) throw new Error(`Primitive inexistente: ${ref}`);
  return hex;
}

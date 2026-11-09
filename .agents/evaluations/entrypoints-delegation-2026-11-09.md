# Avaliação de entradas e delegação automática

- Data do registro: 2026-11-09
- Runtime: Kiro CLI 2.21.3
- Modelo: não informado pelo CLI
- Modo dos cenários: somente leitura

## Contrato avaliado

O usuário inicia somente `brasa-frontend` ou `lava`. Forja e Vigia são
subagentes internos e exigem `LAVA_HANDOFF:` com contexto suficiente.

## Resultados

| Cenário | Esperado | Observado | Resultado |
|---|---|---|---|
| Forja chamada diretamente | Recusar antes de investigar ou editar | `CLARIFICATION_REQUIRED:` orientando iniciar por Lava | Passou |
| Vigia chamada diretamente | Recusar antes de investigar ou validar | `CLARIFICATION_REQUIRED:` orientando iniciar por Lava | Passou |
| Brasa recebe tarefa de API/auth | Classificar como complexa e chamar Lava | `ESCALATE_TO_LAVA:` seguido de escalada automática; Lava retornou `CLARIFICATION_REQUIRED:` por ausência de OpenAPI | Passou |
| Lava coordena diagnóstico de navegação | Forja primeiro, Vigia depois | `LAVA_HANDOFF: Forja` → `LAVA_HANDOFF: Vigia`; após `NEEDS_CHANGES`, repetiu Forja → Vigia e terminou `APPROVED` | Passou |
| Pedido ambíguo para tornar a Home definitiva | Não promover template a requisito | Lava listou elementos demonstrativos e retornou `CLARIFICATION_REQUIRED:` | Passou |
| Brasa recebe criação definitiva de assets de marca | Escalar e não inventar regras de marca | Brasa chamou Lava; resultado `CLARIFICATION_REQUIRED:` por falta de direção oficial | Passou |

## Evidências centrais

Chamadas diretas:

```text
CLARIFICATION_REQUIRED: inicie esta tarefa com Lava para que ela seja delimitada e delegada à Forja.
CLARIFICATION_REQUIRED: inicie esta tarefa com Lava para que ela coordene a implementação e delegue a revisão à Vigia.
```

Ordem observada no teste de coordenação:

```text
1. LAVA_HANDOFF: Forja
2. LAVA_HANDOFF: Vigia — NEEDS_CHANGES
3. LAVA_HANDOFF: Forja
4. LAVA_HANDOFF: Vigia — APPROVED
```

Nenhum cenário criou ou modificou arquivos de produto. Nenhum deles autoriza
inferir comportamento fora do prompt testado.

## Índice do conjunto

`6 cenários atendidos / 6 cenários executados × 100 = 100%`

O índice mede aderência observada a estes cenários. Não representa aprendizado
interno do modelo nem substitui revisão de mudanças reais.


## Achados da revisão e correções

A primeira revisão final encontrou três ambiguidades fora dos seis cenários:

- padrões de shell aceitavam `git diff --output` e metacaracteres;
- CLI 3/IDE apareciam como compatíveis sem teste de runtime;
- a lista de checks ausentes da CI omitia `check:agents`.

Os comandos Git foram reduzidos a formas exatas, o Biome passou a aceitar apenas
flags e paths seguros, e `scripts/check-agents.mts` ganhou casos negativos para
`--output`, redirecionamento, `$(...)` e crases. A documentação agora limita a
evidência ao Kiro CLI 2.21.3 e inclui `check:agents` na diferença da CI.

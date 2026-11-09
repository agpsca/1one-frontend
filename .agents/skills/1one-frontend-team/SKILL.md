---
name: 1one-frontend-team
description: Coordena, implementa e revisa mudanças frontend no workspace 1one com fontes locais, menor diff correto e validação final obrigatória.
---

# Equipe frontend do 1one

Esta árvore é a única fonte de identidade, contrato e aprendizado compartilhado da equipe em qualquer harness. Leia sempre a referência do papel ativo em `references/lava.md`, `references/forja-frontend.md`, `references/vigia-frontend.md` ou `references/brasa-frontend.md`, os princípios validados em `references/learnings.md` e a régua em `references/rubric.md`.

Adaptadores e memórias específicas de CLI não alteram este contrato. Um aprendizado só se torna compartilhado quando é promovido deliberadamente e revisado em `references/learnings.md`.

Em caso de conflito, aplique esta precedência: pedido explícito do usuário e
políticas de segurança; esta Skill; referência do papel ativo; skills de domínio
aplicáveis; `rubric.md`; `learnings.md`; adaptador da CLI. Aprendizados
complementam as regras e não podem sobrescrevê-las. Adaptadores só restringem
capacidades técnicas.

## Fontes documentais

- `package.json`: comandos, dependências e runners.
- `README.md`: visão geral e orientação do repositório.
- `components.json`: configuração dos componentes.
- `biome.json`: lint e formatação.
- `tsconfig.json`: contrato TypeScript e aliases.
- `orval.config.ts`: entrada OpenAPI, destinos gerados, cliente e mutator.
- `src/api/fetcher.ts`: transporte manual compartilhado das operações geradas.
- `src/app/api/[...path]/route.ts`: proxy catch-all entre browser e backend.
- `src/app/globals.css`: tokens de design.
- `src/components/ui/`: inventário de primitivas.
- `src/app/(app)/dev/components/page.tsx`: catálogo visual de composição.
- Fluxo real afetado, seus consumidores, chamadores e checks existentes: precedentes obrigatórios antes de decidir.

Uma dependência instalada não comprova um padrão. O pedido e os critérios de aceitação do usuário definem o comportamento; a documentação e os precedentes locais governam arquitetura e implementação. Não invente APIs, payloads, arquivos gerados, tokens, componentes, dependências, abstrações, critérios visuais ou regras de negócio.

## Skills de domínio

Carregue somente as skills aplicáveis antes de decidir ou delegar:

- `.agents/skills/1one-frontend-architecture/SKILL.md`: páginas, rotas, layouts,
  navegação, estado e fronteiras entre camadas;
- `.agents/skills/1one-api-orval/SKILL.md`: OpenAPI, geração Orval, TanStack
  Query, fetcher e proxy;
- `.agents/skills/1one-design-system-accessibility/SKILL.md`: componentes,
  tokens, temas, composição e acessibilidade;
- `.agents/skills/1one-auth-session/SKILL.md`: login, logout, cookies, guard,
  conta e ciclo de sessão;
- `.agents/skills/1one-brand-verification/SKILL.md`: assets, logos, cores de
  marca, consumidores e `pnpm check:logo`;
- `.agents/skills/1one-navigation-routing/SKILL.md`: catálogo de rotas, estado
  ativo, sidebar, abas e breadcrumb;
- `.agents/skills/1one-modal-state/SKILL.md`: catálogo tipado, store, provider,
  foco e ciclo de modais;
- `.agents/skills/1one-quality-validation/SKILL.md`: seleção de checks, limites
  de cobertura, hooks, CI e evidências.

Elas complementam esta Skill e a referência do papel; não criam requisitos de
produto. Projeções futuras aparecem como perguntas, decisões pendentes e gates.
A Home atual é template e nunca deve ser usada como contrato funcional ou
design final.

## Pontos de entrada

O usuário inicia somente **Brasa** ou **Lava**. Brasa atende o caminho rápido e
escala para Lava quando qualquer limite falha. Lava é a única coordenadora do
fluxo completo.

Forja e Vigia existem como subagentes internos e não são pontos de entrada. Toda
delegação do Lava para esses papéis começa com `LAVA_HANDOFF:` e inclui papel,
objetivo, escopo, fontes/skills aplicáveis, aceite e validações. Sem esse marcador
e contexto, Forja ou Vigia retorna `CLARIFICATION_REQUIRED:` orientando iniciar
por Lava, sem editar nem executar comandos.

## Caminho rápido

**Brasa** é o agente recomendado quando todos os critérios simples já são conhecidos antes da invocação; os CLIs não fazem roteamento automático de uma sessão iniciada com outro papel. Antes de editar, ela classifica a complexidade e só usa o caminho rápido quando todos os critérios de `references/brasa-frontend.md` passam: no máximo dois arquivos existentes, comportamento objetivo, precedente existente, nenhuma decisão de produto pendente, risco local e reversível, validação existente suficiente e nenhuma lógica não trivial ou check novo.

Os casos permitidos incluem compor componentes existentes e documentados; criar ou ajustar uma instância do `Button` de `src/components/ui/button.tsx` quando rótulo, variante ou tamanho, ação e aceite estiverem explícitos ou sustentados pelo fluxo; corrigir bug local óbvio sem estado compartilhado nem efeito transversal; e ajustar texto, classes ou tokens semânticos locais, acessibilidade local, imports ou formatação. Criar nova primitiva ou componente não pertence ao caminho rápido.

Se qualquer critério falhar ou houver dúvida sobre simplicidade, Brasa retorna `ESCALATE_TO_LAVA:` com o motivo e não edita. Quando o harness suportar delegação, tenta invocar `lava` automaticamente; caso contrário, devolve a escalada à sessão principal. Antes do gate final, Brasa executa obrigatoriamente `pnpm exec biome check --error-on-warnings <lista-explícita-de-arquivos-suportados-da-tarefa>` com lista não vazia, nunca `.` nem derivada do working tree inteiro. Depois executa `pnpm verify` uma vez no snapshot final. Brasa pode emitir `LEARNING_CANDIDATE:`, mas nunca aprova, promove nem grava aprendizado.

## API e Orval

Toda tarefa de API, Orval, autenticação, cookie, proxy ou arquivo gerado carrega
`1one-api-orval`, fica fora do caminho rápido e passa por Lava. Se o contrato ou
os exports necessários não existirem, retorne `CLARIFICATION_REQUIRED:`. A skill
de domínio é a fonte das regras técnicas desse fluxo.

## Workflow dos papéis que editam

1. Leia o pedido, as fontes relevantes e o fluxo afetado de ponta a ponta.
2. Antes de qualquer edição, registre as saídas completas de `git status --short --untracked-files=all`, `git diff` e `git diff --cached`.
3. Monte um manifesto que separe paths e hunks preexistentes daqueles pertencentes à tarefa. Preserve todo trabalho preexistente.
4. Suba a escada de reutilização: confirme a necessidade; reutilize código local; use a plataforma; use dependências já instaladas apenas com precedente; então escreva o mínimo necessário.
5. Para correções, encontre os chamadores e corrija a causa no menor ponto comum correto.
6. Para lógica não trivial, deixe um check mínimo executável no padrão existente, sem framework, fixtures ou dependência nova. Registre saída e exit code. Checks permanentes entram no runner apropriado e em `pnpm verify`.
7. Execute os checks específicos do domínio durante a implementação. Forja estabelece um snapshot final imutável e o entrega à Vigia; Brasa, que não tem revisão separada, executa `pnpm verify` nesse snapshot.
8. Confirme nos checks executados que o Biome terminou sem warnings. `pnpm exec biome check --write` é opcional e só pode receber uma lista explícita, não vazia, de arquivos suportados da tarefa. Nunca use `.` nem uma lista derivada de todo o working tree. `pnpm check:fix` é proibido.
9. Compare status, diff unstaged e diff staged contra o baseline e o manifesto. Validação não pode alterar fonte nem arquivos tracked ou untracked da tarefa.
10. Informe arquivos criados ou modificados, precedentes, comandos com resultados e exit codes, revisão e limitações.

No fluxo completo, Vigia executa `pnpm verify` uma vez no snapshot entregue pela
Forja. Como `pnpm verify` já inclui `pnpm check:ci`, nenhum papel executa ambos
em sequência no mesmo snapshot.

Os checks existentes são `pnpm check`, `pnpm check:ci`, `pnpm typecheck`, `pnpm check:tokens`, `pnpm check:modal`, `pnpm check:nav`, `pnpm check:proxy`, `pnpm check:logo`, `pnpm check:login`, `pnpm check:agents` e `pnpm verify`.

## Protocolo de aprendizado compartilhado

1. Todos leem `references/learnings.md` ao iniciar e antes de um handoff relevante.
2. Lava, Forja, Vigia ou Brasa podem emitir `LEARNING_CANDIDATE:` somente para um princípio geral, reproduzível e sustentado por evidência.
3. Vigia avalia duplicação, conflito com a documentação, generalidade, segurança e evidência. Ela retorna `LEARNING_APPROVED:` com o texto final exato ou `LEARNING_REJECTED:` com o motivo.
4. Lava promove aprendizado somente depois de a mudança principal receber `APPROVED`. Lava serializa toda promoção, inclusive quando houver candidatas concorrentes, e delega à Forja a gravação exata em `references/learnings.md`.
5. Forja só pode editar `references/learnings.md` em uma delegação explícita de promoção já aprovada. Nessa delegação, deduplica o princípio, grava exatamente o texto aprovado e não toca em outro arquivo.
6. Vigia relê `references/learnings.md` e confirma a promoção. Todos os harnesses passam a consumir a mesma atualização na próxima invocação ou recarga.
7. Memórias privadas de Kiro, Claude, Codex ou Hermes nunca são canônicas e não podem sobrescrever esta Skill.
8. Não promova incidentes, logs, segredos, preferências transitórias, suposições, regras já existentes nem lições sem evidência.

“Simultâneo” significa leitura da mesma fonte por todos os papéis e harnesses. Escritas concorrentes são proibidas: promoções são sempre serializadas por Lava.

## Handoff obrigatório

1. **Lava** investiga e define uma tarefa pequena, com objetivo, arquivos, precedentes, critérios de aceitação e validações.
2. **Lava delega à Forja** com `LAVA_HANDOFF: Forja`; a Forja produz baseline e manifesto, implementa o menor diff correto, executa checks específicos e entrega um snapshot final imutável com evidências.
3. **Lava delega à Vigia somente depois da Forja** com `LAVA_HANDOFF: Vigia`. A Vigia revisa de forma independente o pedido, manifesto, diff e arquivos completos, executa `pnpm verify` uma vez no snapshot recebido e não edita.
4. Se a Vigia retornar `NEEDS_CHANGES`, Lava delega à Forja somente as correções apontadas e depois solicita nova revisão da Vigia.
5. Lava conclui somente após `APPROVED` e validação final bem-sucedida.

## Estados de saída

- `CLARIFICATION_REQUIRED:` falta um detalhe necessário de produto ou existe conflito de requisitos. Faça uma pergunta objetiva e interrompa o trabalho.
- `VALIDATION_BLOCKED:` ambiente, permissão, ferramenta ou gate impossível impede registrar ou executar uma validação. Relate o bloqueio sem classificá-lo como defeito de código nem iniciar loop de correção.
- `NEEDS_CHANGES:` a revisão encontrou problema causado pela mudança em correção, requisito, regressão ou validação. Inclua achados acionáveis com arquivo e impacto.
- `APPROVED:` a revisão não encontrou achados e todos os gates obrigatórios passaram. Inclua os resultados exatos das validações.

## Limites

Não faça refatoração, abstração, funcionalidade ou dependência fora do pedido. Não faça commit, push, publicação, deploy ou ação destrutiva sem autorização explícita. Não alegue cobertura ou validação que não foi executada. Preserve acessibilidade, segurança, tratamento de erros e mudanças preexistentes.

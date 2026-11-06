---
name: vigia-frontend
description: Revisa de forma independente e sem editar as mudanças frontend do 1one, verificando requisitos, padrões locais, acessibilidade e validação.
tools: ["read", "shell"]
includeMcpJson: false
includePowers: false
resources:
  - file://README.md
  - file://package.json
  - file://components.json
  - file://biome.json
  - file://tsconfig.json
  - file://.agents/skills/1one-frontend-team/SKILL.md
  - file://.agents/skills/1one-frontend-team/references/vigia-frontend.md
  - file://.agents/skills/1one-frontend-team/references/learnings.md
  - file://.agents/skills/1one-frontend-team/references/rubric.md
permissions:
  rules:
    - capability: shell
      match: ["pnpm verify", "pnpm check", "pnpm check:ci", "pnpm typecheck", "pnpm check:tokens", "pnpm check:modal", "pnpm check:nav", "pnpm check:proxy", "pnpm check:logo", "pnpm check:login", "git diff*", "git status*"]
      effect: allow
---

Leia a Skill `1one-frontend-team`, `references/vigia-frontend.md`, `references/learnings.md` e `references/rubric.md`; essas fontes canônicas definem integralmente sua identidade, seu contrato e seu aprendizado.

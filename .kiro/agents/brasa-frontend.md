---
name: brasa-frontend
description: Implementa e autorrevisa alterações frontend estritamente simples no 1one, escalando qualquer tarefa fora do caminho rápido.
tools: ["read", "write", "shell", "@builtin"]
includeMcpJson: false
includePowers: false
resources:
  - file://README.md
  - file://package.json
  - file://components.json
  - file://biome.json
  - file://tsconfig.json
  - file://.agents/skills/1one-frontend-team/SKILL.md
  - file://.agents/skills/1one-frontend-team/references/brasa-frontend.md
  - file://.agents/skills/1one-frontend-team/references/learnings.md
  - file://.agents/skills/1one-frontend-team/references/rubric.md
permissions:
  rules:
    - capability: subagent
      match: ["lava"]
      effect: allow
    - capability: fs_write
      match: ["src/**", "scripts/**"]
      effect: allow
    - capability: shell
      match: ["pnpm verify", "pnpm check", "pnpm check:ci", "pnpm exec biome check*", "pnpm typecheck", "pnpm check:tokens", "pnpm check:modal", "pnpm check:nav", "pnpm check:proxy", "pnpm check:logo", "pnpm check:login", "git diff*", "git status*"]
      effect: allow
---

Leia a Skill `1one-frontend-team`, `references/brasa-frontend.md`, `references/learnings.md` e `references/rubric.md`; essas fontes canônicas definem integralmente sua identidade, seu contrato e seu aprendizado.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const canonicalRoot = ".agents/skills/1one-frontend-team";
const roles = [
  "lava",
  "forja-frontend",
  "vigia-frontend",
  "brasa-frontend",
] as const;

type KiroAgent = {
  name: string;
  prompt: string;
  tools: string[];
  allowedTools?: string[];
  toolsSettings?: Record<
    string,
    {
      allowedCommands?: string[];
      deniedCommands?: string[];
      allowedPaths?: string[];
      availableAgents?: string[];
      trustedAgents?: string[];
    }
  >;
  resources?: string[];
};

const read = (path: string) => readFile(join(root, path), "utf8");
const readKiroAgent = async (role: (typeof roles)[number]) => {
  const config = JSON.parse(
    await read(`.kiro/agents/${role}.json`),
  ) as KiroAgent;
  assert.equal(config.name, role, `Nome Kiro divergente: ${role}`);
  assert.ok(Array.isArray(config.tools), `Tools Kiro ausentes: ${role}`);
  return config;
};

const sharedReferences = [
  `${canonicalRoot}/SKILL.md`,
  `${canonicalRoot}/references/learnings.md`,
  `${canonicalRoot}/references/rubric.md`,
];

const domainSkills = [
  "1one-frontend-architecture",
  "1one-api-orval",
  "1one-design-system-accessibility",
  "1one-auth-session",
  "1one-brand-verification",
  "1one-navigation-routing",
  "1one-modal-state",
  "1one-quality-validation",
] as const;
const teamSkill = await read(`${canonicalRoot}/SKILL.md`);

for (const skill of domainSkills) {
  const path = `.agents/skills/${skill}/SKILL.md`;
  const content = await read(path);
  assert.match(
    content,
    new RegExp(`^---\\nname: ${skill}\\ndescription: .+\\n---\\n`),
    `${path}: frontmatter inválido`,
  );
  assert.ok(
    teamSkill.includes(path),
    `Skill da equipe deve referenciar ${path}`,
  );
}

const [lavaRole, forjaRole, vigiaRole, agentsReadme] = await Promise.all([
  read(`${canonicalRoot}/references/lava.md`),
  read(`${canonicalRoot}/references/forja-frontend.md`),
  read(`${canonicalRoot}/references/vigia-frontend.md`),
  read(".agents/README.md"),
]);
assert.ok(lavaRole.includes("LAVA_HANDOFF: Forja"));
assert.ok(lavaRole.includes("LAVA_HANDOFF: Vigia"));
assert.ok(forjaRole.includes("LAVA_HANDOFF: Forja"));
assert.ok(vigiaRole.includes("LAVA_HANDOFF: Vigia"));
assert.doesNotMatch(agentsReadme, /kiro-cli chat --agent (?:forja|vigia)/);

for (const role of roles) {
  const roleReference = `${canonicalRoot}/references/${role}.md`;
  const canonicalPaths = [...sharedReferences, roleReference];
  await Promise.all(canonicalPaths.map(read));

  const adapters = await Promise.all([
    read(`.kiro/agents/${role}.json`),
    read(`.claude/agents/${role}.md`),
    read(`.codex/agents/${role}.toml`),
  ]);

  for (const path of canonicalPaths) {
    assert.ok(
      adapters.every((adapter) => adapter.includes(path)),
      `${role}: todos os adaptadores devem referenciar ${path}`,
    );
  }
}

const [kiroLava, kiroForja, kiroVigia, kiroBrasa] = await Promise.all(
  roles.map(readKiroAgent),
);
const [claudeLava, claudeVigia, codexLava, codexVigia, codexConfig] =
  await Promise.all([
    read(".claude/agents/lava.md"),
    read(".claude/agents/vigia-frontend.md"),
    read(".codex/agents/lava.toml"),
    read(".codex/agents/vigia-frontend.toml"),
    read(".codex/config.toml"),
  ]);

assert.ok(kiroLava.tools.includes("subagent"));
assert.ok(!kiroLava.tools.includes("fs_write"));
assert.ok(!kiroLava.tools.includes("execute_bash"));
assert.deepEqual(kiroLava.toolsSettings?.subagent?.availableAgents, [
  "forja-frontend",
  "vigia-frontend",
]);

assert.ok(!kiroVigia.tools.includes("fs_write"));
const forjaWritePaths = kiroForja.toolsSettings?.fs_write?.allowedPaths ?? [];
for (const requiredPath of [
  "openapi/**",
  "package.json",
  "README.md",
  "next.config.ts",
]) {
  assert.ok(
    forjaWritePaths.includes(requiredPath),
    `Forja no Kiro deve permitir escrita necessária em ${requiredPath}`,
  );
}
const forjaCommands =
  kiroForja.toolsSettings?.execute_bash?.allowedCommands?.join("\n") ?? "";
for (const command of ["api:pull", "api:gen", "api:sync"]) {
  assert.ok(
    forjaCommands.includes(command),
    `Forja no Kiro deve permitir pnpm ${command}`,
  );
}
assert.deepEqual(kiroBrasa.toolsSettings?.subagent?.availableAgents, ["lava"]);
assert.ok(
  !(kiroBrasa.toolsSettings?.fs_write?.allowedPaths ?? []).includes(
    "openapi/**",
  ),
  "Brasa não pode escrever saídas do Orval",
);

const commandIsAllowed = (agent: KiroAgent, command: string) => {
  const settings = agent.toolsSettings?.execute_bash;
  const allowed = settings?.allowedCommands?.some((pattern) =>
    new RegExp(pattern).test(command),
  );
  const denied = settings?.deniedCommands?.some((pattern) =>
    new RegExp(pattern).test(command),
  );
  return allowed === true && denied !== true;
};

for (const agent of [kiroForja, kiroVigia, kiroBrasa]) {
  for (const unsafeCommand of [
    "git diff --output=/tmp/leak",
    "git diff > /tmp/leak",
    "pnpm exec biome check file.ts > /tmp/leak",
    "pnpm exec biome check $(touch /tmp/leak)",
    "pnpm exec biome check `touch /tmp/leak`",
    "node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON scripts/check-example.mts > /tmp/leak",
    "node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON scripts/check-example.mts; touch /tmp/leak",
    "node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON scripts/not-a-check.mts",
  ]) {
    assert.equal(
      commandIsAllowed(agent, unsafeCommand),
      false,
      `${agent.name} permitiu comando inseguro: ${unsafeCommand}`,
    );
  }
}
assert.ok(commandIsAllowed(kiroForja, "git diff --cached --check"));
assert.ok(
  commandIsAllowed(
    kiroForja,
    "pnpm exec biome check --error-on-warnings 'src/app/(app)/home/page.tsx'",
  ),
);
assert.ok(
  commandIsAllowed(
    kiroVigia,
    "pnpm exec biome check --error-on-warnings 'src/app/(app)/home/page.tsx'",
  ),
);
assert.equal(
  commandIsAllowed(kiroVigia, "pnpm exec biome check --write src/app/page.tsx"),
  false,
);
assert.ok(commandIsAllowed(kiroVigia, "pnpm verify"));
for (const agent of [kiroForja, kiroVigia, kiroBrasa]) {
  assert.ok(
    commandIsAllowed(
      agent,
      "node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON scripts/check-example.mts",
    ),
    `${agent.name} deve executar checks node:assert do repositório`,
  );
  assert.ok(
    commandIsAllowed(agent, "pnpm check:logout"),
    `${agent.name} deve executar o check de logout`,
  );
}

assert.doesNotMatch(claudeLava, /^tools:.*(?:Write|Edit|Bash)/m);
assert.match(claudeVigia, /^disallowedTools:.*Write.*Edit/m);
assert.match(codexLava, /^sandbox_mode = "read-only"/m);
assert.match(codexVigia, /^sandbox_mode = "read-only"/m);

for (const role of roles) {
  assert.ok(
    codexConfig.includes(`[agents.${role}]`),
    `Codex deve registrar ${role}`,
  );
  assert.ok(
    codexConfig.includes(`config_file = "./agents/${role}.toml"`),
    `Codex deve apontar ${role} para seu adaptador`,
  );
}

const kiroVersion = spawnSync("kiro-cli", ["--version"], { encoding: "utf8" });
if (
  (kiroVersion.error as NodeJS.ErrnoException | undefined)?.code === "ENOENT"
) {
  console.log("Kiro CLI unavailable; skipped native agent validation.");
} else {
  assert.equal(kiroVersion.status, 0, kiroVersion.stderr);
  for (const role of roles) {
    const validation = spawnSync(
      "kiro-cli",
      ["agent", "validate", "--path", `.kiro/agents/${role}.json`],
      { encoding: "utf8" },
    );
    assert.equal(validation.status, 0, validation.stderr || validation.stdout);
  }
  const discovery = spawnSync("kiro-cli", ["agent", "list"], {
    encoding: "utf8",
  });
  assert.equal(discovery.status, 0, discovery.stderr);
  const discoveryOutput = `${discovery.stdout}\n${discovery.stderr}`;
  for (const role of roles) {
    assert.ok(discoveryOutput.includes(role), `Kiro CLI não descobriu ${role}`);
  }
}

console.log("Agent configuration checks passed.");

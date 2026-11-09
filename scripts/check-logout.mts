// Invariantes estruturais do logout local.
//
// Este check prova a composição declarada, a trava síncrona contra repetição,
// a fronteira local de cookie e a integração do runner. Ele não monta React nem
// Radix em um browser, portanto não prova foco, teclado, portal ou hidratação.
// Rodar: pnpm check:logout
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [profile, route, packageSource] = await Promise.all(
  [
    "../src/components/layout/user-profile.tsx",
    "../src/app/api/auth/logout/route.ts",
    "../package.json",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);

assert.doesNotMatch(
  profile,
  /\bPopover(?:Trigger|Content)?\b/,
  "logout não pode usar Popover como confirmação",
);
assert.match(
  profile,
  /<TooltipTrigger asChild>\s*<AlertDialogTrigger asChild>\s*<SidebarMenuButton/,
  "Tooltip e AlertDialog precisam compor diretamente o mesmo botão",
);
assert.match(profile, /type="button"/);
assert.match(profile, /aria-label="Sair"/);
assert.match(profile, /aria-busy=\{isLoggingOut\}/);
assert.match(profile, /<AlertDialogTitle>Sair da conta\?<\/AlertDialogTitle>/);
assert.match(
  profile,
  /<AlertDialogDescription>[\s\S]*?Você voltará para a tela de login\.[\s\S]*?<\/AlertDialogDescription>/,
);
assert.match(profile, /<AlertDialogCancel disabled=\{isLoggingOut\}>/);
assert.match(
  profile,
  /<AlertDialogAction[\s\S]*?variant="destructive"[\s\S]*?disabled=\{isLoggingOut\}[\s\S]*?onClick=\{handleLogout\}/,
);

assert.match(profile, /const logoutStarted = useRef\(false\)/);
assert.match(profile, /if \(logoutStarted\.current\) return/);
assert.match(
  profile,
  /logoutStarted\.current = true;[\s\S]*?fetch\("\/api\/auth\/logout", \{ method: "POST" \}\)/,
  "a trava precisa ocorrer antes do único pedido local de logout",
);
assert.match(
  profile,
  /try \{[\s\S]*?await fetch\([\s\S]*?\} finally \{\s*window\.location\.replace\("\/login"\)/,
  "a navegação local precisa ocorrer mesmo se o pedido falhar",
);

assert.match(route, /await clearAccessToken\(\)/);
assert.doesNotMatch(
  route,
  /\bfetch\s*\(|upstreamUrl|getAccessToken|BACKEND_URL|auth["'],\s*["']logout/,
  "a fronteira local não pode depender do endpoint provisório do backend",
);
assert.ok(
  route.indexOf("await clearAccessToken()") <
    route.indexOf("return Response.json({ ok: true })"),
  "o cookie precisa ser limpo antes da resposta de sucesso",
);

const packageJson = JSON.parse(packageSource) as {
  scripts: Record<string, string>;
  "lint-staged": Record<string, string[]>;
};
assert.equal(
  packageJson.scripts["check:logout"],
  "node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON scripts/check-logout.mts",
);
assert.match(packageJson.scripts.verify, /pnpm check:logout/);
const logoutPreCommit = Object.entries(packageJson["lint-staged"]).find(
  ([paths]) =>
    paths.includes("src/components/layout/user-profile.tsx") &&
    paths.includes("src/app/api/auth/logout/route.ts") &&
    paths.includes("scripts/check-logout.mts"),
)?.[1];
assert.ok(logoutPreCommit, "mapeamento pre-commit do logout não encontrado");
assert.ok(
  logoutPreCommit.includes(
    "node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON scripts/check-logout.mts",
  ),
  "pre-commit precisa executar check:logout nos arquivos do fluxo",
);

console.log("ok — logout local: 20 invariantes estruturais");

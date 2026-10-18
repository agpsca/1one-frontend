// Baixa o schema OpenAPI do backend para openapi/openapi.json (entrada do Orval).
// Rodar: pnpm api:pull  (ou OPENAPI_URL=... pnpm api:pull)
import { mkdir, writeFile } from "node:fs/promises";

const url = process.env.OPENAPI_URL ?? "http://localhost:8000/openapi.json";

// fetch() rejeita (em vez de retornar !ok) quando nao ha ninguem escutando;
// sem o catch isso vira stack trace do Node em vez de instrucao acionavel.
let res: Response;
try {
  res = await fetch(url);
} catch (cause) {
  console.error(`Nao foi possivel conectar em ${url}`);
  console.error(`  ${cause instanceof Error ? cause.message : String(cause)}`);
  console.error(
    "O backend esta rodando? Defina OPENAPI_URL se a URL for outra.",
  );
  process.exit(1);
}

if (!res.ok) {
  console.error(`Falha ao baixar ${url}: HTTP ${res.status}`);
  process.exit(1);
}
const spec = await res.json();
await mkdir("openapi", { recursive: true });
await writeFile("openapi/openapi.json", `${JSON.stringify(spec, null, 2)}\n`);
console.log(`Schema salvo em openapi/openapi.json (de ${url})`);

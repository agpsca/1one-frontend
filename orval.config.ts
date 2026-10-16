import { defineConfig } from "orval";

const input = "./openapi/openapi.json";

export default defineConfig({
  api: {
    input,
    output: {
      target: "src/api/generated/endpoints",
      schemas: "src/api/generated/models",
      client: "react-query",
      mode: "tags-split",
      clean: true,
      override: {
        // Os hooks gerados assumem que o fetcher devolve só o corpo parseado,
        // que é o que o customFetch faz. Sem isto o httpClient fetch embrulha
        // o retorno em { data, status, headers } e o tipo do hook não fecha.
        fetch: { includeHttpResponseReturnType: false },
        mutator: { path: "src/api/fetcher.ts", name: "customFetch" },
      },
    },
  },
  zod: {
    input,
    output: {
      target: "src/api/generated/zod",
      client: "zod",
      mode: "tags-split",
      clean: true,
    },
  },
});

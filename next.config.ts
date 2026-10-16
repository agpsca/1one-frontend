import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Emite .next/standalone com apenas os node_modules realmente usados
  // (rastreados pelo Next). E o que o Dockerfile copia para a imagem final.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

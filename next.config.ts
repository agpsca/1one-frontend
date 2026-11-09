import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Emite .next/standalone com apenas os node_modules realmente usados
  // (rastreados pelo Next). E o que o Dockerfile copia para a imagem final.
  output: "standalone",
  // Só o `next dev` consulta esta lista. Libera o loopback para quem abre
  // http://127.0.0.1:3000; IPs de rede ficam de fora de propósito.
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: {
    agentUpgrade: "security",
  },
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

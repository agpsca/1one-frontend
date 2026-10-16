# syntax=docker/dockerfile:1

# ---------- builder: instala e compila ----------
FROM node:22-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0

# Instalar e compilar no mesmo estagio: o node_modules do pnpm e uma arvore de
# symlinks para .pnpm, e copiar isso entre estagios e fragil.
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# `corepack prepare` sem versao le o campo packageManager do package.json,
# que e a unica fonte da versao do pnpm.
RUN corepack prepare --activate && pnpm install --frozen-lockfile

COPY . .

# Variaveis NEXT_PUBLIC_* sao embutidas no bundle, portanto precisam existir
# aqui, em build time. Passar com: docker build --build-arg NEXT_PUBLIC_API_URL=...
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

# ---------- runner ----------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Sem isso o server escuta em localhost e fica inacessivel de fora do container.
ENV HOSTNAME=0.0.0.0

# O standalone nao inclui public/ nem .next/static: precisam vir a parte.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# A imagem node ja traz o usuario `node`; rodar como root e desnecessario aqui.
USER node

EXPOSE 3000
# O standalone roda com node puro: nao precisa de pnpm na imagem final.
CMD ["node", "server.js"]

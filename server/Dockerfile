# better-sqlite3 e sharp são módulos nativos. As imagens Debian têm os
# prebuilds dos dois; as ferramentas de compilação ficam neste estágio só
# como rede de segurança, e não vão para a imagem final.
FROM node:20-bookworm-slim AS deps

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev


FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

# O volume é montado em /dados. Dono precisa ser o usuário node, senão o
# processo sem privilégio não consegue criar o banco nem gravar upload.
RUN mkdir -p /dados/uploads && chown -R node:node /dados /app

USER node
EXPOSE 3333

CMD ["node", "src/index.js"]

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No Docker a API é o host `api`; rodando direto na máquina, é localhost.
const alvoApi = process.env.API_URL ?? "http://localhost:3333";

export default defineConfig({
  plugins: [react()],
  build: {
    // Os bundles saem em /build/ em vez do /assets/ padrão, que é onde
    // moram as imagens da marca vindas de public/. Separados, cada um
    // recebe a política de cache certa no nginx: os arquivos com hash no
    // nome podem ser imutáveis, as imagens não.
    assetsDir: "build",
  },
  server: {
    // Em dev o Vite faz o papel que o nginx faz em produção: encaminhar
    // /api e /uploads para o servidor. Assim tudo continua same-origin e o
    // cookie de sessão funciona igual nos dois ambientes.
    proxy: {
      "/api": { target: alvoApi, changeOrigin: true },
      "/uploads": { target: alvoApi, changeOrigin: true },
    },
  },
});

# Campelo Landing (React + Vite + Tailwind)

Migração fiel da landing page estática para React + Vite + Tailwind, mantendo layout, tipografia, cores, responsividade e interações.

## Estrutura
- `index.html`: metatags, fontes Google e script do Lucide.
- `src/App.tsx`: todo o HTML da landing page convertido para JSX (IDs/classes preservados).
- `src/index.css`: Tailwind + CSS custom do `<style>` original.
- `src/lib/landing.ts`: scripts de interação (reveal, menu mobile, lucide icons).
- `public/assets/*`: assets copiados mantendo os paths originais `assets/...`.
- `Dockerfile.dev`: dev server Vite.
- `Dockerfile`: build e Nginx para produção.
- `nginx.conf`: SPA fallback.

## Como rodar (local)
```bash
npm install
npm run dev
```

Build de produção:
```bash
npm run build
npm run preview
```

## Docker
DEV:
```bash
docker compose --profile dev up --build
```

PROD:
```bash
docker compose --profile prod up --build
```

- Dev: `http://localhost:5173`
- Prod: `http://localhost:8080`

## Notas de fidelidade
- As tags do `<head>` foram movidas para `index.html`.
- O CSS inline foi migrado para `src/index.css`.
- O JS inline foi migrado para `src/lib/landing.ts` e executa via `useEffect`.
- Os paths `assets/...` continuam iguais e agora apontam para `public/assets`.
- O background `Backgroung.png` continua referenciado na raiz (`/Backgroung.png`). Se esse arquivo existir, coloque-o na raiz do projeto (ex.: `public/Backgroung.png`).

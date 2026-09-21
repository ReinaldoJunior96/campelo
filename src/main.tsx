import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Blog from "./blog/Blog";
import BlogPost from "./blog/BlogPost";
import "./index.css";

/**
 * Roteamento por caminho, sem biblioteca.
 *
 * Todas as telas são carregadas via `<a href>`, nunca navegação client-side
 * entre elas — um router traria árvore de rotas, histórico e mais um pacote
 * no bundle para resolver isto. O nginx devolve o index.html em qualquer
 * rota (try_files), então `/admin` e `/blog/*` chegam até aqui em vez de
 * dar 404.
 *
 * `Admin` é `lazy`: é o único lugar que importa o editor de texto rico do
 * blog (Tiptap), e sem isso essa dependência entraria no bundle que a home
 * e o `/blog` baixam também.
 */
const Admin = lazy(() => import("./admin/Admin"));

const caminho = window.location.pathname.replace(/\/+$/, "") || "/";
const post = caminho.match(/^\/blog\/([^/]+)$/);

function Carregando() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-areia-funda">
      <p className="text-sm text-tinta/65">Carregando…</p>
    </main>
  );
}

function Rota() {
  if (caminho === "/admin") {
    return (
      <Suspense fallback={<Carregando />}>
        <Admin />
      </Suspense>
    );
  }

  if (caminho === "/blog") return <Blog />;
  if (post) return <BlogPost slug={post[1]} />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Rota />
  </React.StrictMode>,
);

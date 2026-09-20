import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Admin from "./admin/Admin";
import "./index.css";

/**
 * Roteamento por caminho, sem biblioteca.
 *
 * São duas telas e nenhuma navegação entre elas dentro do app: ir para o
 * painel é recarregar a página. Um router traria árvore de rotas, histórico
 * e mais um pacote no bundle para resolver um `if`.
 *
 * O nginx devolve o index.html em qualquer rota (try_files), então /admin
 * chega até aqui em vez de dar 404.
 */
const ehAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>{ehAdmin ? <Admin /> : <App />}</React.StrictMode>,
);

import { Router } from "express";
import { config } from "../config.js";
import { consultas } from "../db.js";

export const rotasBlogPreview = Router();

/**
 * HTML mínimo para crawler de rede social (WhatsApp, Facebook, Twitter,
 * LinkedIn...), que não roda JavaScript e por isso nunca veria o
 * `document.title`/meta que a página React seta no cliente. O nginx só
 * encaminha para cá as requisições cujo User-Agent bate com um bot
 * conhecido (ver nginx.conf); um navegador normal nunca chega aqui.
 *
 * Este é o único lugar do projeto que monta HTML à mão em vez de deixar o
 * React escapar por conta própria — por isso todo valor interpolado passa
 * por `escaparHtml`, sem exceção.
 */

const ENTIDADES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escaparHtml = (valor) => String(valor).replace(/[&<>"']/g, (c) => ENTIDADES[c]);

function pagina({ titulo, descricao, url, imagem }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>${escaparHtml(titulo)}</title>
    <meta name="description" content="${escaparHtml(descricao)}" />
    <link rel="canonical" href="${escaparHtml(url)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escaparHtml(titulo)}" />
    <meta property="og:description" content="${escaparHtml(descricao)}" />
    <meta property="og:url" content="${escaparHtml(url)}" />
    ${imagem ? `<meta property="og:image" content="${escaparHtml(imagem)}" />` : ""}
    <meta name="twitter:card" content="${imagem ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${escaparHtml(titulo)}" />
    <meta name="twitter:description" content="${escaparHtml(descricao)}" />
  </head>
  <body>
    <a href="${escaparHtml(url)}">Ver a matéria completa</a>
  </body>
</html>`;
}

rotasBlogPreview.get("/blog-preview/:slug", (requisicao, resposta) => {
  const linha = consultas.postPublicadoPorSlug(requisicao.params.slug);
  resposta.type("html");

  if (!linha) {
    return resposta.status(404).send(
      pagina({
        titulo: "Post não encontrado | Campelo",
        descricao: "Este post não existe ou foi removido.",
        url: `${config.siteUrl}/blog`,
      }),
    );
  }

  resposta.send(
    pagina({
      titulo: `${linha.titulo} | Campelo`,
      descricao: linha.resumo,
      url: `${config.siteUrl}/blog/${linha.slug}`,
      imagem: linha.capa ? `${config.siteUrl}${linha.capa}` : null,
    }),
  );
});

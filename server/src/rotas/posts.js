import { Router } from "express";
import { exigirSessao } from "../auth.js";
import { agora, consultas } from "../db.js";
import { primeiraMensagem } from "../esquema.js";
import { esquemaPost } from "../esquemaPosts.js";

export const rotasPosts = Router();

/**
 * Rotas públicas e de admin ficam em prefixos diferentes (`/posts` e
 * `/admin/posts`), ao contrário de `/conteudo` (mesmo caminho, gate por
 * método): as duas precisam de formatos de resposta genuinamente diferentes
 * — a pública nunca inclui rascunho nem o corpo inteiro na listagem — então
 * dividir os prefixos evita que uma rota pública acabe reaproveitando por
 * engano uma consulta que devolveria rascunho.
 */

function slugBase(titulo) {
  const normalizado = titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

  return normalizado || "post";
}

/** Gera um slug a partir do título e resolve colisão tentando -2, -3... */
function gerarSlugUnico(titulo) {
  const base = slugBase(titulo);
  let slug = base;
  let contador = 2;

  while (consultas.postPorSlug(slug)) {
    slug = `${base}-${contador}`;
    contador++;
  }

  return slug;
}

function montarResumo(linha) {
  return {
    id: linha.id,
    slug: linha.slug,
    titulo: linha.titulo,
    resumo: linha.resumo,
    capa: linha.capa,
    capaAlt: linha.capa_alt,
    categoria: linha.categoria,
    publicadoEm: linha.publicado_em,
  };
}

function montarAdminItem(linha) {
  return {
    id: linha.id,
    slug: linha.slug,
    titulo: linha.titulo,
    categoria: linha.categoria,
    status: linha.status,
    criadoEm: linha.criado_em,
    atualizadoEm: linha.atualizado_em,
    publicadoEm: linha.publicado_em,
  };
}

function montarCompleto(linha) {
  return {
    id: linha.id,
    slug: linha.slug,
    titulo: linha.titulo,
    resumo: linha.resumo,
    categoria: linha.categoria,
    capa: linha.capa,
    capaAlt: linha.capa_alt,
    corpo: JSON.parse(linha.corpo),
    status: linha.status,
    criadoEm: linha.criado_em,
    atualizadoEm: linha.atualizado_em,
    publicadoEm: linha.publicado_em,
  };
}

// ---------- Público ----------

rotasPosts.get("/posts", (_requisicao, resposta) => {
  resposta.json({ itens: consultas.listarPostsPublicados().map(montarResumo) });
});

rotasPosts.get("/posts/:slug", (requisicao, resposta) => {
  // Rascunho não pode vazar nem para quem adivinhar o slug: por isso a
  // consulta já filtra por status, em vez de buscar por slug e checar depois.
  const linha = consultas.postPublicadoPorSlug(requisicao.params.slug);

  if (!linha) {
    return resposta.status(404).json({ erro: "Post não encontrado." });
  }

  resposta.json(montarCompleto(linha));
});

// ---------- Admin ----------

rotasPosts.get("/admin/posts", exigirSessao, (_requisicao, resposta) => {
  resposta.json({ itens: consultas.listarPostsAdmin().map(montarAdminItem) });
});

rotasPosts.get("/admin/posts/:id", exigirSessao, (requisicao, resposta) => {
  const id = Number(requisicao.params.id);
  const linha = Number.isInteger(id) ? consultas.postPorId(id) : null;

  if (!linha) {
    return resposta.status(404).json({ erro: "Post não encontrado." });
  }

  resposta.json(montarCompleto(linha));
});

rotasPosts.post("/admin/posts", exigirSessao, (requisicao, resposta) => {
  const validado = esquemaPost.safeParse(requisicao.body);

  if (!validado.success) {
    return resposta.status(400).json({ erro: primeiraMensagem(validado.error) });
  }

  const dados = validado.data;
  const momento = agora();

  const registro = {
    slug: gerarSlugUnico(dados.titulo),
    titulo: dados.titulo,
    resumo: dados.resumo,
    categoria: dados.categoria,
    capa: dados.capa,
    capaAlt: dados.capaAlt,
    corpo: JSON.stringify(dados.corpo),
    status: dados.status,
    criadoEm: momento,
    atualizadoEm: momento,
    publicadoEm: dados.status === "publicado" ? momento : null,
  };

  const { lastInsertRowid } = consultas.inserirPost(registro);
  resposta.status(201).json(montarCompleto(consultas.postPorId(Number(lastInsertRowid))));
});

rotasPosts.put("/admin/posts/:id", exigirSessao, (requisicao, resposta) => {
  const id = Number(requisicao.params.id);
  const atual = Number.isInteger(id) ? consultas.postPorId(id) : null;

  if (!atual) {
    return resposta.status(404).json({ erro: "Post não encontrado." });
  }

  const validado = esquemaPost.safeParse(requisicao.body);

  if (!validado.success) {
    return resposta.status(400).json({ erro: primeiraMensagem(validado.error) });
  }

  const dados = validado.data;

  // A data de publicação só é gravada na primeira transição para
  // "publicado". Editar um post já publicado depois não move a data.
  const publicadoEm =
    dados.status === "publicado" && !atual.publicado_em ? agora() : atual.publicado_em;

  consultas.atualizarPost(id, {
    titulo: dados.titulo,
    resumo: dados.resumo,
    categoria: dados.categoria,
    capa: dados.capa,
    capaAlt: dados.capaAlt,
    corpo: JSON.stringify(dados.corpo),
    status: dados.status,
    atualizadoEm: agora(),
    publicadoEm,
  });

  resposta.json(montarCompleto(consultas.postPorId(id)));
});

rotasPosts.delete("/admin/posts/:id", exigirSessao, (requisicao, resposta) => {
  const id = Number(requisicao.params.id);
  const atual = Number.isInteger(id) ? consultas.postPorId(id) : null;

  if (!atual) {
    return resposta.status(404).json({ erro: "Post não encontrado." });
  }

  consultas.apagarPost(id);
  resposta.status(204).end();
});

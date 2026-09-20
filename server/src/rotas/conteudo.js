import { Router } from "express";
import { exigirSessao } from "../auth.js";
import { consultas } from "../db.js";
import { esquemaConteudo, primeiraMensagem } from "../esquema.js";

export const rotasConteudo = Router();

/**
 * Conteúdo publicado. Rota pública: é o que o site inteiro consome.
 *
 * `dados` volta nulo enquanto ninguém tiver salvo nada pelo painel. Nesse
 * caso o front usa o padrão que já vem no bundle, então o site nunca
 * depende de existir registro no banco.
 */
rotasConteudo.get("/conteudo", (_requisicao, resposta) => {
  const registro = consultas.conteudoAtual();

  if (!registro) {
    return resposta.json({ dados: null, salvoEm: null });
  }

  resposta.json({
    dados: JSON.parse(registro.dados),
    salvoEm: registro.salvo_em,
  });
});

rotasConteudo.put("/conteudo", exigirSessao, (requisicao, resposta) => {
  const validado = esquemaConteudo.safeParse(requisicao.body?.dados);

  if (!validado.success) {
    return resposta.status(400).json({ erro: primeiraMensagem(validado.error) });
  }

  // Grava uma versão nova em vez de sobrescrever: o histórico fica no banco
  // e dá para voltar atrás se o Campelo apagar algo sem querer.
  consultas.inserirConteudo(validado.data, requisicao.usuario.email);

  const registro = consultas.conteudoAtual();
  return resposta.json({ salvoEm: registro.salvo_em });
});

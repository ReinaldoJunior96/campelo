import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import {
  autenticar,
  exigirSessao,
  gerarHash,
  gerarToken,
  gravarCookie,
  limparCookie,
} from "../auth.js";
import { consultas } from "../db.js";
import { esquemaLogin, esquemaSenha, primeiraMensagem } from "../esquema.js";

export const rotasSessao = Router();

/**
 * Cinco tentativas a cada quinze minutos por IP.
 *
 * Sem isso, uma senha de dez caracteres cai em força bruta sem esforço: a
 * API responde em milissegundos e nada impede milhares de tentativas por
 * minuto. O bcrypt ajuda, mas o limite é o que realmente segura.
 */
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { erro: "Tentativas demais. Espere quinze minutos e tente de novo." },
});

rotasSessao.post("/sessao", limiteLogin, async (requisicao, resposta) => {
  const validado = esquemaLogin.safeParse(requisicao.body);

  if (!validado.success) {
    return resposta.status(400).json({ erro: primeiraMensagem(validado.error) });
  }

  const usuario = await autenticar(validado.data.email, validado.data.senha);

  // Mensagem única para e-mail errado e senha errada: dizer qual dos dois
  // falhou confirma quais contas existem.
  if (!usuario) {
    return resposta.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  gravarCookie(resposta, gerarToken(usuario));
  return resposta.json({ email: usuario.email });
});

rotasSessao.get("/sessao", exigirSessao, (requisicao, resposta) => {
  resposta.json({ email: requisicao.usuario.email });
});

rotasSessao.delete("/sessao", (_requisicao, resposta) => {
  limparCookie(resposta);
  resposta.status(204).end();
});

rotasSessao.put("/senha", exigirSessao, async (requisicao, resposta) => {
  const validado = esquemaSenha.safeParse(requisicao.body);

  if (!validado.success) {
    return resposta.status(400).json({ erro: primeiraMensagem(validado.error) });
  }

  const confere = await bcrypt.compare(
    validado.data.senhaAtual,
    requisicao.usuario.senha_hash,
  );

  if (!confere) {
    return resposta.status(401).json({ erro: "A senha atual está incorreta." });
  }

  consultas.atualizarSenha(requisicao.usuario.id, await gerarHash(validado.data.senhaNova));

  // Trocar a senha derruba a sessão: se a troca foi porque a senha vazou,
  // manter o cookie válido deixaria o invasor logado do mesmo jeito.
  limparCookie(resposta);
  return resposta.status(204).end();
});

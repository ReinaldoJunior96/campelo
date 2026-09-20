import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { consultas } from "./db.js";

/**
 * Sessão por cookie httpOnly.
 *
 * O token não fica no localStorage de propósito: qualquer XSS na página
 * leria de lá. Em cookie httpOnly o JavaScript não alcança, e SameSite
 * strict cobre CSRF sem precisar de token anti-CSRF separado, já que a API
 * só aceita requisição da própria origem.
 */

export function gerarToken(usuario) {
  return jwt.sign({ sub: usuario.email }, config.jwtSegredo, {
    expiresIn: config.sessaoDuracaoSegundos,
  });
}

export function gravarCookie(resposta, token) {
  resposta.cookie(config.cookieNome, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: config.cookieSeguro,
    maxAge: config.sessaoDuracaoSegundos * 1000,
    path: "/",
  });
}

export function limparCookie(resposta) {
  resposta.clearCookie(config.cookieNome, {
    httpOnly: true,
    sameSite: "strict",
    secure: config.cookieSeguro,
    path: "/",
  });
}

/**
 * Confere e-mail e senha.
 *
 * Quando o e-mail não existe, ainda assim roda um bcrypt.compare contra um
 * hash descartável. Sem isso, a resposta para e-mail inexistente volta bem
 * mais rápido do que para e-mail válido, e esse tempo entrega quais contas
 * existem.
 */
const HASH_DESCARTE = bcrypt.hashSync("comparacao-de-tempo-constante", 12);

export async function autenticar(email, senha) {
  const usuario = consultas.usuarioPorEmail(email);

  if (!usuario) {
    await bcrypt.compare(senha, HASH_DESCARTE);
    return null;
  }

  const confere = await bcrypt.compare(senha, usuario.senha_hash);
  return confere ? usuario : null;
}

/** Barra a requisição quando não há sessão válida. */
export function exigirSessao(requisicao, resposta, proximo) {
  const token = requisicao.cookies?.[config.cookieNome];

  if (!token) {
    return resposta.status(401).json({ erro: "Faça login para continuar." });
  }

  try {
    const conteudo = jwt.verify(token, config.jwtSegredo);
    const usuario = consultas.usuarioPorEmail(conteudo.sub);

    // A conta pode ter sido removida ou renomeada depois que o token foi
    // emitido. Assinatura válida não basta: o usuário precisa existir agora.
    if (!usuario) {
      limparCookie(resposta);
      return resposta.status(401).json({ erro: "Sessão expirada." });
    }

    requisicao.usuario = usuario;
    return proximo();
  } catch {
    limparCookie(resposta);
    return resposta.status(401).json({ erro: "Sessão expirada." });
  }
}

export const gerarHash = (senha) => bcrypt.hash(senha, 12);

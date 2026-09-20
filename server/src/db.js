import fs from "node:fs";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { config } from "./config.js";

fs.mkdirSync(config.dadosDir, { recursive: true });
fs.mkdirSync(config.uploadsDir, { recursive: true });

export const db = new Database(config.bancoArquivo);

// WAL deixa leitura e escrita concorrerem sem travar uma à outra. Para uma
// carga como esta é folgado, mas é o padrão certo e sai de graça.
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS usuario (
    id            INTEGER PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    senha_hash    TEXT NOT NULL,
    criado_em     TEXT NOT NULL,
    atualizado_em TEXT NOT NULL
  );

  -- Append-only de propósito: cada gravação vira uma linha nova, e a atual é
  -- a de maior id. Isso dá histórico e permite desfazer sem nenhum código a
  -- mais. O conteúdo inteiro do site cabe em poucos KB por versão.
  CREATE TABLE IF NOT EXISTS conteudo (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    dados     TEXT NOT NULL,
    salvo_em  TEXT NOT NULL,
    salvo_por TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS midia (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    arquivo       TEXT NOT NULL UNIQUE,
    nome_original TEXT NOT NULL,
    largura       INTEGER NOT NULL,
    altura        INTEGER NOT NULL,
    bytes         INTEGER NOT NULL,
    criado_em     TEXT NOT NULL
  );
`);

export const agora = () => new Date().toISOString();

/**
 * Cria a conta inicial quando o banco ainda não tem nenhuma.
 *
 * Sem ADMIN_SENHA definida, nenhuma conta é criada e o servidor avisa. É
 * melhor subir sem painel do que subir com uma senha padrão que ninguém
 * lembra de trocar.
 */
export function semearUsuario() {
  const total = db.prepare("SELECT COUNT(*) AS n FROM usuario").get().n;
  if (total > 0) return;

  if (!config.adminSenha || config.adminSenha.length < 10) {
    console.warn(
      "[db] Nenhum usuário cadastrado e ADMIN_SENHA ausente ou com menos de 10 caracteres.\n" +
        "     O painel fica inacessível até você rodar: npm run senha -- <email> <senha>",
    );
    return;
  }

  // O login valida o formato do e-mail; a criação da conta precisa validar
  // igual. Sem isto, um ADMIN_EMAIL como "campelo@local" cria a conta com
  // sucesso e depois recusa todo login com um 400 que não explica nada.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(config.adminEmail)) {
    console.warn(
      `[db] ADMIN_EMAIL "${config.adminEmail}" não é um endereço válido, então nenhuma conta foi criada.\n` +
        "     Use um e-mail com domínio completo (ex.: campelo@gmail.com).",
    );
    return;
  }

  const momento = agora();
  db.prepare(
    "INSERT INTO usuario (email, senha_hash, criado_em, atualizado_em) VALUES (?, ?, ?, ?)",
  ).run(config.adminEmail, bcrypt.hashSync(config.adminSenha, 12), momento, momento);

  console.log(`[db] Conta inicial criada para ${config.adminEmail}.`);
}

export const consultas = {
  usuarioPorEmail: (email) =>
    db.prepare("SELECT * FROM usuario WHERE email = ? COLLATE NOCASE").get(email),

  atualizarSenha: (id, hash) =>
    db
      .prepare("UPDATE usuario SET senha_hash = ?, atualizado_em = ? WHERE id = ?")
      .run(hash, agora(), id),

  conteudoAtual: () => db.prepare("SELECT * FROM conteudo ORDER BY id DESC LIMIT 1").get(),

  inserirConteudo: (dados, email) =>
    db
      .prepare("INSERT INTO conteudo (dados, salvo_em, salvo_por) VALUES (?, ?, ?)")
      .run(JSON.stringify(dados), agora(), email),

  listarMidia: () => db.prepare("SELECT * FROM midia ORDER BY id DESC").all(),

  midiaPorId: (id) => db.prepare("SELECT * FROM midia WHERE id = ?").get(id),

  inserirMidia: (registro) =>
    db
      .prepare(
        `INSERT INTO midia (arquivo, nome_original, largura, altura, bytes, criado_em)
         VALUES (@arquivo, @nomeOriginal, @largura, @altura, @bytes, @criadoEm)`,
      )
      .run(registro),

  apagarMidia: (id) => db.prepare("DELETE FROM midia WHERE id = ?").run(id),
};

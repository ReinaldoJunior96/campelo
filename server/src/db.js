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

  -- Diferente de "conteudo", esta tabela é mutável (UPDATE no lugar): são
  -- muitos posts, editados com frequência, com corpo potencialmente grande.
  -- Duplicar a linha inteira a cada correção de digitação não compensa como
  -- compensa para o documento único e pequeno da landing page.
  CREATE TABLE IF NOT EXISTS post (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    slug          TEXT NOT NULL UNIQUE,
    titulo        TEXT NOT NULL,
    resumo        TEXT NOT NULL,
    categoria     TEXT NOT NULL,
    capa          TEXT NOT NULL,
    capa_alt      TEXT NOT NULL,
    corpo         TEXT NOT NULL,
    status        TEXT NOT NULL CHECK (status IN ('rascunho', 'publicado')),
    criado_em     TEXT NOT NULL,
    atualizado_em TEXT NOT NULL,
    publicado_em  TEXT
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

  listarPostsPublicados: () =>
    db
      .prepare(
        `SELECT id, slug, titulo, resumo, capa, capa_alt, categoria, publicado_em
         FROM post WHERE status = 'publicado' ORDER BY publicado_em DESC`,
      )
      .all(),

  listarPostsAdmin: () =>
    db
      .prepare(
        `SELECT id, slug, titulo, categoria, status, criado_em, atualizado_em, publicado_em
         FROM post ORDER BY atualizado_em DESC`,
      )
      .all(),

  postPorId: (id) => db.prepare("SELECT * FROM post WHERE id = ?").get(id),

  postPorSlug: (slug) => db.prepare("SELECT * FROM post WHERE slug = ?").get(slug),

  postPublicadoPorSlug: (slug) =>
    db.prepare("SELECT * FROM post WHERE slug = ? AND status = 'publicado'").get(slug),

  inserirPost: (registro) =>
    db
      .prepare(
        `INSERT INTO post
           (slug, titulo, resumo, categoria, capa, capa_alt, corpo, status,
            criado_em, atualizado_em, publicado_em)
         VALUES
           (@slug, @titulo, @resumo, @categoria, @capa, @capaAlt, @corpo, @status,
            @criadoEm, @atualizadoEm, @publicadoEm)`,
      )
      .run(registro),

  atualizarPost: (id, registro) =>
    db
      .prepare(
        `UPDATE post SET
           titulo = @titulo, resumo = @resumo, categoria = @categoria, capa = @capa,
           capa_alt = @capaAlt, corpo = @corpo, status = @status,
           atualizado_em = @atualizadoEm, publicado_em = @publicadoEm
         WHERE id = @id`,
      )
      .run({ ...registro, id }),

  apagarPost: (id) => db.prepare("DELETE FROM post WHERE id = ?").run(id),

  // Alimenta a checagem de mídia em uso: uma imagem referenciada só por um
  // rascunho ainda não pode ser apagada por baixo do pano.
  todosCorposPosts: () => db.prepare("SELECT capa, corpo FROM post").all(),
};

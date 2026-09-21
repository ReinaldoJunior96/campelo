import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { exigirSessao } from "../auth.js";
import { config } from "../config.js";
import { agora, consultas } from "../db.js";

export const rotasMidia = Router();

/**
 * Upload em memória, não em disco.
 *
 * O arquivo nunca chega ao disco com o nome nem o formato que veio do
 * navegador. O sharp reescreve tudo como WebP, o que de quebra descarta
 * EXIF (inclusive coordenadas de GPS da foto) e qualquer coisa escondida
 * num arquivo que só finge ser imagem.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxBytes, files: 1 },
  fileFilter: (_requisicao, arquivo, callback) => {
    if (/^image\/(jpeg|png|webp|avif|gif)$/.test(arquivo.mimetype)) {
      return callback(null, true);
    }
    callback(new Error("Envie uma imagem JPG, PNG, WebP, AVIF ou GIF."));
  },
});

const paraUrl = (arquivo) => `/uploads/${arquivo}`;

/**
 * Concatena tudo que pode referenciar uma imagem: o conteúdo publicado da
 * landing page e a capa + corpo de todo post do blog (rascunho incluso —
 * uma imagem usada só num rascunho não pode ser apagada por baixo do pano).
 */
function haystack() {
  const conteudo = consultas.conteudoAtual()?.dados ?? "";
  const posts = consultas
    .todosCorposPosts()
    .map((p) => p.capa + p.corpo)
    .join("");
  return conteudo + posts;
}

function montarItem(registro, haystackAtual) {
  const url = paraUrl(registro.arquivo);

  return {
    id: registro.id,
    url,
    nomeOriginal: registro.nome_original,
    largura: registro.largura,
    altura: registro.altura,
    bytes: registro.bytes,
    criadoEm: registro.criado_em,
    // Conta ocorrências no que está publicado/salvo. Simples e suficiente: o
    // caminho é único e só aparece em campos de imagem.
    emUso: haystackAtual.split(url).length - 1,
  };
}

rotasMidia.get("/midia", exigirSessao, (_requisicao, resposta) => {
  const atual = haystack();
  resposta.json({ itens: consultas.listarMidia().map((r) => montarItem(r, atual)) });
});

rotasMidia.post("/midia", exigirSessao, upload.single("arquivo"), async (requisicao, resposta) => {
  if (!requisicao.file) {
    return resposta.status(400).json({ erro: "Nenhum arquivo recebido." });
  }

  const arquivo = `${crypto.randomBytes(16).toString("hex")}.webp`;
  const destino = path.join(config.uploadsDir, arquivo);

  try {
    const resultado = await sharp(requisicao.file.buffer)
      // `rotate()` sem argumento aplica a orientação do EXIF. Sem isso, foto
      // tirada de lado no celular aparece deitada no site.
      .rotate()
      .resize({
        width: config.imagemLarguraMax,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: config.imagemQualidade })
      .toFile(destino);

    const registro = {
      arquivo,
      nomeOriginal: requisicao.file.originalname.slice(0, 200),
      largura: resultado.width,
      altura: resultado.height,
      bytes: resultado.size,
      criadoEm: agora(),
    };

    const { lastInsertRowid } = consultas.inserirMidia(registro);

    return resposta
      .status(201)
      .json(montarItem(consultas.midiaPorId(Number(lastInsertRowid)), haystack()));
  } catch (erro) {
    // Se o sharp falhou depois de abrir o arquivo, não deixa lixo no volume.
    await fs.unlink(destino).catch(() => {});
    console.error("[midia] falha ao processar upload:", erro);
    return resposta.status(400).json({ erro: "Não consegui processar essa imagem." });
  }
});

rotasMidia.delete("/midia/:id", exigirSessao, async (requisicao, resposta) => {
  const id = Number(requisicao.params.id);
  const registro = Number.isInteger(id) ? consultas.midiaPorId(id) : null;

  if (!registro) {
    return resposta.status(404).json({ erro: "Imagem não encontrada." });
  }

  // Apagar uma imagem em uso (na landing page ou em qualquer post, mesmo
  // rascunho) deixaria um buraco publicado ou prestes a ser publicado.
  // Melhor barrar e explicar do que quebrar o site em silêncio.
  if (haystack().includes(paraUrl(registro.arquivo))) {
    return resposta.status(409).json({
      erro: "Esta imagem está em uso na página. Troque-a antes de apagar.",
    });
  }

  await fs.unlink(path.join(config.uploadsDir, registro.arquivo)).catch(() => {});
  consultas.apagarMidia(id);

  return resposta.status(204).end();
});

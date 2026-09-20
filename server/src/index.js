import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import multer from "multer";
import { config } from "./config.js";
import { semearUsuario } from "./db.js";
import { rotasConteudo } from "./rotas/conteudo.js";
import { rotasMidia } from "./rotas/midia.js";
import { rotasSessao } from "./rotas/sessao.js";

const app = express();

// Atrás de Caddy e nginx. Sem isto, o rate limit do login enxerga o IP do
// proxy em todas as requisições e limitaria o mundo inteiro pelo mesmo
// contador. O número é quantos saltos confiar: ver TRUST_PROXY no config.
app.set("trust proxy", config.trustProxy);
app.disable("x-powered-by");

app.use(
  helmet({
    // O nginx é quem serve o HTML e define a política da página. Aqui só
    // saem JSON e imagens, ambos consumidos pela mesma origem.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "same-origin" },
  }),
);

// O conteúdo inteiro do site tem poucos KB. O limite existe para que um
// corpo gigante seja recusado na porta, antes de virar trabalho.
app.use(express.json({ limit: "512kb" }));
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(config.uploadsDir, {
    // O nome do arquivo é aleatório e nunca é reaproveitado, então o
    // conteúdo de uma URL jamais muda: pode cachear para sempre.
    immutable: true,
    maxAge: "1y",
    index: false,
    dotfiles: "ignore",
  }),
);

app.get("/api/saude", (_requisicao, resposta) => resposta.json({ ok: true }));

app.use("/api", rotasSessao);
app.use("/api", rotasConteudo);
app.use("/api", rotasMidia);

app.use((_requisicao, resposta) => {
  resposta.status(404).json({ erro: "Rota não encontrada." });
});

app.use((erro, _requisicao, resposta, _proximo) => {
  if (erro instanceof multer.MulterError) {
    const mensagem =
      erro.code === "LIMIT_FILE_SIZE"
        ? `A imagem passou de ${Math.round(config.uploadMaxBytes / 1024 / 1024)} MB.`
        : "Não consegui receber esse arquivo.";
    return resposta.status(400).json({ erro: mensagem });
  }

  // Erro do fileFilter do multer chega aqui como Error comum.
  if (erro?.message?.startsWith("Envie uma imagem")) {
    return resposta.status(400).json({ erro: erro.message });
  }

  console.error("[erro]", erro);
  // Mensagem genérica de propósito: detalhe de stack em resposta HTTP
  // entrega estrutura interna para quem estiver sondando.
  return resposta.status(500).json({ erro: "Algo deu errado do nosso lado." });
});

semearUsuario();

app.listen(config.porta, () => {
  console.log(`[api] ouvindo na porta ${config.porta} (${config.producao ? "produção" : "dev"})`);
});

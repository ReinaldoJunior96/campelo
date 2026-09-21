import { z } from "zod";

/**
 * Validação do documento de conteúdo.
 *
 * Espelha `src/tipos.ts` no front. A validação do formulário não conta como
 * proteção: qualquer pessoa autenticada pode chamar PUT /api/conteudo direto
 * com o corpo que quiser. Este esquema é o que de fato decide o que entra
 * no banco.
 *
 * Os limites de tamanho não são preciosismo. Sem eles, um campo de texto
 * aceita um documento de vários MB, que passa a ser devolvido em toda
 * visita à página.
 */

export const texto = (max, min = 0) => z.string().trim().min(min).max(max);

/** Caminho de imagem: ou um asset do bundle, ou um upload nosso. Nada externo. */
export const caminhoImagem = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^\/(assets|uploads)\/[A-Za-z0-9._/-]+$/.test(v), {
    message: "A imagem precisa ser um arquivo do próprio site.",
  });

/**
 * Link: http, https, âncora interna ou arquivo local.
 *
 * `javascript:` e `data:` ficam de fora porque esses valores vão parar
 * direto num href renderizado na página pública.
 */
export const link = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^(https?:\/\/|\/|#)/i.test(v), {
    message: "O link precisa começar com http, https, / ou #.",
  });

const perfil = z.object({
  nome: texto(80, 1),
  profissao: texto(80, 1),
  crp: texto(40, 1),
  cidade: texto(120),
  modalidade: texto(120),
  formacao: texto(200),
  abordagem: texto(200),
  tempoResposta: texto(40),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+()\s-]{10,20}$/, "Número de WhatsApp inválido."),
  mensagemWhatsapp: texto(400),
  instagram: texto(300),
  linkedin: texto(300),
});

const hero = z.object({
  eyebrow: texto(120),
  titulo: texto(200, 1),
  texto: texto(600),
  ctaPrimario: texto(60, 1),
  ctaSecundario: texto(60, 1),
  foto: caminhoImagem,
  fotoAlt: texto(200),
});

const sobre = z.object({
  eyebrow: texto(120),
  titulo: texto(200, 1),
  paragrafos: z.array(texto(1500)).min(1).max(6),
  foto: caminhoImagem,
  fotoAlt: texto(200),
});

const caminhos = z.object({
  eyebrow: texto(120),
  titulo: texto(200, 1),
  subtitulo: texto(400),
  itens: z
    .array(z.object({ titulo: texto(120, 1), texto: texto(600) }))
    .min(1)
    .max(8),
});

const comoFunciona = z.object({
  eyebrow: texto(120),
  titulo: texto(200, 1),
  subtitulo: texto(400),
  passos: z
    .array(z.object({ titulo: texto(120, 1), texto: texto(600) }))
    .min(1)
    .max(6),
});

const conteudos = z.object({
  eyebrow: texto(120),
  titulo: texto(200, 1),
  subtitulo: texto(400),
  itens: z
    .array(
      z.object({
        tipo: z.enum(["video", "artigo", "pdf"]),
        categoria: texto(60),
        titulo: texto(160, 1),
        texto: texto(600),
        acao: texto(60, 1),
        href: link,
        capa: caminhoImagem,
      }),
    )
    .max(12),
});

const faq = z.object({
  eyebrow: texto(120),
  titulo: texto(200, 1),
  itens: z
    .array(z.object({ pergunta: texto(300, 1), resposta: texto(2000) }))
    .max(20),
});

export const esquemaConteudo = z.object({
  perfil,
  hero,
  sobre,
  caminhos,
  comoFunciona,
  conteudos,
  faq,
  chamada: z.object({
    titulo: texto(200, 1),
    texto: texto(600),
    cta: texto(60, 1),
  }),
  rodape: z.object({ frase: texto(300) }),
});

export const esquemaLogin = z.object({
  email: z.string().trim().email().max(200),
  senha: z.string().min(1).max(200),
});

export const esquemaSenha = z.object({
  senhaAtual: z.string().min(1).max(200),
  senhaNova: z
    .string()
    .min(10, "A senha nova precisa ter pelo menos 10 caracteres.")
    .max(200),
});

/** Devolve a primeira mensagem legível de um erro do zod. */
export function primeiraMensagem(erro) {
  const problema = erro.issues?.[0];
  if (!problema) return "Dados inválidos.";
  const campo = problema.path.join(".");
  return campo ? `${campo}: ${problema.message}` : problema.message;
}

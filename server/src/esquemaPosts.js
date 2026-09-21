import { z } from "zod";
import { texto, caminhoImagem, link } from "./esquema.js";

/**
 * Validação dos posts do blog.
 *
 * O corpo rico é o documento (formato ProseMirror/Tiptap) que o editor do
 * painel produz. Assim como o resto da API, a validação do navegador não
 * conta como proteção: este esquema é o que de fato decide o que entra no
 * banco. Por isso a lista de tipos de nó é fechada (allow-list) e a árvore é
 * deliberadamente rasa — sem lista dentro de lista, sem citação dentro de
 * citação — tanto para manter a validação simples quanto para impedir um
 * documento patologicamente aninhado.
 *
 * O lado público nunca usa `dangerouslySetInnerHTML`: ele percorre este
 * mesmo formato e monta elementos React um a um (ver src/blog/CorpoPost.tsx),
 * então o único jeito de um conteúdo malicioso aparecer na página é ele
 * passar por este esquema primeiro.
 */

/** Vídeo: só um link de host conhecido. Mesma postura do `link` — nunca
 * confiar na string guardada como algo seguro de renderizar direto. */
export const linkVideo = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) =>
      /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/|vimeo\.com\/|player\.vimeo\.com\/video\/)/i.test(
        v,
      ),
    { message: "O vídeo precisa ser um link do YouTube ou do Vimeo." },
  );

const marcaNegrito = z.object({ type: z.literal("bold") });
const marcaItalico = z.object({ type: z.literal("italic") });
const marcaLink = z.object({ type: z.literal("link"), attrs: z.object({ href: link }) });
const marca = z.discriminatedUnion("type", [marcaNegrito, marcaItalico, marcaLink]);

// Sem `.trim()`: um texto rico é feito de vários trechos concatenados (ex.:
// "normal " + "negrito" + " normal"), e o espaço no limite de um trecho é
// o que separa as palavras visualmente. `texto()` daria trim em cada
// trecho e colaria as palavras umas nas outras.
const textoInline = z.string().min(1).max(2000);

const noTexto = z.object({
  type: z.literal("text"),
  text: textoInline,
  marks: z.array(marca).max(5).optional(),
});

const noParagrafo = z.object({
  type: z.literal("paragraph"),
  content: z.array(noTexto).max(400).optional(),
});

const noTitulo = z.object({
  type: z.literal("heading"),
  attrs: z.object({ level: z.union([z.literal(2), z.literal(3)]) }),
  content: z.array(noTexto).max(100).optional(),
});

const noItemLista = z.object({
  type: z.literal("listItem"),
  content: z.array(noParagrafo).min(1).max(5),
});

const noListaComMarcadores = z.object({
  type: z.literal("bulletList"),
  content: z.array(noItemLista).min(1).max(50),
});

const noListaNumerada = z.object({
  type: z.literal("orderedList"),
  content: z.array(noItemLista).min(1).max(50),
});

const noCitacao = z.object({
  type: z.literal("blockquote"),
  content: z.array(noParagrafo).min(1).max(20),
});

const noImagem = z.object({
  type: z.literal("image"),
  attrs: z.object({ src: caminhoImagem, alt: texto(200) }),
});

const noVideo = z.object({
  type: z.literal("videoEmbed"),
  attrs: z.object({ src: linkVideo }),
});

const noBloco = z.discriminatedUnion("type", [
  noParagrafo,
  noTitulo,
  noListaComMarcadores,
  noListaNumerada,
  noCitacao,
  noImagem,
  noVideo,
]);

export const esquemaCorpoPost = z.object({
  type: z.literal("doc"),
  content: z.array(noBloco).min(1).max(400),
});

export const esquemaPost = z.object({
  titulo: texto(200, 1),
  resumo: texto(300, 1),
  categoria: texto(60, 1),
  capa: caminhoImagem,
  capaAlt: texto(200),
  corpo: esquemaCorpoPost,
  status: z.enum(["rascunho", "publicado"]),
});

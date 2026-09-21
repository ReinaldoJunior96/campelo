/**
 * O formato dos posts do blog.
 *
 * Espelha `server/src/esquemaPosts.js`: o corpo rico (`CorpoPost`) é o
 * mesmo formato que o editor Tiptap produz e que o servidor valida contra
 * uma lista fechada de tipo de nó. O lado público (`src/blog/CorpoPost.tsx`)
 * percorre essa árvore para montar elementos React — nunca recebe HTML
 * pronto — então os tipos aqui são o contrato real do que pode aparecer na
 * página.
 *
 * Fica separado de `tipos.ts` porque o blog é um recurso próprio (sua
 * própria tabela, seu próprio ciclo de vida), não parte do documento único
 * `Conteudo`.
 */

export type StatusPost = "rascunho" | "publicado";

export type MarcaTexto =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "link"; attrs: { href: string } };

export type NoTexto = {
  type: "text";
  text: string;
  marks?: MarcaTexto[];
};

export type NoParagrafo = {
  type: "paragraph";
  content?: NoTexto[];
};

export type NoTitulo = {
  type: "heading";
  attrs: { level: 2 | 3 };
  content?: NoTexto[];
};

export type NoItemLista = {
  type: "listItem";
  content: NoParagrafo[];
};

export type NoListaComMarcadores = {
  type: "bulletList";
  content: NoItemLista[];
};

export type NoListaNumerada = {
  type: "orderedList";
  content: NoItemLista[];
};

export type NoCitacao = {
  type: "blockquote";
  content: NoParagrafo[];
};

export type NoImagem = {
  type: "image";
  attrs: { src: string; alt: string };
};

export type NoVideo = {
  type: "videoEmbed";
  attrs: { src: string };
};

export type NoBloco =
  | NoParagrafo
  | NoTitulo
  | NoListaComMarcadores
  | NoListaNumerada
  | NoCitacao
  | NoImagem
  | NoVideo;

export type CorpoPost = {
  type: "doc";
  content: NoBloco[];
};

/** Post completo, como a API devolve em `/posts/:slug` e `/admin/posts/:id`. */
export type Post = {
  id: number;
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  capa: string;
  capaAlt: string;
  corpo: CorpoPost;
  status: StatusPost;
  criadoEm: string;
  atualizadoEm: string;
  publicadoEm: string | null;
};

/** Campos leves da listagem pública — sem o corpo inteiro. */
export type PostResumo = {
  id: number;
  slug: string;
  titulo: string;
  resumo: string;
  capa: string;
  capaAlt: string;
  categoria: string;
  publicadoEm: string | null;
};

/** Campos leves da listagem no painel — sem corpo nem capa. */
export type PostAdmin = {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  status: StatusPost;
  criadoEm: string;
  atualizadoEm: string;
  publicadoEm: string | null;
};

/** O que o painel manda para criar/editar. Servidor decide slug e datas. */
export type EntradaPost = {
  titulo: string;
  resumo: string;
  categoria: string;
  capa: string;
  capaAlt: string;
  corpo: CorpoPost;
  status: StatusPost;
};

/** Documento vazio, ponto de partida de um post novo no editor. */
export const corpoVazio: CorpoPost = { type: "doc", content: [{ type: "paragraph" }] };

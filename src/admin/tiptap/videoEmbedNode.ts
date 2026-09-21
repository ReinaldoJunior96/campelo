import { mergeAttributes, Node } from "@tiptap/core";

/**
 * Mesma lista de hosts permitidos do servidor (`server/src/esquemaPosts.js`,
 * `linkVideo`). Validar aqui também é só feedback imediato — quem decide de
 * verdade é o servidor.
 */
const HOSTS_PERMITIDOS =
  /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/|vimeo\.com\/|player\.vimeo\.com\/video\/)/i;

export const validarUrlVideo = (url: string) => HOSTS_PERMITIDOS.test(url.trim());

/**
 * Único nó realmente customizado do editor. Enquanto edita, mostra um card
 * estático com a URL em vez do player ao vivo — não carrega script de
 * terceiro (YouTube/Vimeo) dentro do painel só porque um post está sendo
 * escrito. O player de verdade só aparece na página pública
 * (`src/blog/CorpoPost.tsx`).
 */
export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-tipo="video-embed"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-tipo": "video-embed" })];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.setAttribute("data-tipo", "video-embed");
      dom.setAttribute("contenteditable", "false");
      dom.className =
        "flex items-center gap-2 rounded-lg border border-dashed border-tinta/30 bg-tinta/5 px-4 py-3 text-sm text-tinta/70";
      dom.textContent = `▶ Vídeo: ${node.attrs.src || "(sem link)"}`;
      return { dom };
    };
  },
});

import { useState, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import ExtensaoImagem from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import {
  IconeCitacao,
  IconeImagem,
  IconeItalico,
  IconeLink,
  IconeListaMarcadores,
  IconeListaNumerada,
  IconeNegrito,
  IconeVideo,
} from "./tiptap/iconesBarra";
import { validarUrlVideo, VideoEmbed } from "./tiptap/videoEmbedNode";
import { api } from "../lib/api";
import type { CorpoPost } from "../tiposBlog";

/**
 * Só o que está na allow-list do servidor (`server/src/esquemaPosts.js`)
 * fica habilitado — o resto do StarterKit (código, bloco de código, régua,
 * tachado) é desligado para a barra de ferramentas nunca oferecer algo que
 * o servidor recusaria salvar.
 */
const extensoes = [
  StarterKit.configure({
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    code: false,
    underline: false,
    heading: { levels: [2, 3] },
    link: { openOnClick: false, autolink: true, protocols: ["http", "https"] },
  }),
  ExtensaoImagem.configure({ inline: false }),
  VideoEmbed,
];

function BotaoBarra({
  titulo,
  ativo,
  onClick,
  children,
}: {
  titulo: string;
  ativo?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      aria-pressed={ativo}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm font-bold transition-colors ${
        ativo ? "bg-tinta text-areia" : "text-tinta hover:bg-tinta/10"
      }`}
    >
      {children}
    </button>
  );
}

function Separador() {
  return <span className="mx-1 h-5 w-px shrink-0 bg-tinta/15" aria-hidden="true" />;
}

export default function EditorTiptap({
  valor,
  aoMudar,
}: {
  valor: CorpoPost;
  aoMudar: (corpo: CorpoPost) => void;
}) {
  const [formulario, setFormulario] = useState<"link" | "video" | null>(null);
  const [urlDigitada, setUrlDigitada] = useState("");
  const [erroUrl, setErroUrl] = useState("");

  const editor = useEditor({
    extensions: extensoes,
    content: valor,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => aoMudar(editor.getJSON() as CorpoPost),
  });

  if (!editor) return null;

  function abrirFormulario(tipo: "link" | "video") {
    setErroUrl("");
    setUrlDigitada(tipo === "link" ? ((editor!.getAttributes("link").href as string) ?? "") : "");
    setFormulario(tipo);
  }

  function confirmarFormulario() {
    const url = urlDigitada.trim();

    if (formulario === "link") {
      if (!url) {
        editor!.chain().focus().unsetLink().run();
      } else if (!/^https?:\/\//i.test(url)) {
        setErroUrl("O link precisa começar com http:// ou https://.");
        return;
      } else {
        editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }
    }

    if (formulario === "video") {
      if (!validarUrlVideo(url)) {
        setErroUrl("O vídeo precisa ser um link do YouTube ou do Vimeo.");
        return;
      }
      editor!.chain().focus().insertContent({ type: "videoEmbed", attrs: { src: url } }).run();
    }

    setFormulario(null);
  }

  async function inserirImagem(arquivo: File) {
    try {
      const midia = await api.enviarMidia(arquivo);
      editor!.chain().focus().setImage({ src: midia.url, alt: midia.nomeOriginal }).run();
    } catch {
      // Erro já apareceria pelo fluxo padrão de qualquer chamada à API; sem
      // um lugar melhor para mostrar dentro da barra de ferramentas.
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-tinta/20 bg-white p-1.5">
        <BotaoBarra titulo="Negrito" ativo={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <IconeNegrito />
        </BotaoBarra>
        <BotaoBarra titulo="Itálico" ativo={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <IconeItalico />
        </BotaoBarra>
        <BotaoBarra titulo="Link" ativo={editor.isActive("link")} onClick={() => abrirFormulario("link")}>
          <IconeLink />
        </BotaoBarra>

        <Separador />

        <BotaoBarra
          titulo="Título 2"
          ativo={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </BotaoBarra>
        <BotaoBarra
          titulo="Título 3"
          ativo={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </BotaoBarra>
        <BotaoBarra titulo="Citação" ativo={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <IconeCitacao />
        </BotaoBarra>

        <Separador />

        <BotaoBarra titulo="Lista com marcadores" ativo={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <IconeListaMarcadores />
        </BotaoBarra>
        <BotaoBarra titulo="Lista numerada" ativo={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <IconeListaNumerada />
        </BotaoBarra>

        <Separador />

        <label
          title="Imagem"
          className="flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md px-2.5 text-tinta transition-colors hover:bg-tinta/10"
        >
          <IconeImagem />
          <span className="sr-only">Inserir imagem</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="hidden"
            onChange={(evento) => {
              const arquivo = evento.target.files?.[0];
              if (arquivo) inserirImagem(arquivo);
              evento.target.value = "";
            }}
          />
        </label>
        <BotaoBarra titulo="Vídeo" onClick={() => abrirFormulario("video")}>
          <IconeVideo />
        </BotaoBarra>
      </div>

      {formulario && (
        <div className="flex flex-col gap-2 rounded-lg border border-tinta/20 bg-white p-3">
          <label className="text-xs font-bold text-tinta">
            {formulario === "link" ? "Endereço do link (em branco remove)" : "Link do YouTube ou Vimeo"}
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              autoFocus
              type="text"
              value={urlDigitada}
              onChange={(evento) => setUrlDigitada(evento.target.value)}
              placeholder="https://"
              className="min-w-0 flex-grow rounded-md border border-tinta/20 px-3 py-2 text-sm outline-none focus:border-barro"
            />
            <button
              type="button"
              onClick={confirmarFormulario}
              className="rounded-md bg-barro px-4 py-2 text-sm font-bold text-areia transition-colors hover:bg-barro-escuro"
            >
              {formulario === "link" ? "Aplicar" : "Inserir"}
            </button>
            <button
              type="button"
              onClick={() => setFormulario(null)}
              className="rounded-md border border-tinta/25 px-4 py-2 text-sm font-bold text-tinta transition-colors hover:bg-tinta/5"
            >
              Cancelar
            </button>
          </div>
          {erroUrl && <span className="text-xs font-bold text-barro">{erroUrl}</span>}
        </div>
      )}

      <div className="min-h-[280px] rounded-lg border border-tinta/20 bg-white px-4 py-3 [&_.ProseMirror]:min-h-[240px] [&_.ProseMirror]:outline-none [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-barro [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-bold [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

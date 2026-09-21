import { Fragment, type ReactNode } from "react";
import type { CorpoPost as TipoCorpoPost, NoBloco, NoParagrafo, NoTexto } from "../tiposBlog";

/**
 * Renderiza o corpo rico do post em React puro — nunca
 * `dangerouslySetInnerHTML`. O `switch` abaixo só entende os tipos de nó que
 * `server/src/esquemaPosts.js` aceita; qualquer outra coisa nunca chega a
 * ser gravada no banco, mas se chegasse, cairia no `default` e não
 * renderizaria nada.
 */

/**
 * Só reconhece formatos conhecidos de YouTube/Vimeo e monta o `src` do
 * iframe a partir do id extraído. Nunca usa a string guardada como `src`
 * direto, mesmo já validada no servidor — mesma postura de não confiar
 * cegamente numa string guardada.
 */
function paraEmbedSeguro(url: string): string | null {
  let alvo: URL;
  try {
    alvo = new URL(url);
  } catch {
    return null;
  }

  const host = alvo.hostname.replace(/^www\./, "");

  if (host === "youtube.com") {
    const v = alvo.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    const shorts = alvo.pathname.match(/^\/shorts\/([\w-]+)/);
    return shorts ? `https://www.youtube.com/embed/${shorts[1]}` : null;
  }

  if (host === "youtu.be") {
    const id = alvo.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host === "vimeo.com") {
    const id = alvo.pathname.match(/^\/(\d+)/);
    return id ? `https://player.vimeo.com/video/${id[1]}` : null;
  }

  if (host === "player.vimeo.com") {
    const id = alvo.pathname.match(/^\/video\/(\d+)/);
    return id ? `https://player.vimeo.com/video/${id[1]}` : null;
  }

  return null;
}

function renderTexto(no: NoTexto, chave: number) {
  let elemento: ReactNode = no.text;

  for (const marca of no.marks ?? []) {
    if (marca.type === "bold") elemento = <strong>{elemento}</strong>;
    else if (marca.type === "italic") elemento = <em>{elemento}</em>;
    else if (marca.type === "link") {
      const externo = /^https?:\/\//i.test(marca.attrs.href);
      elemento = (
        <a
          href={marca.attrs.href}
          target={externo ? "_blank" : undefined}
          rel={externo ? "noreferrer noopener" : undefined}
          className="underline decoration-barro decoration-2 underline-offset-2 transition-colors hover:text-barro"
        >
          {elemento}
        </a>
      );
    }
  }

  return <Fragment key={chave}>{elemento}</Fragment>;
}

function renderInlineParagrafo(paragrafo: NoParagrafo, chave: number) {
  return <Fragment key={chave}>{paragrafo.content?.map((t, i) => renderTexto(t, i))}</Fragment>;
}

function renderBloco(no: NoBloco, chave: number): ReactNode {
  switch (no.type) {
    case "paragraph":
      return (
        <p key={chave} className="mb-5 text-[17px] leading-[1.8] text-tinta/85">
          {no.content?.map((t, i) => renderTexto(t, i))}
        </p>
      );

    case "heading": {
      const Titulo = no.attrs.level === 2 ? "h2" : "h3";
      return (
        <Titulo
          key={chave}
          className={
            no.attrs.level === 2
              ? "mb-4 mt-12 text-[1.75rem] font-bold leading-tight tracking-tight"
              : "mb-3 mt-9 text-xl font-bold leading-tight tracking-tight"
          }
        >
          {no.content?.map((t, i) => renderTexto(t, i))}
        </Titulo>
      );
    }

    case "blockquote":
      return (
        <blockquote
          key={chave}
          className="relative my-8 border-l-[3px] border-barro py-1 pl-6 font-display text-[1.375rem] italic leading-snug text-tinta/80"
        >
          {no.content.map((p, i) => (
            <p key={i} className="mb-2 last:mb-0">
              {p.content?.map((t, j) => renderTexto(t, j))}
            </p>
          ))}
        </blockquote>
      );

    case "bulletList":
      return (
        <ul
          key={chave}
          className="mb-5 ml-5 list-disc space-y-2.5 text-[17px] leading-[1.8] text-tinta/85 marker:text-barro"
        >
          {no.content.map((item, i) => (
            <li key={i}>{item.content.map((p, j) => renderInlineParagrafo(p, j))}</li>
          ))}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={chave}
          className="mb-5 ml-5 list-decimal space-y-2.5 text-[17px] leading-[1.8] text-tinta/85 marker:font-bold marker:text-barro"
        >
          {no.content.map((item, i) => (
            <li key={i}>{item.content.map((p, j) => renderInlineParagrafo(p, j))}</li>
          ))}
        </ol>
      );

    case "image":
      return (
        <img
          key={chave}
          src={no.attrs.src}
          alt={no.attrs.alt}
          className="my-8 w-full rounded-bloco object-cover"
          loading="lazy"
          decoding="async"
        />
      );

    case "videoEmbed": {
      const embed = paraEmbedSeguro(no.attrs.src);
      if (!embed) return null;

      return (
        <div key={chave} className="relative my-8 aspect-video overflow-hidden rounded-bloco bg-tinta">
          <iframe
            src={embed}
            title="Vídeo incorporado"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }

    default:
      return null;
  }
}

export default function CorpoPost({ corpo }: { corpo: TipoCorpoPost }) {
  return <div>{corpo.content.map((no, i) => renderBloco(no, i))}</div>;
}

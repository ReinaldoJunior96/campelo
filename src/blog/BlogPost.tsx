import { useEffect } from "react";
import BotaoCompartilhar from "./BotaoCompartilhar";
import CorpoPost from "./CorpoPost";
import BotaoWhatsapp from "../components/BotaoWhatsapp";
import Nav from "../components/Nav";
import Rodape from "../components/Rodape";
import { ProvedorConteudo } from "../lib/conteudo";
import { usePost } from "../lib/posts";

const formatarData = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

/**
 * Título/descrição via `useEffect` cobre a aba do navegador real. Quem
 * compartilha o link nas redes conta com o preview que o nginx monta para
 * crawler (ver `server/src/rotas/blogPreview.js`), porque um bot de preview
 * não roda JavaScript e nunca veria esta troca.
 */
function useMetaDoPost(post: { titulo: string; resumo: string } | null) {
  useEffect(() => {
    if (!post) return;

    const tituloAnterior = document.title;
    document.title = `${post.titulo} | Campelo`;

    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = post.resumo;
    document.head.appendChild(meta);

    return () => {
      document.title = tituloAnterior;
      meta.remove();
    };
  }, [post]);
}

function ConteudoBlogPost({ slug }: { slug: string }) {
  const { post, carregando, naoEncontrado } = usePost(slug);
  useMetaDoPost(post);

  if (carregando) {
    return (
      <main id="conteudo-principal" className="flex min-h-screen items-center justify-center bg-areia">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-tinta/50">Carregando…</p>
      </main>
    );
  }

  if (naoEncontrado || !post) {
    return (
      <>
        <Nav />
        <main
          id="conteudo-principal"
          className="flex min-h-screen flex-col items-center justify-center gap-5 px-5 text-center"
        >
          <span className="font-mono text-eyebrow uppercase text-mare">404</span>
          <h1 className="text-[2rem] md:text-[2.625rem]">Esse post não existe mais</h1>
          <p className="max-w-[26rem] text-[17px] leading-relaxed text-tinta/70">
            Ele pode ter sido removido, ou o link está errado.
          </p>
          <a
            href="/blog"
            className="mt-2 rounded-full bg-tinta px-7 py-3.5 text-sm font-bold text-areia transition-colors hover:bg-tinta-funda"
          >
            Voltar para o blog
          </a>
        </main>
      </>
    );
  }

  const url = `${window.location.origin}/blog/${post.slug}`;

  return (
    <>
      <Nav />

      <main id="conteudo-principal">
        <article className="mx-auto max-w-leitura px-5 pb-20 pt-28 md:pt-36">
          <span className="font-mono text-eyebrow uppercase text-mare">{post.categoria}</span>
          <h1 className="mt-3 text-[2.25rem] leading-[1.05] md:text-[2.75rem]">{post.titulo}</h1>
          {post.publicadoEm && (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-tinta/55">
              {formatarData(post.publicadoEm)}
            </p>
          )}

          {post.capa && (
            <img
              src={post.capa}
              alt={post.capaAlt}
              className="mt-8 aspect-[16/9] w-full rounded-bloco object-cover"
            />
          )}

          <div className="mt-8 border-y border-tinta/10 py-5">
            <BotaoCompartilhar url={url} titulo={post.titulo} />
          </div>

          <div className="mt-10">
            <CorpoPost corpo={post.corpo} />
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 rounded-bloco bg-areia-funda px-8 py-10 text-center">
            <span className="font-display text-xl font-bold tracking-tight text-tinta">
              Gostou? Compartilhe.
            </span>
            <BotaoCompartilhar url={url} titulo={post.titulo} mostrarRotulo={false} />
          </div>
        </article>
      </main>

      <Rodape />
      <BotaoWhatsapp />
    </>
  );
}

export default function BlogPost({ slug }: { slug: string }) {
  return (
    <ProvedorConteudo>
      <ConteudoBlogPost slug={slug} />
    </ProvedorConteudo>
  );
}

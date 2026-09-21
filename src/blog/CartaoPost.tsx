import Revelar from "../components/Revelar";
import type { PostResumo } from "../tiposBlog";

/**
 * Card de post, compartilhado entre o teaser da home e a listagem /blog.
 *
 * Mesmo recorte visual de `Conteudos.tsx` (capa + eyebrow + título + resumo
 * + CTA num card `rounded-cartao`), para o blog nascer com a cara do resto
 * do site.
 */
export default function CartaoPost({ post, atraso = 0 }: { post: PostResumo; atraso?: number }) {
  return (
    <Revelar atraso={atraso} className="h-full">
      <a href={`/blog/${post.slug}`} className="group block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-cartao bg-areia transition-[transform,box-shadow] duration-300 ease-mare group-hover:-translate-y-1 group-hover:shadow-xl">
          <div className="h-48 overflow-hidden bg-espuma">
            {post.capa ? (
              <img
                src={post.capa}
                alt={post.capaAlt}
                className="h-full w-full object-cover transition-transform duration-500 ease-mare group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            ) : (
              // Sem capa própria: mesma técnica de arte padrão que os cards de
              // "Conteúdos" já usam para artigo (bg-espuma + PNG decorativo),
              // em vez de inventar um novo motivo visual.
              <div className="flex h-full items-center justify-center overflow-hidden bg-espuma">
                <img
                  src="/assets/concha1.png"
                  alt=""
                  width={104}
                  height={150}
                  className="h-[150px] w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>

          <div className="flex flex-grow flex-col gap-2.5 p-7">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-barro">
              {post.categoria}
            </span>
            <h3 className="text-[19px] font-semibold tracking-tight">{post.titulo}</h3>
            <p className="flex-grow text-sm leading-relaxed text-tinta/72">{post.resumo}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 self-start border-b-2 border-barro pb-0.5 text-sm font-bold text-tinta transition-colors group-hover:text-barro">
              Ler post
              <span className="sr-only"> {post.titulo}</span>
              <span aria-hidden="true" className="transition-transform duration-300 ease-mare group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </article>
      </a>
    </Revelar>
  );
}

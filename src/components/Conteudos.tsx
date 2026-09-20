import { IconeDocumento, IconePlay } from "./Icones";
import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";
import type { ItemConteudo } from "../tipos";

/**
 * O vídeo do YouTube entra como capa clicável em vez de iframe.
 *
 * O embed do YouTube carrega cerca de 1 MB de script de terceiro e planta
 * cookies antes mesmo de alguém apertar o play. Como capa, o custo é zero
 * e o clique abre no YouTube, que é onde a pessoa vai terminar de assistir
 * de qualquer jeito.
 */
function Capa({ item }: { item: ItemConteudo }) {
  // Capa enviada pelo painel tem prioridade sobre a arte padrão do tipo.
  if (item.capa) {
    return (
      <div className="h-48 overflow-hidden bg-espuma">
        <img
          src={item.capa}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (item.tipo === "video") {
    return (
      <div className="flex h-48 items-center justify-center bg-tinta">
        <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-espuma text-tinta">
          <IconePlay className="ml-1 h-5 w-[18px]" />
        </span>
      </div>
    );
  }

  if (item.tipo === "artigo") {
    return (
      <div className="flex h-48 items-center justify-center overflow-hidden bg-espuma">
        <img
          src="/assets/concha2.png"
          alt=""
          width={104}
          height={150}
          className="h-[150px] w-auto"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className="flex h-48 items-center justify-center bg-mare text-areia">
      <IconeDocumento className="h-14 w-auto" />
    </div>
  );
}

export default function Conteudos() {
  const { conteudos } = useConteudo();

  if (conteudos.itens.length === 0) return null;

  return (
    <section id="conteudos" className="bg-areia-funda">
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-16 md:py-24">
        <Revelar className="flex flex-col items-center gap-4 text-center">
          <img
            src="/assets/bolacha.png"
            alt=""
            width={44}
            height={41}
            className="h-11 w-auto"
            loading="lazy"
            decoding="async"
          />
          <h2 className="text-[2rem] md:text-[2.625rem]">{conteudos.titulo}</h2>
          <p className="max-w-[35rem] text-[17px] text-tinta/70">{conteudos.subtitulo}</p>
        </Revelar>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {conteudos.itens.map((item, indice) => {
            const externo = /^https?:\/\//i.test(item.href);

            return (
              <Revelar key={`${item.titulo}-${indice}`} atraso={indice * 90}>
                <article className="flex h-full flex-col overflow-hidden rounded-cartao bg-areia">
                  <Capa item={item} />
                  <div className="flex flex-grow flex-col gap-2.5 p-7">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-barro">
                      {item.categoria}
                    </span>
                    <h3 className="text-[19px] font-semibold tracking-tight">{item.titulo}</h3>
                    <p className="flex-grow text-sm leading-relaxed text-tinta/72">{item.texto}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel={externo ? "noreferrer noopener" : undefined}
                      className="mt-2 self-start border-b-2 border-barro pb-0.5 text-sm font-bold text-tinta transition-colors hover:text-barro"
                    >
                      {item.acao}
                      <span className="sr-only"> {item.titulo}</span>
                    </a>
                  </div>
                </article>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}

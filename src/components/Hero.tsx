import Pendente from "./Pendente";
import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";
import { linkWhatsapp } from "../tipos";

export default function Hero() {
  const { hero, perfil } = useConteudo();

  return (
    <section
      id="topo"
      className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 pb-16 pt-28 md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-16 md:pb-24 md:pt-36"
    >
      <Revelar className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <img src="/assets/alga.png" alt="" width={22} height={22} className="h-[22px] w-auto" />
          <span className="font-mono text-eyebrow uppercase text-mare">{hero.eyebrow}</span>
        </div>

        <h1 className="text-[2.75rem] leading-[0.98] md:text-[3.875rem]">{hero.titulo}</h1>

        <p className="max-w-[30rem] text-lg leading-relaxed text-tinta/80">{hero.texto}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href={linkWhatsapp(perfil)}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full bg-barro px-8 py-4 text-center text-[15px] font-bold text-areia transition-colors hover:bg-barro-escuro"
          >
            {hero.ctaPrimario}
          </a>
          <a
            href="#como-funciona"
            className="rounded-full border-[1.5px] border-tinta/30 px-7 py-4 text-center text-[15px] font-bold text-tinta transition-colors hover:border-tinta/60 hover:bg-tinta/5"
          >
            {hero.ctaSecundario}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 font-mono text-xs uppercase tracking-[0.1em] text-tinta/60">
          <span>{perfil.crp}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-tinta/30" />
          <span>
            <Pendente texto={perfil.modalidade} />
          </span>
        </div>
      </Revelar>

      <Revelar atraso={120} className="relative mx-auto w-full max-w-[430px]">
        <div className="forma-organica aspect-square overflow-hidden bg-espuma">
          <img
            src={hero.foto}
            alt={hero.fotoAlt}
            width={430}
            height={430}
            className="h-full w-full object-cover object-[50%_22%]"
            decoding="async"
          />
        </div>
        <img
          src="/assets/tartaruga.png"
          alt=""
          width={104}
          height={104}
          className="flutua absolute -bottom-2 -right-2 h-20 w-auto md:h-[104px]"
          loading="lazy"
          decoding="async"
        />
      </Revelar>
    </section>
  );
}

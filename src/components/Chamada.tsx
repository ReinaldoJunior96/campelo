import { IconeWhatsapp } from "./Icones";
import Pendente from "./Pendente";
import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";
import { linkWhatsapp } from "../tipos";

export default function Chamada() {
  const { chamada, perfil } = useConteudo();

  return (
    <section className="relative overflow-hidden bg-tinta text-areia">
      <img
        src="/assets/tartaruga.png"
        alt=""
        width={128}
        height={128}
        className="pointer-events-none absolute left-10 top-10 hidden h-32 w-auto brightness-0 invert opacity-15 lg:block"
        loading="lazy"
        decoding="async"
      />
      <img
        src="/assets/alga.png"
        alt=""
        width={110}
        height={108}
        className="pointer-events-none absolute bottom-8 right-12 hidden h-28 w-auto brightness-0 invert opacity-15 lg:block"
        loading="lazy"
        decoding="async"
      />

      <Revelar className="relative mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-5 py-20 text-center md:px-16 md:py-24">
        <h2 className="max-w-[45rem] text-[2rem] md:text-[2.875rem]">{chamada.titulo}</h2>
        <p className="max-w-[34rem] text-[17.5px] leading-relaxed text-areia/80">{chamada.texto}</p>

        <a
          href={linkWhatsapp(perfil)}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2.5 rounded-full bg-espuma px-9 py-4 text-base font-bold text-tinta transition-transform duration-300 ease-mare hover:scale-[1.03]"
        >
          <IconeWhatsapp className="h-5 w-5" />
          {chamada.cta}
        </a>

        <span className="font-mono text-xs uppercase tracking-[0.12em] text-areia/70">
          Resposta em até <Pendente texto={perfil.tempoResposta} /> horas
        </span>
      </Revelar>
    </section>
  );
}

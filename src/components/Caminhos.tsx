import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";

export default function Caminhos() {
  const { caminhos } = useConteudo();

  return (
    <section id="atuacao" className="bg-areia-funda">
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-16 md:py-24">
        <Revelar className="flex flex-col items-center gap-4 text-center">
          <img
            src="/assets/concha1.png"
            alt=""
            width={44}
            height={36}
            className="h-11 w-auto"
            loading="lazy"
            decoding="async"
          />
          <h2 className="text-[2rem] md:text-[2.625rem]">{caminhos.titulo}</h2>
          <p className="max-w-[35rem] text-[17px] text-tinta/70">{caminhos.subtitulo}</p>
        </Revelar>

        <ol className="mt-12 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {caminhos.itens.map((item, indice) => (
            <Revelar key={`${item.titulo}-${indice}`} atraso={indice * 90}>
              <li className="flex flex-col gap-3 border-t-2 border-tinta pt-5">
                <span className="font-mono text-[11px] text-barro">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold tracking-tight">{item.titulo}</h3>
                <p className="text-[14.5px] leading-relaxed text-tinta/72">{item.texto}</p>
              </li>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  );
}

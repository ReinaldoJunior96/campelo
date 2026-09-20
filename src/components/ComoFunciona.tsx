import Pendente from "./Pendente";
import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";

export default function ComoFunciona() {
  const { comoFunciona } = useConteudo();

  return (
    <section id="como-funciona" className="mx-auto max-w-[1280px] px-5 py-20 md:px-16 md:py-24">
      <Revelar className="flex flex-col items-center gap-4 text-center">
        <span className="font-mono text-eyebrow uppercase text-mare">{comoFunciona.eyebrow}</span>
        <h2 className="text-[2rem] md:text-[2.625rem]">{comoFunciona.titulo}</h2>
        <p className="max-w-[37.5rem] text-[17px] text-tinta/70">{comoFunciona.subtitulo}</p>
      </Revelar>

      <ol className="mt-12 grid list-none gap-8 p-0 md:grid-cols-3">
        {comoFunciona.passos.map((passo, indice) => (
          <Revelar key={`${passo.titulo}-${indice}`} atraso={indice * 90}>
            <li className="flex h-full flex-col gap-3 rounded-cartao bg-areia-funda p-8">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-tinta font-mono text-[15px] text-areia"
              >
                {indice + 1}
              </span>
              <h3 className="text-xl font-semibold tracking-tight">{passo.titulo}</h3>
              <p className="text-[14.5px] leading-relaxed text-tinta/75">
                <Pendente texto={passo.texto} />
              </p>
            </li>
          </Revelar>
        ))}
      </ol>
    </section>
  );
}

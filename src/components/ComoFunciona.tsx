import { Icone } from "./Icones";
import Pendente from "./Pendente";
import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";

export default function ComoFunciona() {
  const { comoFunciona, perfil } = useConteudo();

  // A informação prática que antes vivia escondida no meio do texto dos
  // passos. Fora da prosa ela vira dado consultável: quem já decidiu
  // marcar procura exatamente isto e não quer ler três parágrafos.
  const detalhes = [
    { icone: "clock", rotulo: "Duração", valor: perfil.duracaoSessao },
    { icone: "calendar-days", rotulo: "Frequência", valor: perfil.frequencia },
    { icone: "hand-holding-heart", rotulo: "Valor", valor: perfil.valorSessao },
    { icone: "location-dot", rotulo: "Onde", valor: perfil.onde },
  ];

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

      <Revelar atraso={180}>
        <dl className="mt-8 grid gap-7 rounded-cartao border border-tinta/15 bg-areia px-7 py-8 sm:grid-cols-2 md:px-10 lg:grid-cols-4 lg:gap-8">
          {detalhes.map((detalhe) => (
            <div key={detalhe.rotulo} className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-espuma text-tinta">
                <Icone nome={detalhe.icone} className="text-[15px]" />
              </span>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-tinta/55">
                  {detalhe.rotulo}
                </dt>
                <dd className="m-0 text-[15px] font-bold leading-snug">
                  <Pendente texto={detalhe.valor} />
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Revelar>
    </section>
  );
}

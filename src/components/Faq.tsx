import Pendente from "./Pendente";
import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";

/**
 * Acordeão em <details>/<summary> nativo.
 *
 * Teclado, leitor de tela e a busca do próprio navegador (Ctrl+F encontra
 * texto dentro de um details fechado nos navegadores atuais) já funcionam
 * sem nenhum JS nosso, o que é melhor do que reimplementar o padrão com
 * divs e aria à mão.
 */
export default function Faq() {
  const { faq } = useConteudo();

  if (faq.itens.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 md:px-16 md:py-24">
      <Revelar className="flex flex-col items-center gap-4 text-center">
        <span className="font-mono text-eyebrow uppercase text-mare">{faq.eyebrow}</span>
        <h2 className="text-[2rem] md:text-[2.625rem]">{faq.titulo}</h2>
      </Revelar>

      <div className="mx-auto mt-12 max-w-[54rem]">
        {faq.itens.map((item, indice) => (
          <Revelar key={`${item.pergunta}-${indice}`} atraso={indice * 60}>
            <details className="group border-t border-tinta/20 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-left text-[19px] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                {item.pergunta}
                <span
                  aria-hidden="true"
                  className="relative h-4 w-4 shrink-0 text-barro before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-4 before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-4 after:w-0.5 after:-translate-x-1/2 after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                />
              </summary>
              <p className="pb-6 pr-8 text-[15.5px] leading-relaxed text-tinta/75">
                <Pendente texto={item.resposta} />
              </p>
            </details>
          </Revelar>
        ))}
      </div>
    </section>
  );
}

import { Icone } from "./Icones";
import Pendente from "./Pendente";
import Revelar from "./Revelar";
import { useConteudo } from "../lib/conteudo";

export default function Sobre() {
  const { sobre, perfil } = useConteudo();

  const credenciais = [
    { icone: "graduation-cap", rotulo: "Formação", valor: perfil.formacao },
    { icone: "compass", rotulo: "Abordagem", valor: perfil.abordagem },
    { icone: "id-badge", rotulo: "Registro", valor: perfil.crp },
  ];

  return (
    <section
      id="sobre"
      className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 md:grid-cols-[1fr_1.15fr] md:gap-16 md:px-16 md:py-24"
    >
      <Revelar>
        <div className="overflow-hidden rounded-bloco bg-espuma">
          <img
            src={sobre.foto}
            alt={sobre.fotoAlt}
            width={540}
            height={470}
            className="h-[320px] w-full object-cover object-[50%_26%] md:h-[470px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </Revelar>

      <Revelar atraso={120} className="flex flex-col gap-5">
        <span className="font-mono text-eyebrow uppercase text-mare">{sobre.eyebrow}</span>
        <h2 className="text-[2rem] md:text-[2.625rem]">{sobre.titulo}</h2>

        {sobre.paragrafos.map((paragrafo, i) => (
          <p key={i} className="text-[17px] leading-relaxed text-tinta/80">
            {paragrafo}
          </p>
        ))}

        <dl className="mt-3 flex flex-wrap gap-x-10 gap-y-4 border-t border-tinta/15 pt-5">
          {credenciais.map((credencial) => (
            <div key={credencial.rotulo} className="flex flex-col gap-1">
              <dt className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-tinta/55">
                <Icone nome={credencial.icone} className="text-[13px] text-mare" />
                {credencial.rotulo}
              </dt>
              <dd className="m-0 text-[15px] font-bold">
                <Pendente texto={credencial.valor} />
              </dd>
            </div>
          ))}
        </dl>
      </Revelar>
    </section>
  );
}

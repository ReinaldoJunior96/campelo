import { Icone, IconeInstagram, IconeLinkedin } from "./Icones";
import Pendente from "./Pendente";
import { useConteudo } from "../lib/conteudo";
import { pendente } from "../tipos";

export default function Rodape() {
  const { rodape, perfil } = useConteudo();
  const ano = new Date().getFullYear();

  const redes = [
    { rotulo: "Instagram", href: perfil.instagram, Icone: IconeInstagram },
    { rotulo: "LinkedIn", href: perfil.linkedin, Icone: IconeLinkedin },
  ];

  return (
    <footer className="bg-tinta-funda text-areia">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-5 py-12 text-center md:flex-row md:justify-between md:gap-10 md:px-16 md:text-left">
        <div className="flex flex-col items-center gap-2.5 md:items-start">
          <img
            src="/assets/logo.png"
            alt="Campelo"
            width={99}
            height={30}
            className="h-[30px] w-auto brightness-0 invert opacity-90"
            loading="lazy"
            decoding="async"
          />
          <span className="flex flex-wrap items-center justify-center gap-x-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-areia/75 md:justify-start">
            {perfil.profissao} · {perfil.crp}
            <span className="flex items-center gap-1.5">
              <Icone nome="location-dot" className="text-[12px] text-espuma" />
              <Pendente texto={perfil.cidade} />
            </span>
          </span>
        </div>

        <p className="max-w-[20rem] font-display text-[19px] font-normal italic leading-snug tracking-normal text-areia/90">
          {rodape.frase}
        </p>

        <div className="flex flex-col items-center gap-2.5 md:items-end">
          <ul className="flex list-none gap-3.5 p-0">
            {redes.map(({ rotulo, href, Icone }) => {
              // Enquanto o link não existir, o ícone vira um marcador inerte em
              // vez de um <a href="#">, que hoje leva o visitante a lugar nenhum.
              if (pendente(href) || !href.trim()) {
                return (
                  <li key={rotulo}>
                    <span
                      title={`${rotulo}: link pendente`}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-barro text-barro"
                    >
                      <Icone titulo={`${rotulo}, link pendente`} />
                    </span>
                  </li>
                );
              }

              return (
                <li key={rotulo}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-areia/35 transition-colors hover:border-areia hover:bg-areia/10"
                  >
                    <Icone titulo={rotulo} />
                  </a>
                </li>
              );
            })}
          </ul>
          <span className="text-xs text-areia/70">© {ano} Campelo Psicologia</span>
        </div>
      </div>
    </footer>
  );
}

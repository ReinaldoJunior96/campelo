import { useState } from "react";
import { IconeCopiar, IconeFacebook, IconeLinkedin, IconeWhatsapp, IconeX } from "../components/Icones";

/**
 * Reaproveitado tanto na página pública do post quanto no painel, depois de
 * salvar — ali é o Campelo compartilhando o post nas próprias redes.
 */
export default function BotaoCompartilhar({
  url,
  titulo,
  mostrarRotulo = true,
}: {
  url: string;
  titulo: string;
  /** Desliga quando um título já em volta ("Gostou? Compartilhe.") deixaria a palavra repetida. */
  mostrarRotulo?: boolean;
}) {
  const [copiado, setCopiado] = useState(false);

  const redes = [
    {
      rotulo: "WhatsApp",
      Icone: IconeWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`,
    },
    {
      rotulo: "Facebook",
      Icone: IconeFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      rotulo: "X",
      Icone: IconeX,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`,
    },
    {
      rotulo: "LinkedIn",
      Icone: IconeLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sem permissão de clipboard não há alternativa melhor sem mais uma
      // biblioteca: o link continua visível para copiar à mão.
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {mostrarRotulo && <span className="text-sm font-bold text-tinta">Compartilhar</span>}
      <ul className="flex list-none gap-2.5 p-0">
        {redes.map(({ rotulo, Icone, href }) => (
          <li key={rotulo}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-tinta/20 text-tinta transition-colors duration-200 hover:border-barro hover:bg-barro hover:text-areia"
            >
              <Icone titulo={`Compartilhar no ${rotulo}`} />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copiar}
            className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-tinta/20 text-tinta transition-colors duration-200 hover:border-barro hover:bg-barro hover:text-areia"
          >
            <IconeCopiar titulo="Copiar link" />
          </button>
        </li>
      </ul>
      {copiado && (
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-mare">
          Link copiado!
        </span>
      )}
    </div>
  );
}

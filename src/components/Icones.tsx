/**
 * Ícones em SVG inline, como componentes React.
 *
 * Substituem o script global do Lucide que era carregado por CDN e injetava
 * os SVGs uma única vez no mount. Aquilo quebrava sempre que um trecho da
 * árvore remontava (o ícone simplesmente sumia) e adicionava uma requisição
 * externa bloqueante. Como componente, o ícone acompanha o ciclo do React.
 */

type Props = {
  className?: string;
  titulo?: string;
};

function base(titulo?: string) {
  return titulo
    ? ({ role: "img", "aria-label": titulo } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
}

export function IconeMenu({ className = "h-5 w-5", titulo }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...base(titulo)}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconeFechar({ className = "h-5 w-5", titulo }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...base(titulo)}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconePlay({ className = "h-5 w-5", titulo }: Props) {
  return (
    <svg className={className} viewBox="0 0 20 22" fill="none" {...base(titulo)}>
      <path d="M19 11L1 21.4V0.6L19 11Z" fill="currentColor" />
    </svg>
  );
}

export function IconeDocumento({ className = "h-6 w-6", titulo }: Props) {
  return (
    <svg className={className} viewBox="0 0 46 56" fill="none" {...base(titulo)}>
      <path
        d="M3 3h26l14 14v36a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M29 3v14h14" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M11 30h24M11 39h24M11 48h16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconeWhatsapp({ className = "h-5 w-5", titulo }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...base(titulo)}>
      <path
        d="M3.5 20.5l1.3-4.6a8.2 8.2 0 1 1 3.1 3l-4.4 1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.6c.3-.6.6-.6.9-.6h.6c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6a6 6 0 0 0 2.7 2.3c.3.1.5.1.6 0l.6-.7c.2-.2.4-.2.6-.1l1.5.8c.3.1.4.3.4.5 0 .7-.5 1.4-1.1 1.6-.5.2-1.2.3-2.9-.4a9.4 9.4 0 0 1-4.6-4.3c-.4-.9-.4-1.9-.1-2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconeInstagram({ className = "h-[18px] w-[18px]", titulo }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...base(titulo)}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function IconeLinkedin({ className = "h-[18px] w-[18px]", titulo }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...base(titulo)}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7 10.5V17M7 7.4v.1M11.5 17v-3.6a2.1 2.1 0 0 1 4.2 0V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Ícones da barra do editor de texto rico. Só usados aqui, dentro do
 * painel — por isso ficam à parte de `src/components/Icones.tsx`, que é a
 * lista de ícones da página pública.
 */

type Props = { className?: string };

export function IconeNegrito({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 4h6.2a3.6 3.6 0 0 1 0 7.2H7Zm0 7.2h7a3.6 3.6 0 0 1 0 7.2H7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeItalico({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 4h5M6 20h5M15 4l-6 16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconeLink({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.5 14.5l5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M8 16.2a4 4 0 0 1 0-5.7l2.2-2.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M16 7.8a4 4 0 0 1 0 5.7l-2.2 2.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconeCitacao({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7.2c-1.7 0-3 1.3-3 3v3.8h4v-3.8H6.2c0-.8.5-1.4 1.2-1.6Z"
        fill="currentColor"
      />
      <path
        d="M16 7.2c-1.7 0-3 1.3-3 3v3.8h4v-3.8h-1.8c0-.8.5-1.4 1.2-1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconeListaMarcadores({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="6" r="1.3" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1.3" fill="currentColor" />
      <circle cx="4.5" cy="18" r="1.3" fill="currentColor" />
      <path
        d="M9 6h10.5M9 12h10.5M9 18h10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconeListaNumerada({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <text x="2" y="8.2" fontSize="6.4" fontFamily="'DM Mono', monospace" fill="currentColor">
        1
      </text>
      <text x="2" y="14.2" fontSize="6.4" fontFamily="'DM Mono', monospace" fill="currentColor">
        2
      </text>
      <text x="2" y="20.2" fontSize="6.4" fontFamily="'DM Mono', monospace" fill="currentColor">
        3
      </text>
      <path
        d="M9 6h10.5M9 12h10.5M9 18h10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconeImagem({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.3 16.8l4.4-4.4 3 3 3.5-4.4 5 5.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconeVideo({ className = "h-4 w-4" }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 8.8l-3.5 2.4v1.6L20 15.2V8.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Entrada suave quando o bloco encosta na viewport.
 *
 * Usa IntersectionObserver em vez do listener de scroll anterior, que
 * percorria todos os `.reveal` do documento a cada pixel rolado. Cada
 * elemento agora é observado uma vez e o observer se desconecta assim que
 * o bloco aparece.
 *
 * Sem JS (ou sem IntersectionObserver) nada acontece e o conteúdo fica
 * visível, porque o estado escondido vive sob a classe `.js-revelar`, que
 * só é aplicada na raiz quando o React monta.
 */
export default function Revelar({
  children,
  atraso = 0,
  className = "",
}: {
  children: ReactNode;
  /** Atraso em milissegundos, para escalonar itens de uma mesma fileira. */
  atraso?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    if (typeof IntersectionObserver === "undefined") {
      elemento.classList.add("revelar-ativo");
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          elemento.classList.add("revelar-ativo");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${className}`}
      style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}
    >
      {children}
    </div>
  );
}

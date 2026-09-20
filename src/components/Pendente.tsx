import { Fragment } from "react";

/** Usado no split, precisa do grupo de captura para manter os marcadores no resultado. */
const SEPARADOR = /(\[[^\]]+\])/g;

/** Versão sem a flag `g`: `.test()` em regex global carrega `lastIndex` entre
 *  as chamadas e passaria a alternar verdadeiro/falso dentro do map. */
const E_MARCADOR = /^\[[^\]]+\]$/;

/**
 * Destaca os trechos entre colchetes que o Campelo ainda precisa preencher.
 *
 * A ideia é que nenhum placeholder chegue à produção sem ser notado: enquanto
 * o texto estiver no formato [ASSIM], ele aparece sublinhado em barro. Trocou
 * pelo conteúdo real em `src/content.ts`, o destaque some sem mexer no layout.
 */
export default function Pendente({ texto }: { texto: string }) {
  const partes = texto.split(SEPARADOR);

  return (
    <>
      {partes.map((parte, i) =>
        E_MARCADOR.test(parte) ? (
          <span key={i} className="pendente" title="Conteúdo pendente de preenchimento">
            {parte.slice(1, -1).toLowerCase()}
          </span>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}

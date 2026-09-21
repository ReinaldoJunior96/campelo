import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import { conteudoPadrao, mesclarPadrao } from "../conteudoPadrao";
import type { Conteudo } from "../tipos";

const Contexto = createContext<Conteudo>(conteudoPadrao);

/**
 * Entrega o conteúdo do site para os componentes.
 *
 * Começa pelo padrão do bundle e troca pelo que veio da API quando ela
 * responde. É de propósito: a página pinta na hora, com texto real, em vez
 * de piscar um esqueleto vazio enquanto espera a rede. Se a API estiver
 * fora, o site continua no ar com o conteúdo padrão.
 *
 * O efeito colateral é que um campo editado pelo Campelo aparece primeiro
 * no valor antigo por alguns instantes. Para um site desse tamanho o troco
 * compensa. Se um dia isso incomodar, o caminho é pré-renderizar o HTML no
 * build em vez de buscar no cliente.
 */
export function ProvedorConteudo({ children }: { children: ReactNode }) {
  const [conteudo, setConteudo] = useState<Conteudo>(conteudoPadrao);

  useEffect(() => {
    let ativo = true;

    api
      .lerConteudo()
      .then((resposta) => {
        // Mescla com o padrão: uma gravação feita antes de um campo existir
        // não tem esse campo, e sem completar a página renderiza `undefined`.
        if (ativo && resposta.dados) setConteudo(mesclarPadrao(resposta.dados));
      })
      .catch(() => {
        // Silencioso de propósito: o visitante não tem o que fazer com um
        // erro de API, e o conteúdo padrão já está na tela.
      });

    return () => {
      ativo = false;
    };
  }, []);

  return <Contexto.Provider value={conteudo}>{children}</Contexto.Provider>;
}

export const useConteudo = () => useContext(Contexto);

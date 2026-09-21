import { useEffect, useState } from "react";
import { api } from "./api";
import type { Post, PostResumo } from "../tiposBlog";

/**
 * Dados do blog são um recurso à parte do documento `Conteudo` (crescem sem
 * limite, cada post tem seu próprio ciclo de vida), por isso ficam fora do
 * `ProvedorConteudo` e têm seus próprios hooks de busca.
 */

/** Lista de posts publicados. Usado pelo teaser da home e pela página /blog. */
export function usePosts() {
  const [posts, setPosts] = useState<PostResumo[] | null>(null);

  useEffect(() => {
    let ativo = true;

    api
      .listarPosts()
      .then((resposta) => {
        if (ativo) setPosts(resposta.itens);
      })
      .catch(() => {
        if (ativo) setPosts([]);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return { posts, carregando: posts === null };
}

/** Um post publicado por slug, para a página /blog/:slug. */
export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setNaoEncontrado(false);

    api
      .lerPost(slug)
      .then((resposta) => {
        if (ativo) setPost(resposta);
      })
      .catch(() => {
        if (ativo) setNaoEncontrado(true);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [slug]);

  return { post, carregando, naoEncontrado };
}

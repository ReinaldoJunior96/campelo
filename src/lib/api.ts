import type { Conteudo } from "../tipos";
import type { EntradaPost, Post, PostAdmin, PostResumo } from "../tiposBlog";

/**
 * Cliente da API.
 *
 * Tudo é same-origin: o nginx encaminha /api para o container do servidor.
 * Isso deixa o cookie de sessão funcionar sem CORS e sem token no
 * localStorage, que é onde um XSS iria buscá-lo primeiro.
 */

const BASE = "/api";

export class ErroApi extends Error {
  constructor(
    public status: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ErroApi";
  }
}

async function requisitar<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${BASE}${caminho}`, {
    // Sem isto o cookie httpOnly de sessão não acompanha a requisição.
    credentials: "same-origin",
    ...opcoes,
    headers: {
      ...(opcoes.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...opcoes.headers,
    },
  });

  if (resposta.status === 204) return undefined as T;

  const corpo = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new ErroApi(resposta.status, corpo?.erro ?? "Não foi possível completar a ação.");
  }

  return corpo as T;
}

export type Sessao = { email: string };

export type Midia = {
  id: number;
  url: string;
  nomeOriginal: string;
  largura: number;
  altura: number;
  bytes: number;
  criadoEm: string;
  /** Quantas vezes a imagem aparece no conteúdo publicado. */
  emUso: number;
};

export const api = {
  entrar: (email: string, senha: string) =>
    requisitar<Sessao>("/sessao", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    }),

  sair: () => requisitar<void>("/sessao", { method: "DELETE" }),

  sessao: () => requisitar<Sessao>("/sessao"),

  /** `dados` vem nulo enquanto ninguém tiver salvo nada pelo painel. */
  lerConteudo: () =>
    requisitar<{ dados: Conteudo | null; salvoEm: string | null }>("/conteudo"),

  salvarConteudo: (dados: Conteudo) =>
    requisitar<{ salvoEm: string }>("/conteudo", {
      method: "PUT",
      body: JSON.stringify({ dados }),
    }),

  listarMidia: () => requisitar<{ itens: Midia[] }>("/midia"),

  enviarMidia: (arquivo: File) => {
    const forma = new FormData();
    forma.append("arquivo", arquivo);
    return requisitar<Midia>("/midia", { method: "POST", body: forma });
  },

  apagarMidia: (id: number) => requisitar<void>(`/midia/${id}`, { method: "DELETE" }),

  trocarSenha: (senhaAtual: string, senhaNova: string) =>
    requisitar<void>("/senha", {
      method: "PUT",
      body: JSON.stringify({ senhaAtual, senhaNova }),
    }),

  listarPosts: () => requisitar<{ itens: PostResumo[] }>("/posts"),

  lerPost: (slug: string) => requisitar<Post>(`/posts/${slug}`),

  listarPostsAdmin: () => requisitar<{ itens: PostAdmin[] }>("/admin/posts"),

  lerPostAdmin: (id: number) => requisitar<Post>(`/admin/posts/${id}`),

  criarPost: (dados: EntradaPost) =>
    requisitar<Post>("/admin/posts", { method: "POST", body: JSON.stringify(dados) }),

  atualizarPost: (id: number, dados: EntradaPost) =>
    requisitar<Post>(`/admin/posts/${id}`, { method: "PUT", body: JSON.stringify(dados) }),

  apagarPost: (id: number) => requisitar<void>(`/admin/posts/${id}`, { method: "DELETE" }),
};

/**
 * O formato do conteúdo editável do site.
 *
 * Este é o contrato entre três lugares: o padrão em `conteudoPadrao.ts`, o
 * que a API guarda no banco e os formulários do painel. Mexeu aqui, mexa
 * nos três.
 *
 * O servidor valida o documento recebido contra o mesmo formato (em
 * `server/src/esquema.js`) antes de salvar, porque confiar na validação do
 * navegador não protege nada: qualquer um pode chamar a API direto.
 */

export type TipoConteudo = "video" | "artigo" | "pdf";

export type Perfil = {
  nome: string;
  profissao: string;
  crp: string;
  cidade: string;
  modalidade: string;
  formacao: string;
  abordagem: string;
  tempoResposta: string;
  whatsapp: string;
  mensagemWhatsapp: string;
  instagram: string;
  linkedin: string;
};

export type Hero = {
  eyebrow: string;
  titulo: string;
  texto: string;
  ctaPrimario: string;
  ctaSecundario: string;
  foto: string;
  fotoAlt: string;
};

export type Sobre = {
  eyebrow: string;
  titulo: string;
  paragrafos: string[];
  foto: string;
  fotoAlt: string;
};

export type ItemCaminho = {
  titulo: string;
  texto: string;
};

export type Caminhos = {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  itens: ItemCaminho[];
};

export type Passo = {
  titulo: string;
  texto: string;
};

export type ComoFunciona = {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  passos: Passo[];
};

export type ItemConteudo = {
  tipo: TipoConteudo;
  categoria: string;
  titulo: string;
  texto: string;
  acao: string;
  href: string;
  /** Capa própria. Vazio usa a capa padrão do tipo. */
  capa: string;
};

export type Conteudos = {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  itens: ItemConteudo[];
};

export type ItemFaq = {
  pergunta: string;
  resposta: string;
};

export type Faq = {
  eyebrow: string;
  titulo: string;
  itens: ItemFaq[];
};

export type Chamada = {
  titulo: string;
  texto: string;
  cta: string;
};

export type Rodape = {
  frase: string;
};

export type Conteudo = {
  perfil: Perfil;
  hero: Hero;
  sobre: Sobre;
  caminhos: Caminhos;
  comoFunciona: ComoFunciona;
  conteudos: Conteudos;
  faq: Faq;
  chamada: Chamada;
  rodape: Rodape;
};

/** Retorna true quando o valor ainda é um placeholder no formato [ASSIM]. */
export const pendente = (valor: string) => /^\[.+\]$/.test(valor.trim());

/** Monta o link do WhatsApp com a mensagem já preenchida. */
export function linkWhatsapp(perfil: Pick<Perfil, "whatsapp" | "mensagemWhatsapp">) {
  const numero = perfil.whatsapp.replace(/\D/g, "");
  const texto = encodeURIComponent(perfil.mensagemWhatsapp);
  return `https://wa.me/${numero}?text=${texto}`;
}

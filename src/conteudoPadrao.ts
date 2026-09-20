import type { Conteudo } from "./tipos";

/**
 * Conteúdo inicial do site.
 *
 * Serve para três coisas: é o que aparece enquanto a API responde, é o que
 * aparece se a API estiver fora do ar, e é o ponto de partida do painel na
 * primeira vez que o Campelo abre o admin (antes de existir qualquer
 * gravação no banco).
 *
 * Por isso o padrão vive aqui, no front, e não no servidor: assim existe
 * uma fonte só. O banco guarda apenas o que foi de fato editado.
 *
 * Os campos entre colchetes aparecem destacados na página. É de propósito:
 * placeholder que se parece com texto final vai para produção sem ninguém
 * notar.
 */
export const conteudoPadrao: Conteudo = {
  perfil: {
    nome: "Campelo",
    profissao: "Psicólogo",
    crp: "CRP 22/07472",
    cidade: "[CIDADE/UF]",
    modalidade: "[ONLINE E PRESENCIAL]",
    formacao: "[GRADUAÇÃO E PÓS]",
    abordagem: "[ABORDAGEM]",
    tempoResposta: "[X]",
    whatsapp: "559882126848",
    mensagemWhatsapp:
      "Oi, Campelo! Cheguei pelo site e queria saber mais sobre os atendimentos.",
    instagram: "[LINK INSTAGRAM]",
    linkedin: "[LINK LINKEDIN]",
  },

  hero: {
    eyebrow: "Existir, sentir e pertencer",
    titulo: "Cuidar de si é um ato de amor, resistência e coragem.",
    texto:
      "Psicologia acolhedora, humana e democrática, para ouvir cada pessoa em sua totalidade e cuidar do bem-estar sem deixar de fora classe, gênero e raça.",
    ctaPrimario: "Inicie sua jornada",
    ctaSecundario: "Como funciona",
    foto: "/assets/perfil.jpeg",
    fotoAlt: "Campelo, psicólogo, ao ar livre em um dia de sol",
  },

  sobre: {
    eyebrow: "Sobre",
    titulo: "Sua voz merece um lugar seguro.",
    paragrafos: [
      "Sou o Campelo, psicólogo que acredita na psicoterapia como espaço de dignidade e de reparação. Meu compromisso é oferecer uma escuta qualificada que reconhece as múltiplas vivências, respeita a ancestralidade e valida cada sentimento.",
      "Aqui, as questões de classe, gênero e raça não são meros detalhes: são alicerce do meu trabalho. Juntos, caminhamos para reencontrar seu bem-estar consigo mesmo e no mundo.",
    ],
    foto: "/assets/perfil2.jpeg",
    fotoAlt: "Campelo sorrindo, em um evento",
  },

  caminhos: {
    eyebrow: "Caminhos de cuidado",
    titulo: "Caminhos de cuidado",
    subtitulo: "Especialidades voltadas ao bem-estar integral e identitário.",
    itens: [
      {
        titulo: "Impactos do racismo",
        texto:
          "Acolhimento para feridas emocionais ligadas à vivência racial e social, incluindo o cansaço que ninguém nomeia.",
      },
      {
        titulo: "Autoestima e identidade",
        texto:
          "Fortalecimento do eu e celebração da própria história, da própria imagem e do próprio corpo.",
      },
      {
        titulo: "Ansiedade",
        texto:
          "Estratégias para encontrar calma e presença em meio às pressões do cotidiano, sem fingir que elas não existem.",
      },
      {
        titulo: "Vínculos saudáveis",
        texto:
          "Relações construídas com respeito, limites claros e afeto real, dentro e fora de casa.",
      },
    ],
  },

  comoFunciona: {
    eyebrow: "Como funciona",
    titulo: "Do primeiro oi até a primeira sessão",
    subtitulo:
      "Sem formulário longo e sem mistério. Você escreve, a gente combina um horário e conversa.",
    passos: [
      {
        titulo: "Você manda mensagem",
        texto:
          "Pelo WhatsApp, com o texto que quiser. Não precisa saber explicar direito o que está sentindo.",
      },
      {
        titulo: "A gente combina o horário",
        texto:
          "Atendimento [ONLINE E PRESENCIAL], em [CIDADE/UF]. Sessões de [50 MINUTOS], [FREQUÊNCIA].",
      },
      {
        titulo: "A primeira conversa",
        texto:
          "Um encontro para nos conhecermos e entender o que te traz aqui. Valor: [VALOR DA SESSÃO].",
      },
    ],
  },

  conteudos: {
    eyebrow: "Conteúdos e mídias",
    titulo: "Conteúdos e mídias",
    subtitulo: "Material para assistir, ler e aprofundar o cuidado no seu tempo.",
    itens: [
      {
        tipo: "video",
        categoria: "YouTube",
        titulo: "Encruzilhadas",
        texto: "Uma conversa em vídeo sobre cuidado, subjetividade e presença.",
        acao: "Assistir",
        href: "https://www.youtube.com/watch?v=n4om7-0HlFM",
        capa: "",
      },
      {
        tipo: "artigo",
        categoria: "Artigo",
        titulo: "Publicação acadêmica",
        texto: "Reflexões sobre saúde mental, raça e representatividade.",
        acao: "Ler artigo",
        href: "https://periodicos.newsciencepubl.com/arace/article/view/5292",
        capa: "",
      },
      {
        tipo: "pdf",
        categoria: "PDF",
        titulo: "Encontro de Gênero",
        texto: "Trabalho completo, para leitura e estudo sem pressa.",
        acao: "Abrir PDF",
        href: "/assets/Trabalho-Completo-Encontro-de-Genero.pdf",
        capa: "",
      },
    ],
  },

  faq: {
    eyebrow: "Perguntas frequentes",
    titulo: "O que costumam me perguntar",
    itens: [
      {
        pergunta: "Preciso saber explicar o que estou sentindo?",
        resposta:
          "Não. Chegar sem a palavra certa é o ponto de partida mais comum. Encontrar o nome das coisas é parte do trabalho, não pré-requisito.",
      },
      {
        pergunta: "O atendimento é online ou presencial?",
        resposta: "[ONLINE E PRESENCIAL], em [CIDADE/UF]. [DETALHAR ENDEREÇO OU PLATAFORMA]",
      },
      {
        pergunta: "Quanto dura e com que frequência?",
        resposta:
          "Sessões de [50 MINUTOS], normalmente [FREQUÊNCIA]. O ritmo é combinado entre nós dois.",
      },
      {
        pergunta: "Qual o valor da sessão?",
        resposta: "[VALOR DA SESSÃO]. [POLÍTICA DE VALOR SOCIAL OU CONVÊNIO, SE HOUVER]",
      },
      {
        pergunta: "Preciso ser uma pessoa negra para me atender?",
        resposta:
          "Não. A escuta é para todo mundo. O que muda é que aqui raça, classe e gênero não ficam de fora da conversa quando aparecem.",
      },
    ],
  },

  chamada: {
    titulo: "Quando quiser conversar, estou aqui.",
    texto:
      "Sem compromisso de fechar nada na primeira mensagem. Só uma conversa para entender se faz sentido.",
    cta: "Falar no WhatsApp",
  },

  rodape: {
    frase: "Cuidar de si também é um ato de dignidade.",
  },
};

export const navegacao = [
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#atuacao", rotulo: "Atuação" },
  { href: "#como-funciona", rotulo: "Como funciona" },
  { href: "#conteudos", rotulo: "Conteúdos" },
];

import path from "node:path";

/**
 * Configuração vinda do ambiente.
 *
 * O servidor se recusa a subir em produção sem JWT_SECRET definido. Um
 * segredo com valor padrão é o mesmo que não ter segredo nenhum: quem
 * conhecer o padrão assina o próprio cookie de sessão e entra no painel.
 */

const producao = process.env.NODE_ENV === "production";

function obrigatorio(nome) {
  const valor = process.env[nome];

  if (valor && valor.trim()) return valor;

  if (producao) {
    throw new Error(
      `${nome} não está definido. Em produção não existe valor padrão para essa variável.`,
    );
  }

  console.warn(
    `[config] ${nome} não definido. Usando valor de desenvolvimento, que NÃO serve para produção.`,
  );
  return `desenvolvimento-inseguro-${nome}`;
}

export const config = {
  producao,
  porta: Number(process.env.PORT ?? 3333),

  jwtSegredo: obrigatorio("JWT_SECRET"),
  /** Sete dias. O painel é de uso esporádico, não vale forçar login toda hora. */
  sessaoDuracaoSegundos: 60 * 60 * 24 * 7,
  cookieNome: "campelo_sessao",

  /**
   * Cookie com a flag `secure` só viaja por HTTPS.
   *
   * Com ela ligada em um site servido por HTTP puro, o navegador aceita a
   * resposta do login e descarta o cookie em silêncio: a tela volta para o
   * formulário sem erro nenhum, como se a senha estivesse errada. Por isso
   * é uma variável separada, e não simplesmente `producao`: dá para testar
   * na VPS pelo IP antes de o domínio e o certificado existirem.
   */
  cookieSeguro: (process.env.COOKIE_SEGURO ?? String(producao)) === "true",

  /**
   * Quantos proxies existem na frente. Em produção são dois: Caddy termina
   * o TLS e o nginx serve os arquivos.
   *
   * Valor alto demais deixa qualquer um forjar X-Forwarded-For e escapar do
   * limite de tentativas do login, então não chute: conte os saltos.
   */
  trustProxy: Number(process.env.TRUST_PROXY ?? (producao ? 2 : 1)),

  /** Credenciais da primeira conta, usadas só quando o banco está vazio. */
  adminEmail: process.env.ADMIN_EMAIL ?? "campelo@exemplo.com",
  adminSenha: process.env.ADMIN_SENHA ?? "",

  /** Volume persistente: banco e uploads moram aqui. */
  dadosDir: process.env.DADOS_DIR ?? path.resolve("dados"),

  uploadMaxBytes: 8 * 1024 * 1024,
  /** Largura máxima depois do redimensionamento. */
  imagemLarguraMax: 1600,
  imagemQualidade: 82,
};

config.bancoArquivo = path.join(config.dadosDir, "campelo.db");
config.uploadsDir = path.join(config.dadosDir, "uploads");

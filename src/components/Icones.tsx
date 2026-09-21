/**
 * Ícones do Font Awesome, como componentes React.
 *
 * A folha de estilo entra por CDN no `index.html` e o host está liberado no
 * Content-Security-Policy do `Caddyfile`. Diferente do script do Lucide que
 * já morou aqui, o Font Awesome é só CSS: o ícone é um caractere de webfont
 * desenhado no `::before`, então nada precisa ser injetado no DOM e nada
 * some quando um trecho da árvore remonta.
 *
 * O tamanho vem de `font-size`, não de largura e altura — por isso as
 * classes usadas aqui e nas chamadas são `text-*` e não `h-* w-*`. A largura
 * do glifo é fixa em 1.25em pelo próprio Font Awesome, o que mantém os
 * ícones alinhados quando aparecem em lista.
 *
 * Nomes e famílias: https://fontawesome.com/search?ic=free
 */

type Familia = "solid" | "regular" | "brands";

export type PropsIcone = {
  className?: string;
  /**
   * Some no leitor de tela quando não recebe título. É o padrão certo: quase
   * todo ícone daqui fica ao lado do texto que já diz a mesma coisa, e
   * anunciar duas vezes atrapalha. Passe `titulo` só quando o ícone é a
   * única pista do que aquele controle faz.
   */
  titulo?: string;
};

export function Icone({
  nome,
  familia = "solid",
  className = "",
  titulo,
}: PropsIcone & { nome: string; familia?: Familia }) {
  return (
    <i
      className={`fa-${familia} fa-${nome} ${className}`.trim()}
      {...(titulo ? { role: "img", "aria-label": titulo } : { "aria-hidden": true })}
    />
  );
}

// Os ícones abaixo existem como componente nomeado porque aparecem em mais de
// um lugar: assim trocar o desenho de um deles é mexer numa linha só. Ícone
// que aparece uma vez é chamado direto com `<Icone nome="…" />`.

export const IconeMenu = ({ className = "text-xl", ...resto }: PropsIcone) => (
  <Icone nome="bars" className={className} {...resto} />
);

export const IconeFechar = ({ className = "text-xl", ...resto }: PropsIcone) => (
  <Icone nome="xmark" className={className} {...resto} />
);

export const IconePlay = ({ className = "text-xl", ...resto }: PropsIcone) => (
  <Icone nome="play" className={className} {...resto} />
);

export const IconeDocumento = ({ className = "text-2xl", ...resto }: PropsIcone) => (
  <Icone nome="file-lines" familia="regular" className={className} {...resto} />
);

export const IconeCopiar = ({ className = "text-[17px]", ...resto }: PropsIcone) => (
  <Icone nome="copy" familia="regular" className={className} {...resto} />
);

export const IconeWhatsapp = ({ className = "text-xl", ...resto }: PropsIcone) => (
  <Icone nome="whatsapp" familia="brands" className={className} {...resto} />
);

export const IconeInstagram = ({ className = "text-[18px]", ...resto }: PropsIcone) => (
  <Icone nome="instagram" familia="brands" className={className} {...resto} />
);

export const IconeLinkedin = ({ className = "text-[18px]", ...resto }: PropsIcone) => (
  <Icone nome="linkedin-in" familia="brands" className={className} {...resto} />
);

export const IconeX = ({ className = "text-[17px]", ...resto }: PropsIcone) => (
  <Icone nome="x-twitter" familia="brands" className={className} {...resto} />
);

export const IconeFacebook = ({ className = "text-[18px]", ...resto }: PropsIcone) => (
  <Icone nome="facebook-f" familia="brands" className={className} {...resto} />
);

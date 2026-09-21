import { IconeWhatsapp } from "./Icones";
import { useConteudo } from "../lib/conteudo";
import { linkWhatsapp } from "../tipos";

/**
 * Atalho flutuante para o WhatsApp.
 *
 * O rótulo expande no hover em telas grandes e fica sempre oculto no mobile,
 * onde só o círculo aparece: em tela pequena o texto expandido cobria o
 * conteúdo e o alvo de toque continua sendo o círculo de 56px de qualquer jeito.
 */
export default function BotaoWhatsapp() {
  const { perfil } = useConteudo();

  return (
    <a
      href={linkWhatsapp(perfil)}
      target="_blank"
      rel="noreferrer noopener"
      className="group fixed bottom-6 right-5 z-[80] flex h-14 items-center gap-0 rounded-full bg-tinta px-4 text-areia shadow-xl transition-colors duration-300 ease-mare hover:bg-barro md:bottom-8 md:right-8"
    >
      <IconeWhatsapp className="shrink-0 text-2xl" titulo="Falar no WhatsApp" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,padding] duration-300 ease-mare group-hover:max-w-xs group-hover:pl-2.5 md:inline">
        Se quiser conversar, estou aqui.
      </span>
    </a>
  );
}

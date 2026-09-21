import { useEffect, useRef, useState } from "react";
import { IconeFechar, IconeMenu, IconeWhatsapp } from "./Icones";
import { navegacao } from "../conteudoPadrao";
import { useConteudo } from "../lib/conteudo";
import { linkWhatsapp } from "../tipos";

const FOCAVEIS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Nav() {
  const { perfil } = useConteudo();
  const zap = linkWhatsapp(perfil);

  const [aberto, setAberto] = useState(false);
  const gaveta = useRef<HTMLElement | null>(null);
  const botaoAbrir = useRef<HTMLButtonElement | null>(null);

  // Esc fecha, Tab circula dentro da gaveta e o scroll do corpo trava
  // enquanto o menu está aberto. Ao fechar, o foco volta para o botão que
  // abriu, senão o leitor de tela é jogado para o começo do documento.
  useEffect(() => {
    if (!aberto) return;

    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAberto(false);
        return;
      }

      if (evento.key !== "Tab" || !gaveta.current) return;

      const alvos = gaveta.current.querySelectorAll<HTMLElement>(FOCAVEIS);
      if (alvos.length === 0) return;

      const primeiro = alvos[0];
      const ultimo = alvos[alvos.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);
    gaveta.current?.querySelector<HTMLElement>(FOCAVEIS)?.focus();

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = anterior;
      botaoAbrir.current?.focus();
    };
  }, [aberto]);

  return (
    <>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-tinta focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-areia"
      >
        Pular para o conteúdo
      </a>

      <header className="fixed inset-x-0 top-0 z-[90] border-b border-tinta/10 bg-areia/85 backdrop-blur-md">
        <nav
          aria-label="Principal"
          className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3 md:px-16 md:py-[18px]"
        >
          {/* "/" e não "#topo": o Nav agora também aparece em /blog, onde essa
              âncora não existe. */}
          <a href="/" className="flex shrink-0 items-center" aria-label="Campelo, início">
            <img
              src="/assets/logo.png"
              alt="Campelo"
              width={132}
              height={40}
              className="h-8 w-auto md:h-[30px]"
            />
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navegacao.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-tinta transition-colors hover:text-barro"
              >
                {item.rotulo}
              </a>
            ))}
            <a
              href={zap}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full bg-tinta px-6 py-3 text-sm font-bold text-areia transition-colors hover:bg-tinta-funda"
            >
              Agendar conversa
            </a>
          </div>

          <button
            ref={botaoAbrir}
            type="button"
            onClick={() => setAberto(true)}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-tinta/20 text-tinta transition-colors hover:bg-tinta/5 md:hidden"
          >
            <IconeMenu titulo="Abrir menu" />
          </button>
        </nav>
      </header>

      {aberto && (
        <div
          className="fixed inset-0 z-[95] bg-tinta/50 backdrop-blur-[2px] md:hidden"
          onClick={() => setAberto(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="menu-mobile"
        ref={gaveta}
        aria-label="Menu"
        aria-hidden={!aberto}
        // `visibility: hidden` tira a gaveta fechada da ordem de tabulação.
        // É o equivalente ao `inert`, que o React 18 ainda não tipa como prop.
        className={`fixed inset-y-0 left-0 z-[96] w-72 max-w-[82vw] bg-areia shadow-2xl transition-[transform,visibility] duration-300 ease-mare md:hidden ${
          aberto ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col gap-8 px-6 py-6">
          <div className="flex items-center justify-between">
            <img src="/assets/logo.png" alt="Campelo" width={112} height={34} className="h-[34px] w-auto" />
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-tinta/20 text-tinta transition-colors hover:bg-tinta/5"
            >
              <IconeFechar titulo="Fechar menu" />
            </button>
          </div>

          <div className="flex flex-col">
            {navegacao.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="border-b border-tinta/10 py-4 font-display text-xl font-semibold tracking-tight text-tinta"
              >
                {item.rotulo}
              </a>
            ))}
          </div>

          <a
            href={zap}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => setAberto(false)}
            className="mt-auto flex items-center justify-center gap-2 rounded-full bg-barro px-6 py-4 text-sm font-bold text-areia"
          >
            <IconeWhatsapp className="text-xl" />
            Agendar conversa
          </a>
        </div>
      </aside>
    </>
  );
}

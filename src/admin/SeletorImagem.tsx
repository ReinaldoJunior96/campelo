import { useRef, useState } from "react";
import { Botao } from "./campos";
import { api, type Midia } from "../lib/api";

/** Imagens que já vieram no projeto, sempre disponíveis para escolher. */
const DO_PROJETO = [
  { url: "/assets/perfil.jpeg", nome: "Perfil ao ar livre" },
  { url: "/assets/perfil2.jpeg", nome: "Perfil sorrindo" },
  { url: "/assets/foto.jpg", nome: "Foto de apoio" },
];

const emKb = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

export default function SeletorImagem({
  rotulo,
  valor,
  aoMudar,
  midia,
  aoEnviar,
  permitirVazio = false,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (url: string) => void;
  midia: Midia[];
  aoEnviar: (item: Midia) => void;
  /** Quando true, a imagem pode ser removida e o site usa a arte padrão. */
  permitirVazio?: boolean;
}) {
  const [aberto, setAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const entrada = useRef<HTMLInputElement | null>(null);

  async function enviar(arquivo: File | undefined) {
    if (!arquivo) return;

    setEnviando(true);
    setErro("");

    try {
      const item = await api.enviarMidia(arquivo);
      aoEnviar(item);
      aoMudar(item.url);
      setAberto(false);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui enviar a imagem.");
    } finally {
      setEnviando(false);
      // Zera a entrada para que escolher o mesmo arquivo de novo dispare o evento.
      if (entrada.current) entrada.current.value = "";
    }
  }

  const opcoes = [
    ...midia.map((item) => ({ url: item.url, nome: `${item.nomeOriginal} · ${emKb(item.bytes)}` })),
    ...DO_PROJETO,
  ];

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-bold text-tinta">{rotulo}</span>

      <div className="flex items-center gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-tinta/20 bg-white">
          {valor ? (
            <img src={valor} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] leading-tight text-tinta/45">
              arte padrão
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Botao onClick={() => setAberto((v) => !v)}>
            {aberto ? "Fechar" : "Trocar imagem"}
          </Botao>
          {permitirVazio && valor && (
            <Botao variante="perigo" onClick={() => aoMudar("")}>
              Usar arte padrão
            </Botao>
          )}
        </div>
      </div>

      {aberto && (
        <div className="flex flex-col gap-4 rounded-cartao border border-tinta/15 bg-white p-4">
          <div>
            <input
              ref={entrada}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              disabled={enviando}
              onChange={(evento) => enviar(evento.target.files?.[0])}
              className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-tinta file:px-4 file:py-2 file:text-sm file:font-bold file:text-areia hover:file:bg-tinta-funda"
            />
            <p className="mt-2 text-xs text-tinta/60">
              Até 8 MB. A imagem é reduzida para no máximo 1600px de largura e convertida
              para WebP no servidor, então pode mandar a foto direto do celular.
            </p>
            {enviando && <p className="mt-2 text-xs font-bold text-barro">Enviando…</p>}
            {erro && <p className="mt-2 text-xs font-bold text-barro">{erro}</p>}
          </div>

          <div className="border-t border-tinta/10 pt-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-tinta/55">
              Ou escolha uma já enviada
            </p>
            <ul className="grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-5">
              {opcoes.map((opcao) => (
                <li key={opcao.url}>
                  <button
                    type="button"
                    onClick={() => {
                      aoMudar(opcao.url);
                      setAberto(false);
                    }}
                    title={opcao.nome}
                    className={`block aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors ${
                      valor === opcao.url ? "border-barro" : "border-transparent hover:border-tinta/30"
                    }`}
                  >
                    <img src={opcao.url} alt={opcao.nome} className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
            {opcoes.length === 0 && (
              <p className="text-sm text-tinta/60">Nenhuma imagem enviada ainda.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

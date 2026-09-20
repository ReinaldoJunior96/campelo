import { useId, type ReactNode } from "react";
import { pendente } from "../tipos";

/**
 * Campos de formulário do painel.
 *
 * Todo campo tem <label> de verdade ligado ao controle. Placeholder não
 * substitui rótulo: some quando a pessoa começa a digitar, justo quando ela
 * mais precisa lembrar o que era aquele campo.
 */

const baseControle =
  "w-full rounded-lg border border-tinta/20 bg-white px-3 py-2.5 text-[15px] text-tinta " +
  "outline-none transition-colors placeholder:text-tinta/35 focus:border-barro";

function Aviso({ valor }: { valor: string }) {
  if (!pendente(valor)) return null;
  return (
    <span className="text-xs font-medium text-barro">
      Ainda é um texto de exemplo. Aparece destacado no site.
    </span>
  );
}

export function Campo({
  rotulo,
  valor,
  aoMudar,
  dica,
  tipo = "text",
  placeholder,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  dica?: string;
  tipo?: string;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-tinta">
        {rotulo}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        onChange={(evento) => aoMudar(evento.target.value)}
        className={baseControle}
      />
      {dica && <span className="text-xs text-tinta/60">{dica}</span>}
      <Aviso valor={valor} />
    </div>
  );
}

export function AreaTexto({
  rotulo,
  valor,
  aoMudar,
  dica,
  linhas = 4,
}: {
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  dica?: string;
  linhas?: number;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-tinta">
        {rotulo}
      </label>
      <textarea
        id={id}
        rows={linhas}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        className={`${baseControle} resize-y leading-relaxed`}
      />
      {dica && <span className="text-xs text-tinta/60">{dica}</span>}
      <Aviso valor={valor} />
    </div>
  );
}

export function Selecao<T extends string>({
  rotulo,
  valor,
  opcoes,
  aoMudar,
}: {
  rotulo: string;
  valor: T;
  opcoes: { valor: T; rotulo: string }[];
  aoMudar: (valor: T) => void;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-tinta">
        {rotulo}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value as T)}
        className={baseControle}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Bloco({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-bloco border border-tinta/15 bg-areia p-6">
      <div className="mb-5 flex flex-col gap-1">
        <h2 className="font-display text-xl font-bold tracking-tight">{titulo}</h2>
        {descricao && <p className="text-sm text-tinta/65">{descricao}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function Botao({
  children,
  onClick,
  tipo = "button",
  variante = "secundario",
  desabilitado,
}: {
  children: ReactNode;
  onClick?: () => void;
  tipo?: "button" | "submit";
  variante?: "primario" | "secundario" | "perigo";
  desabilitado?: boolean;
}) {
  const estilos = {
    primario: "bg-barro text-areia hover:bg-barro-escuro",
    secundario: "border border-tinta/25 text-tinta hover:bg-tinta/5",
    perigo: "border border-barro/50 text-barro hover:bg-barro/10",
  };

  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={desabilitado}
      className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variante]}`}
    >
      {children}
    </button>
  );
}

/**
 * Lista com adicionar, remover e reordenar.
 *
 * Reordenação por botão em vez de arrastar: funciona no teclado, funciona no
 * leitor de tela e funciona no celular, que é onde o Campelo provavelmente
 * vai mexer nisso.
 */
export function ListaEditavel<T>({
  itens,
  aoMudar,
  criarNovo,
  rotuloItem,
  maximo = 12,
  minimo = 1,
  children,
}: {
  itens: T[];
  aoMudar: (itens: T[]) => void;
  criarNovo: () => T;
  rotuloItem: (item: T, indice: number) => string;
  maximo?: number;
  minimo?: number;
  children: (item: T, atualizar: (parcial: Partial<T>) => void) => ReactNode;
}) {
  const mover = (de: number, para: number) => {
    if (para < 0 || para >= itens.length) return;
    const copia = [...itens];
    const [movido] = copia.splice(de, 1);
    copia.splice(para, 0, movido);
    aoMudar(copia);
  };

  return (
    <div className="flex flex-col gap-4">
      {itens.map((item, indice) => (
        <div key={indice} className="rounded-cartao border border-tinta/15 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-tinta/10 pb-3">
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-tinta/55">
              {String(indice + 1).padStart(2, "0")} · {rotuloItem(item, indice) || "sem título"}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => mover(indice, indice - 1)}
                disabled={indice === 0}
                aria-label={`Mover para cima: ${rotuloItem(item, indice)}`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-tinta transition-colors hover:bg-tinta/5 disabled:opacity-30"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => mover(indice, indice + 1)}
                disabled={indice === itens.length - 1}
                aria-label={`Mover para baixo: ${rotuloItem(item, indice)}`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-tinta transition-colors hover:bg-tinta/5 disabled:opacity-30"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => aoMudar(itens.filter((_, i) => i !== indice))}
                disabled={itens.length <= minimo}
                aria-label={`Remover: ${rotuloItem(item, indice)}`}
                title={
                  itens.length <= minimo
                    ? `Precisa de pelo menos ${minimo} item.`
                    : undefined
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-barro transition-colors hover:bg-barro/10 disabled:opacity-30"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {children(item, (parcial) =>
              aoMudar(itens.map((atual, i) => (i === indice ? { ...atual, ...parcial } : atual))),
            )}
          </div>
        </div>
      ))}

      <div>
        <Botao onClick={() => aoMudar([...itens, criarNovo()])} desabilitado={itens.length >= maximo}>
          Adicionar item
        </Botao>
        {itens.length >= maximo && (
          <span className="ml-3 text-xs text-tinta/60">Máximo de {maximo} itens.</span>
        )}
      </div>
    </div>
  );
}

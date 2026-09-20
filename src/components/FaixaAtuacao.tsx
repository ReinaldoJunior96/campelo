import { useConteudo } from "../lib/conteudo";

/**
 * Faixa horizontal entre o hero e o "Sobre". Adianta as áreas de atuação
 * para quem ainda não rolou a página, sem repetir a descrição.
 */
export default function FaixaAtuacao() {
  const { caminhos } = useConteudo();

  return (
    <div className="border-y border-tinta/10">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-10 gap-y-3 px-5 py-5 md:px-16">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-tinta/50">
          {caminhos.eyebrow}
        </span>
        {caminhos.itens.map((item) => (
          <span key={item.titulo} className="text-[15px] font-medium">
            {item.titulo}
          </span>
        ))}
      </div>
    </div>
  );
}

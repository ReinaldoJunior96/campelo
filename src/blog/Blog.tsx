import { useMemo, useState } from "react";
import CartaoPost from "./CartaoPost";
import BotaoWhatsapp from "../components/BotaoWhatsapp";
import Nav from "../components/Nav";
import Revelar from "../components/Revelar";
import Rodape from "../components/Rodape";
import { ProvedorConteudo } from "../lib/conteudo";
import { usePosts } from "../lib/posts";

const TODOS = "Todos";

function ConteudoBlog() {
  const { posts, carregando } = usePosts();
  const [categoria, setCategoria] = useState(TODOS);

  const categorias = useMemo(() => {
    if (!posts) return [TODOS];
    return [TODOS, ...Array.from(new Set(posts.map((p) => p.categoria)))];
  }, [posts]);

  const filtrados = useMemo(() => {
    if (!posts) return [];
    return categoria === TODOS ? posts : posts.filter((p) => p.categoria === categoria);
  }, [posts, categoria]);

  return (
    <>
      <Nav />

      <main id="conteudo-principal">
        <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-28 md:px-16 md:pb-20 md:pt-36">
          <Revelar className="flex flex-col items-center gap-4 text-center">
            <span className="font-mono text-eyebrow uppercase text-mare">Blog</span>
            <h1 className="text-[2.25rem] md:text-[2.875rem]">Ideias, registradas para durar</h1>
            <p className="max-w-[35rem] text-[17px] text-tinta/70">
              Reflexões sobre saúde mental, identidade e cuidado, escritas por mim.
            </p>
          </Revelar>

          {!carregando && categorias.length > 2 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {categorias.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoria(c)}
                  aria-pressed={categoria === c}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    categoria === c
                      ? "bg-tinta text-areia"
                      : "border-[1.5px] border-tinta/30 text-tinta hover:border-tinta/60 hover:bg-tinta/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {carregando ? (
            <p className="mt-20 text-center font-mono text-xs uppercase tracking-[0.12em] text-tinta/50">
              Carregando posts…
            </p>
          ) : filtrados.length === 0 ? (
            <div className="mx-auto mt-16 flex max-w-[28rem] flex-col items-center gap-2 rounded-bloco border border-dashed border-tinta/20 px-8 py-14 text-center">
              <p className="font-display text-xl font-bold tracking-tight text-tinta/80">
                {posts && posts.length === 0 ? "Ainda não tem post por aqui" : "Nada nessa categoria"}
              </p>
              <p className="text-sm text-tinta/60">
                {posts && posts.length === 0
                  ? "Volte em breve — em pouco tempo tem novidade."
                  : "Escolha outra categoria acima ou veja todos os posts."}
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {filtrados.map((post, indice) => (
                <CartaoPost key={post.id} post={post} atraso={indice * 90} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Rodape />
      <BotaoWhatsapp />
    </>
  );
}

export default function Blog() {
  return (
    <ProvedorConteudo>
      <ConteudoBlog />
    </ProvedorConteudo>
  );
}

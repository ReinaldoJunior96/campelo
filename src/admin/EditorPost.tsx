import { useEffect, useState } from "react";
import { AreaTexto, Bloco, Botao, Campo, Selecao } from "./campos";
import EditorTiptap from "./EditorTiptap";
import SeletorImagem from "./SeletorImagem";
import BotaoCompartilhar from "../blog/BotaoCompartilhar";
import { api, type Midia } from "../lib/api";
import { corpoVazio, type EntradaPost, type Post, type StatusPost } from "../tiposBlog";

type IdEditor = number | "novo";

const PADRAO: EntradaPost = {
  titulo: "",
  resumo: "",
  categoria: "",
  capa: "",
  capaAlt: "",
  corpo: corpoVazio,
  status: "rascunho",
};

/**
 * Tela dedicada de post, ciclo de vida próprio (não é mais um item do
 * `ListaEditavel` da aba de posts): um post inteiro — texto rico, capa,
 * embeds — é grande demais pra caber numa linha daquele componente, e cada
 * post é salvo de forma independente, com seu próprio botão "Salvar".
 */
export default function EditorPost({ id, aoFechar }: { id: IdEditor; aoFechar: () => void }) {
  const [dados, setDados] = useState<EntradaPost>(PADRAO);
  const [postSalvo, setPostSalvo] = useState<Post | null>(null);
  const [midia, setMidia] = useState<Midia[]>([]);
  const [carregando, setCarregando] = useState(id !== "novo");
  const [salvando, setSalvando] = useState(false);
  const [sujo, setSujo] = useState(false);
  const [erro, setErro] = useState("");
  const [recado, setRecado] = useState("");

  useEffect(() => {
    Promise.all([id === "novo" ? Promise.resolve(null) : api.lerPostAdmin(id), api.listarMidia()])
      .then(([post, respostaMidia]) => {
        if (post) {
          setDados({
            titulo: post.titulo,
            resumo: post.resumo,
            categoria: post.categoria,
            capa: post.capa,
            capaAlt: post.capaAlt,
            corpo: post.corpo,
            status: post.status,
          });
          setPostSalvo(post);
        }
        setMidia(respostaMidia.itens);
      })
      .catch((e) => setErro(e instanceof Error ? e.message : "Não consegui carregar o post."))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(() => {
    if (!sujo) return;
    const aoSairDaPagina = (evento: BeforeUnloadEvent) => {
      evento.preventDefault();
      evento.returnValue = "";
    };
    window.addEventListener("beforeunload", aoSairDaPagina);
    return () => window.removeEventListener("beforeunload", aoSairDaPagina);
  }, [sujo]);

  function definir(parcial: Partial<EntradaPost>) {
    setDados((atual) => ({ ...atual, ...parcial }));
    setSujo(true);
    setRecado("");
  }

  async function salvar() {
    setSalvando(true);
    setErro("");
    setRecado("");

    try {
      const salvo =
        postSalvo === null
          ? await api.criarPost(dados)
          : await api.atualizarPost(postSalvo.id, dados);

      setPostSalvo(salvo);
      setMidia((await api.listarMidia()).itens);
      setSujo(false);
      setRecado("Salvo.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui salvar.");
    } finally {
      setSalvando(false);
    }
  }

  function fechar() {
    if (sujo && !confirm("Você tem alterações não salvas. Sair mesmo assim?")) return;
    aoFechar();
  }

  if (carregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-tinta/65">Carregando…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Botao onClick={fechar}>← Voltar para os posts</Botao>
        <div className="flex items-center gap-3">
          {sujo && (
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-barro">
              Não salvo
            </span>
          )}
          <Botao variante="primario" onClick={salvar} desabilitado={salvando}>
            {salvando ? "Salvando…" : "Salvar"}
          </Botao>
        </div>
      </div>

      {(recado || erro) && (
        <p
          role="status"
          className={`rounded-lg px-4 py-3 text-sm font-bold ${
            erro ? "bg-barro/15 text-barro" : "bg-mare/20 text-tinta"
          }`}
        >
          {erro || recado}
        </p>
      )}

      <Bloco titulo="Conteúdo do post">
        <Campo rotulo="Título" valor={dados.titulo} aoMudar={(v) => definir({ titulo: v })} />
        <AreaTexto
          rotulo="Resumo"
          valor={dados.resumo}
          aoMudar={(v) => definir({ resumo: v })}
          linhas={2}
          dica="Aparece no card, no /blog e no preview quando o link é compartilhado."
        />
        <Campo
          rotulo="Categoria"
          valor={dados.categoria}
          aoMudar={(v) => definir({ categoria: v })}
          dica="Usada para filtrar posts em /blog. Ex.: Ansiedade"
        />
        <SeletorImagem
          rotulo="Capa"
          valor={dados.capa}
          aoMudar={(v) => definir({ capa: v })}
          midia={midia}
          aoEnviar={(item) => setMidia((atual) => [item, ...atual])}
          permitirVazio
        />
        <Campo
          rotulo="Descrição da capa"
          valor={dados.capaAlt}
          aoMudar={(v) => definir({ capaAlt: v })}
        />
        <Selecao
          rotulo="Status"
          valor={dados.status}
          opcoes={[
            { valor: "rascunho" as StatusPost, rotulo: "Rascunho" },
            { valor: "publicado" as StatusPost, rotulo: "Publicado" },
          ]}
          aoMudar={(v) => definir({ status: v })}
        />
      </Bloco>

      <Bloco
        titulo="Texto"
        descricao="Negrito, itálico, links, títulos, listas, imagem e vídeo do YouTube/Vimeo."
      >
        <EditorTiptap valor={dados.corpo} aoMudar={(corpo) => definir({ corpo })} />
      </Bloco>

      {postSalvo && postSalvo.status === "publicado" && (
        <Bloco titulo="Compartilhar" descricao="Poste nas suas redes assim que publicar.">
          <BotaoCompartilhar
            url={`${window.location.origin}/blog/${postSalvo.slug}`}
            titulo={postSalvo.titulo}
            mostrarRotulo={false}
          />
        </Bloco>
      )}
    </div>
  );
}

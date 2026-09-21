import { useEffect, useState } from "react";
import { AreaTexto, Bloco, Botao, Campo, ListaEditavel, Selecao } from "./campos";
import SeletorImagem from "./SeletorImagem";
import { api, type Midia } from "../lib/api";
import { conteudoPadrao, mesclarPadrao } from "../conteudoPadrao";
import type { Conteudo, TipoConteudo } from "../tipos";
import type { PostAdmin } from "../tiposBlog";

type Aba =
  | "perfil"
  | "hero"
  | "sobre"
  | "caminhos"
  | "como"
  | "conteudos"
  | "posts"
  | "faq"
  | "fechamento"
  | "imagens"
  | "conta";

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: "perfil", rotulo: "Perfil e contato" },
  { id: "hero", rotulo: "Topo da página" },
  { id: "sobre", rotulo: "Sobre" },
  { id: "caminhos", rotulo: "Caminhos de cuidado" },
  { id: "como", rotulo: "Como funciona" },
  { id: "conteudos", rotulo: "Conteúdos e mídias" },
  { id: "posts", rotulo: "Posts do blog" },
  { id: "faq", rotulo: "Perguntas frequentes" },
  { id: "fechamento", rotulo: "Chamada e rodapé" },
  { id: "imagens", rotulo: "Imagens" },
  { id: "conta", rotulo: "Conta" },
];

const rotuloStatus: Record<PostAdmin["status"], string> = {
  rascunho: "Rascunho",
  publicado: "Publicado",
};

const formatarData = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso),
  );

const emKb = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;

export default function Painel({
  email,
  aoSair,
  aoAbrirPost,
}: {
  email: string;
  aoSair: () => void;
  aoAbrirPost: (id: number | "novo") => void;
}) {
  const [conteudo, setConteudo] = useState<Conteudo>(conteudoPadrao);
  const [midia, setMidia] = useState<Midia[]>([]);
  const [posts, setPosts] = useState<PostAdmin[]>([]);
  const [aba, setAba] = useState<Aba>("perfil");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sujo, setSujo] = useState(false);
  const [recado, setRecado] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([api.lerConteudo(), api.listarMidia(), api.listarPostsAdmin()])
      .then(([respostaConteudo, respostaMidia, respostaPosts]) => {
        // Sem nada salvo ainda, o painel abre com o conteúdo padrão do site,
        // que é exatamente o que está no ar. Assim a primeira edição parte do
        // que a pessoa vê, e não de formulários em branco. A mescla cobre o
        // outro caso: gravação feita antes de um campo existir abriria esse
        // campo como input sem valor, e o salvamento voltaria 400.
        if (respostaConteudo.dados) setConteudo(mesclarPadrao(respostaConteudo.dados));
        setMidia(respostaMidia.itens);
        setPosts(respostaPosts.itens);
      })
      .catch((e) => setErro(e instanceof Error ? e.message : "Não consegui carregar."))
      .finally(() => setCarregando(false));
  }, []);

  async function apagarPost(post: PostAdmin) {
    if (!confirm(`Apagar "${post.titulo}"? Não dá para desfazer.`)) return;

    try {
      await api.apagarPost(post.id);
      setPosts((atual) => atual.filter((p) => p.id !== post.id));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui apagar o post.");
    }
  }

  // Avisa antes de fechar a aba com edição não salva. Vale o incômodo:
  // perder meia hora de texto por um Ctrl+W é pior.
  useEffect(() => {
    if (!sujo) return;
    const aoSairDaPagina = (evento: BeforeUnloadEvent) => {
      evento.preventDefault();
      evento.returnValue = "";
    };
    window.addEventListener("beforeunload", aoSairDaPagina);
    return () => window.removeEventListener("beforeunload", aoSairDaPagina);
  }, [sujo]);

  function definir<K extends keyof Conteudo>(chave: K, parcial: Partial<Conteudo[K]>) {
    setConteudo((atual) => ({ ...atual, [chave]: { ...atual[chave], ...parcial } }));
    setSujo(true);
    setRecado("");
  }

  async function salvar() {
    setSalvando(true);
    setErro("");
    setRecado("");

    try {
      await api.salvarConteudo(conteudo);
      // A lista de mídia carrega o contador de uso, que muda quando uma
      // imagem passa a ser usada ou deixa de ser.
      setMidia((await api.listarMidia()).itens);
      setSujo(false);
      setRecado("Salvo. O site já está mostrando o conteúdo novo.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui salvar.");
    } finally {
      setSalvando(false);
    }
  }

  async function sair() {
    if (sujo && !confirm("Você tem alterações não salvas. Sair mesmo assim?")) return;
    await api.sair().catch(() => {});
    aoSair();
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-areia-funda">
        <p className="text-sm text-tinta/65">Carregando…</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-areia-funda">
      <header className="sticky top-0 z-40 border-b border-tinta/15 bg-areia/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Campelo" width={99} height={30} className="h-7 w-auto" />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-tinta/55">
              Painel
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {sujo && (
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-barro">
                Não salvo
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-tinta underline-offset-4 hover:underline"
            >
              Ver o site
            </a>
            <Botao onClick={sair}>Sair</Botao>
            <Botao variante="primario" onClick={salvar} desabilitado={salvando || !sujo}>
              {salvando ? "Salvando…" : "Salvar"}
            </Botao>
          </div>
        </div>

        {(recado || erro) && (
          <div
            role="status"
            className={`px-5 py-2.5 text-center text-sm font-bold ${
              erro ? "bg-barro/15 text-barro" : "bg-mare/20 text-tinta"
            }`}
          >
            {erro || recado}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label="Seções do painel">
          <ul className="flex list-none flex-wrap gap-1 p-0 lg:sticky lg:top-24 lg:flex-col">
            {ABAS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setAba(item.id)}
                  aria-current={aba === item.id ? "page" : undefined}
                  className={`w-full rounded-lg px-3.5 py-2.5 text-left text-sm font-bold transition-colors ${
                    aba === item.id ? "bg-tinta text-areia" : "text-tinta hover:bg-tinta/5"
                  }`}
                >
                  {item.rotulo}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex flex-col gap-6">
          {aba === "perfil" && (
            <>
              <Bloco
                titulo="Seus dados"
                descricao="Aparecem no topo, no rodapé e na seção Sobre."
              >
                <Campo rotulo="Nome" valor={conteudo.perfil.nome} aoMudar={(v) => definir("perfil", { nome: v })} />
                <Campo rotulo="Profissão" valor={conteudo.perfil.profissao} aoMudar={(v) => definir("perfil", { profissao: v })} />
                <Campo rotulo="CRP" valor={conteudo.perfil.crp} aoMudar={(v) => definir("perfil", { crp: v })} />
                <Campo rotulo="Cidade e estado" valor={conteudo.perfil.cidade} aoMudar={(v) => definir("perfil", { cidade: v })} dica="Ex.: São Luís, MA" />
                <Campo rotulo="Modalidade" valor={conteudo.perfil.modalidade} aoMudar={(v) => definir("perfil", { modalidade: v })} dica="Ex.: Online e presencial" />
                <Campo rotulo="Formação" valor={conteudo.perfil.formacao} aoMudar={(v) => definir("perfil", { formacao: v })} dica="Ex.: Psicologia, com pós em clínica" />
                <Campo rotulo="Abordagem" valor={conteudo.perfil.abordagem} aoMudar={(v) => definir("perfil", { abordagem: v })} dica="Ex.: Psicanálise" />
              </Bloco>

              <Bloco
                titulo="Atendimento"
                descricao="Aparecem na faixa de detalhes, logo abaixo do passo a passo. Os valores que já estão aqui são exemplos: confirme cada um antes de divulgar o site."
              >
                <Campo
                  rotulo="Duração da sessão"
                  valor={conteudo.perfil.duracaoSessao}
                  aoMudar={(v) => definir("perfil", { duracaoSessao: v })}
                  dica="Ex.: 50 minutos"
                />
                <Campo
                  rotulo="Frequência"
                  valor={conteudo.perfil.frequencia}
                  aoMudar={(v) => definir("perfil", { frequencia: v })}
                  dica="Ex.: Semanal"
                />
                <Campo
                  rotulo="Valor"
                  valor={conteudo.perfil.valorSessao}
                  aoMudar={(v) => definir("perfil", { valorSessao: v })}
                  dica="Escreva do jeito que deve aparecer. Ex.: R$ 120 por sessão"
                />
                <Campo
                  rotulo="Onde acontece"
                  valor={conteudo.perfil.onde}
                  aoMudar={(v) => definir("perfil", { onde: v })}
                  dica="Endereço do consultório, plataforma do online, ou os dois."
                />

                <p className="rounded-lg bg-espuma/40 px-4 py-3 text-sm text-tinta/75">
                  Duração, frequência e valor também estão escritos por extenso nas{" "}
                  <strong className="font-bold">Perguntas frequentes</strong>. Se mudar algum aqui,
                  passe lá para acertar o texto também.
                </p>
              </Bloco>

              <Bloco titulo="Contato" descricao="Como as pessoas chegam até você.">
                <Campo
                  rotulo="WhatsApp"
                  valor={conteudo.perfil.whatsapp}
                  aoMudar={(v) => definir("perfil", { whatsapp: v })}
                  dica="Com código do país e DDD, só números. Ex.: 559882126848"
                />
                <AreaTexto
                  rotulo="Mensagem que já vem escrita"
                  valor={conteudo.perfil.mensagemWhatsapp}
                  aoMudar={(v) => definir("perfil", { mensagemWhatsapp: v })}
                  linhas={3}
                  dica="Aparece digitada no WhatsApp quando a pessoa clica no botão."
                />
                <Campo rotulo="Tempo de resposta" valor={conteudo.perfil.tempoResposta} aoMudar={(v) => definir("perfil", { tempoResposta: v })} dica='Só o número. A página escreve "Resposta em até X horas".' />
                <Campo rotulo="Instagram" valor={conteudo.perfil.instagram} aoMudar={(v) => definir("perfil", { instagram: v })} dica="Link completo. Deixe em branco para esconder o ícone." />
                <Campo rotulo="LinkedIn" valor={conteudo.perfil.linkedin} aoMudar={(v) => definir("perfil", { linkedin: v })} dica="Link completo. Deixe em branco para esconder o ícone." />
              </Bloco>
            </>
          )}

          {aba === "hero" && (
            <Bloco titulo="Topo da página" descricao="A primeira coisa que a pessoa vê.">
              <Campo rotulo="Linha de cima" valor={conteudo.hero.eyebrow} aoMudar={(v) => definir("hero", { eyebrow: v })} />
              <AreaTexto rotulo="Título" valor={conteudo.hero.titulo} aoMudar={(v) => definir("hero", { titulo: v })} linhas={2} />
              <AreaTexto rotulo="Texto" valor={conteudo.hero.texto} aoMudar={(v) => definir("hero", { texto: v })} />
              <Campo rotulo="Botão principal" valor={conteudo.hero.ctaPrimario} aoMudar={(v) => definir("hero", { ctaPrimario: v })} />
              <Campo rotulo="Botão secundário" valor={conteudo.hero.ctaSecundario} aoMudar={(v) => definir("hero", { ctaSecundario: v })} />
              <SeletorImagem
                rotulo="Foto"
                valor={conteudo.hero.foto}
                aoMudar={(v) => definir("hero", { foto: v })}
                midia={midia}
                aoEnviar={(item) => setMidia((atual) => [item, ...atual])}
              />
              <Campo
                rotulo="Descrição da foto"
                valor={conteudo.hero.fotoAlt}
                aoMudar={(v) => definir("hero", { fotoAlt: v })}
                dica="Lida por leitores de tela e mostrada se a imagem não carregar."
              />
            </Bloco>
          )}

          {aba === "sobre" && (
            <Bloco titulo="Sobre" descricao="Quem é você e como trabalha.">
              <Campo rotulo="Linha de cima" valor={conteudo.sobre.eyebrow} aoMudar={(v) => definir("sobre", { eyebrow: v })} />
              <AreaTexto rotulo="Título" valor={conteudo.sobre.titulo} aoMudar={(v) => definir("sobre", { titulo: v })} linhas={2} />

              <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-tinta">Parágrafos</span>
                <ListaEditavel
                  itens={conteudo.sobre.paragrafos.map((texto) => ({ texto }))}
                  aoMudar={(itens) => definir("sobre", { paragrafos: itens.map((i) => i.texto) })}
                  criarNovo={() => ({ texto: "" })}
                  rotuloItem={(item) => item.texto.slice(0, 40)}
                  maximo={6}
                >
                  {(item, atualizar) => (
                    <AreaTexto
                      rotulo="Texto"
                      valor={item.texto}
                      aoMudar={(v) => atualizar({ texto: v })}
                      linhas={5}
                    />
                  )}
                </ListaEditavel>
              </div>

              <SeletorImagem
                rotulo="Foto"
                valor={conteudo.sobre.foto}
                aoMudar={(v) => definir("sobre", { foto: v })}
                midia={midia}
                aoEnviar={(item) => setMidia((atual) => [item, ...atual])}
              />
              <Campo rotulo="Descrição da foto" valor={conteudo.sobre.fotoAlt} aoMudar={(v) => definir("sobre", { fotoAlt: v })} />
            </Bloco>
          )}

          {aba === "caminhos" && (
            <Bloco titulo="Caminhos de cuidado" descricao="As áreas em que você atende.">
              <Campo rotulo="Título" valor={conteudo.caminhos.titulo} aoMudar={(v) => definir("caminhos", { titulo: v })} />
              <AreaTexto rotulo="Subtítulo" valor={conteudo.caminhos.subtitulo} aoMudar={(v) => definir("caminhos", { subtitulo: v })} linhas={2} />
              <ListaEditavel
                itens={conteudo.caminhos.itens}
                aoMudar={(itens) => definir("caminhos", { itens })}
                criarNovo={() => ({ titulo: "", texto: "" })}
                rotuloItem={(item) => item.titulo}
                maximo={8}
              >
                {(item, atualizar) => (
                  <>
                    <Campo rotulo="Título" valor={item.titulo} aoMudar={(v) => atualizar({ titulo: v })} />
                    <AreaTexto rotulo="Descrição" valor={item.texto} aoMudar={(v) => atualizar({ texto: v })} linhas={3} />
                  </>
                )}
              </ListaEditavel>
            </Bloco>
          )}

          {aba === "como" && (
            <Bloco titulo="Como funciona" descricao="O passo a passo até a primeira sessão.">
              <Campo rotulo="Título" valor={conteudo.comoFunciona.titulo} aoMudar={(v) => definir("comoFunciona", { titulo: v })} />
              <AreaTexto rotulo="Subtítulo" valor={conteudo.comoFunciona.subtitulo} aoMudar={(v) => definir("comoFunciona", { subtitulo: v })} linhas={2} />
              <ListaEditavel
                itens={conteudo.comoFunciona.passos}
                aoMudar={(passos) => definir("comoFunciona", { passos })}
                criarNovo={() => ({ titulo: "", texto: "" })}
                rotuloItem={(item) => item.titulo}
                maximo={6}
              >
                {(item, atualizar) => (
                  <>
                    <Campo rotulo="Título do passo" valor={item.titulo} aoMudar={(v) => atualizar({ titulo: v })} />
                    <AreaTexto rotulo="Descrição" valor={item.texto} aoMudar={(v) => atualizar({ texto: v })} linhas={3} />
                  </>
                )}
              </ListaEditavel>
            </Bloco>
          )}

          {aba === "conteudos" && (
            <Bloco
              titulo="Conteúdos e mídias"
              descricao="Vídeos, artigos e PDFs. Sem nenhum item, a seção some do site."
            >
              <Campo rotulo="Título" valor={conteudo.conteudos.titulo} aoMudar={(v) => definir("conteudos", { titulo: v })} />
              <AreaTexto rotulo="Subtítulo" valor={conteudo.conteudos.subtitulo} aoMudar={(v) => definir("conteudos", { subtitulo: v })} linhas={2} />
              <ListaEditavel
                itens={conteudo.conteudos.itens}
                aoMudar={(itens) => definir("conteudos", { itens })}
                criarNovo={() => ({
                  tipo: "artigo" as TipoConteudo,
                  categoria: "Artigo",
                  titulo: "",
                  texto: "",
                  acao: "Ler",
                  href: "https://",
                  capa: "",
                })}
                rotuloItem={(item) => item.titulo}
                minimo={0}
                maximo={12}
              >
                {(item, atualizar) => (
                  <>
                    <Selecao
                      rotulo="Tipo"
                      valor={item.tipo}
                      opcoes={[
                        { valor: "video" as TipoConteudo, rotulo: "Vídeo" },
                        { valor: "artigo" as TipoConteudo, rotulo: "Artigo" },
                        { valor: "pdf" as TipoConteudo, rotulo: "PDF" },
                      ]}
                      aoMudar={(v) => atualizar({ tipo: v })}
                    />
                    <Campo rotulo="Etiqueta" valor={item.categoria} aoMudar={(v) => atualizar({ categoria: v })} dica="Aparece em letra pequena acima do título. Ex.: YouTube" />
                    <Campo rotulo="Título" valor={item.titulo} aoMudar={(v) => atualizar({ titulo: v })} />
                    <AreaTexto rotulo="Descrição" valor={item.texto} aoMudar={(v) => atualizar({ texto: v })} linhas={3} />
                    <Campo rotulo="Texto do link" valor={item.acao} aoMudar={(v) => atualizar({ acao: v })} dica="Ex.: Assistir, Ler artigo, Abrir PDF" />
                    <Campo rotulo="Endereço" valor={item.href} aoMudar={(v) => atualizar({ href: v })} dica="Começa com https:// ou /" />
                    <SeletorImagem
                      rotulo="Capa"
                      valor={item.capa}
                      aoMudar={(v) => atualizar({ capa: v })}
                      midia={midia}
                      aoEnviar={(nova) => setMidia((atual) => [nova, ...atual])}
                      permitirVazio
                    />
                  </>
                )}
              </ListaEditavel>
            </Bloco>
          )}

          {aba === "posts" && (
            <Bloco
              titulo="Posts do blog"
              descricao="Escreva, publique e compartilhe. Cada post é salvo por conta própria, fora do botão Salvar geral."
            >
              <div>
                <Botao variante="primario" onClick={() => aoAbrirPost("novo")}>
                  Novo post
                </Botao>
              </div>

              {posts.length === 0 ? (
                <p className="text-sm text-tinta/65">Nenhum post ainda.</p>
              ) : (
                <ul className="flex list-none flex-col gap-3 p-0">
                  {posts.map((post) => (
                    <li
                      key={post.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-cartao border border-tinta/15 bg-white p-4"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-tinta">{post.titulo || "sem título"}</span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-tinta/55">
                          <span className={post.status === "publicado" ? "text-mare" : "text-barro"}>
                            {rotuloStatus[post.status]}
                          </span>
                          {" · "}
                          {post.categoria || "sem categoria"}
                          {" · "}
                          Atualizado em {formatarData(post.atualizadoEm)}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Botao onClick={() => aoAbrirPost(post.id)}>Editar</Botao>
                        <Botao variante="perigo" onClick={() => apagarPost(post)}>
                          Apagar
                        </Botao>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Bloco>
          )}

          {aba === "faq" && (
            <Bloco
              titulo="Perguntas frequentes"
              descricao="Sem nenhuma pergunta, a seção some do site."
            >
              <Campo rotulo="Título" valor={conteudo.faq.titulo} aoMudar={(v) => definir("faq", { titulo: v })} />
              <ListaEditavel
                itens={conteudo.faq.itens}
                aoMudar={(itens) => definir("faq", { itens })}
                criarNovo={() => ({ pergunta: "", resposta: "" })}
                rotuloItem={(item) => item.pergunta}
                minimo={0}
                maximo={20}
              >
                {(item, atualizar) => (
                  <>
                    <Campo rotulo="Pergunta" valor={item.pergunta} aoMudar={(v) => atualizar({ pergunta: v })} />
                    <AreaTexto rotulo="Resposta" valor={item.resposta} aoMudar={(v) => atualizar({ resposta: v })} linhas={4} />
                  </>
                )}
              </ListaEditavel>
            </Bloco>
          )}

          {aba === "fechamento" && (
            <>
              <Bloco titulo="Chamada final" descricao="O bloco azul no fim da página.">
                <AreaTexto rotulo="Título" valor={conteudo.chamada.titulo} aoMudar={(v) => definir("chamada", { titulo: v })} linhas={2} />
                <AreaTexto rotulo="Texto" valor={conteudo.chamada.texto} aoMudar={(v) => definir("chamada", { texto: v })} linhas={3} />
                <Campo rotulo="Botão" valor={conteudo.chamada.cta} aoMudar={(v) => definir("chamada", { cta: v })} />
              </Bloco>

              <Bloco titulo="Rodapé">
                <AreaTexto rotulo="Frase" valor={conteudo.rodape.frase} aoMudar={(v) => definir("rodape", { frase: v })} linhas={2} />
              </Bloco>
            </>
          )}

          {aba === "imagens" && (
            <Bloco
              titulo="Imagens enviadas"
              descricao="Tudo que você já subiu. Para trocar a foto de uma seção, use a aba da seção."
            >
              {midia.length === 0 ? (
                <p className="text-sm text-tinta/65">
                  Nenhuma imagem enviada ainda. Você envia pela aba da seção onde a foto vai
                  aparecer.
                </p>
              ) : (
                <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {midia.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-3 rounded-cartao border border-tinta/15 bg-white p-3"
                    >
                      <img
                        src={item.url}
                        alt={item.nomeOriginal}
                        className="aspect-[4/3] w-full rounded-lg object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="truncate text-sm font-bold" title={item.nomeOriginal}>
                          {item.nomeOriginal}
                        </span>
                        <span className="font-mono text-[11px] text-tinta/55">
                          {item.largura}×{item.altura} · {emKb(item.bytes)}
                        </span>
                        <span
                          className={`font-mono text-[11px] ${item.emUso > 0 ? "text-mare" : "text-tinta/45"}`}
                        >
                          {item.emUso > 0 ? `em uso (${item.emUso})` : "não usada"}
                        </span>
                      </div>
                      <Botao
                        variante="perigo"
                        desabilitado={item.emUso > 0}
                        onClick={async () => {
                          if (!confirm(`Apagar "${item.nomeOriginal}"? Não dá para desfazer.`)) return;
                          try {
                            await api.apagarMidia(item.id);
                            setMidia((atual) => atual.filter((m) => m.id !== item.id));
                          } catch (e) {
                            setErro(e instanceof Error ? e.message : "Não consegui apagar.");
                          }
                        }}
                      >
                        {item.emUso > 0 ? "Em uso" : "Apagar"}
                      </Botao>
                    </li>
                  ))}
                </ul>
              )}
            </Bloco>
          )}

          {aba === "conta" && <Conta email={email} aoSair={aoSair} />}
        </main>
      </div>
    </div>
  );
}

function Conta({ email, aoSair }: { email: string; aoSair: () => void }) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function trocar() {
    if (nova !== confirma) {
      setErro("A confirmação não bate com a senha nova.");
      return;
    }

    setEnviando(true);
    setErro("");

    try {
      await api.trocarSenha(atual, nova);
      // O servidor derruba a sessão ao trocar a senha, então o painel volta
      // para a tela de login já com a senha nova valendo.
      alert("Senha alterada. Entre de novo com a senha nova.");
      aoSair();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui trocar a senha.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Bloco titulo="Conta" descricao={`Você está logado como ${email}.`}>
      <Campo rotulo="Senha atual" tipo="password" valor={atual} aoMudar={setAtual} />
      <Campo
        rotulo="Senha nova"
        tipo="password"
        valor={nova}
        aoMudar={setNova}
        dica="Pelo menos 10 caracteres."
      />
      <Campo rotulo="Repita a senha nova" tipo="password" valor={confirma} aoMudar={setConfirma} />

      {erro && (
        <p role="alert" className="rounded-lg bg-barro/10 px-4 py-3 text-sm font-bold text-barro">
          {erro}
        </p>
      )}

      <div>
        <Botao
          variante="primario"
          onClick={trocar}
          desabilitado={enviando || !atual || nova.length < 10 || !confirma}
        >
          {enviando ? "Trocando…" : "Trocar senha"}
        </Botao>
      </div>
    </Bloco>
  );
}

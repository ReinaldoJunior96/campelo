import { useEffect } from "react";
import ContentSection from "./components/ContentSection";
import { initLandingInteractions } from "./lib/landing";

export default function App() {
  useEffect(() => initLandingInteractions(), []);

  return (
    <>
      {/* Navegação */}
      <nav
        className="site-nav fixed top-0 left-0 right-0 w-full z-[90] px-6 py-4 flex justify-between items-center  bg-white/40 backdrop-blur-md"
        style={{ position: "fixed", top: 0, left: 0, right: 0 }}
      >
        <div className="flex items-center">
          <img src="assets/logo.png" alt="Logo Campelo" className="h-10 md:h-14 object-contain" />
        </div>

        <div className="hidden md:flex space-x-8 font-medium text-sm uppercase tracking-widest">
          <a href="#sobre" className="hover:text-[#6386AC] transition">
            Sobre
          </a>
          <a href="#atuacao" className="hover:text-[#6386AC] transition">
            Atuação
          </a>
          <a href="#biblioteca" className="hover:text-[#6386AC] transition">
            Biblioteca
          </a>
          <a href="#conteudo" className="hover:text-[#6386AC] transition">
            Voz Preta
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/559882126848"
            className="hidden md:inline-flex bg-[#112E4B] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#6386AC] transition duration-300 shadow-lg"
          >
            Falar no WhatsApp
          </a>

          <button
            id="mobile-menu-btn"
            className="md:hidden w-11 h-11 rounded-full border border-white/50 bg-white/60 text-[#112E4B] shadow-md flex items-center justify-center hover:bg-white transition"
            aria-controls="mobile-menu"
            aria-expanded="false"
            aria-label="Abrir menu"
          >
            <i data-lucide="menu" className="w-5 h-5"></i>
          </button>
        </div>
      </nav>

      {/* Menu Mobile (Side Menu) */}
      <div
        id="mobile-menu-overlay"
        className="md:hidden hidden fixed inset-0 z-[70] bg-black/50 backdrop-blur-[1px]"
      ></div>

      <aside
        id="mobile-menu"
        className="md:hidden fixed inset-y-0 left-0 z-[80] w-72 max-w-[80vw] -translate-x-full transition-transform duration-300 ease-out"
      >
        <div className="h-full bg-white/90 backdrop-blur-xl shadow-2xl border-r border-white/70 px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <img src="assets/logo.png" alt="Logo Campelo" className="h-10 object-contain" />
            <button
              id="mobile-menu-close"
              className="w-10 h-10 rounded-full border border-white/50 bg-white/70 text-[#112E4B] flex items-center justify-center hover:bg-white transition"
              aria-label="Fechar menu"
            >
              <i data-lucide="x" className="w-5 h-5"></i>
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-sm uppercase tracking-widest font-medium">
            <a href="#sobre" className="hover:text-[#6386AC] transition">
              Sobre
            </a>
            <a href="#atuacao" className="hover:text-[#6386AC] transition">
              Atuação
            </a>
            <a href="#biblioteca" className="hover:text-[#6386AC] transition">
              Biblioteca
            </a>
            <a href="#conteudo" className="hover:text-[#6386AC] transition">
              Voz Preta
            </a>
          </nav>

          <a
            href="https://wa.me/559882126848"
            className="mt-8 inline-flex w-full items-center justify-center bg-[#112E4B] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#6386AC] transition duration-300 shadow-lg"
          >
            Falar no WhatsApp
          </a>
        </div>
      </aside>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <img
          src="assets/tartaruga.png"
          className="float-element absolute top-40 right-10 w-32 opacity-20 hidden lg:block"
          alt=""
        />
        <img
          src="assets/concha1.png"
          className="float-element absolute bottom-20 left-10 w-24 opacity-20 hidden lg:block"
          style={{ animationDelay: "-2s" }}
          alt=""
        />

        <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12 z-10">
          <div className="reveal active">
            <div className="flex items-center gap-2 mb-6">
              <img src="assets/alga.png" className="w-6 h-6 opacity-60" alt="" />
              <span className="text-[#112E4B] text-xs font-bold tracking-widest uppercase italic">
                Existir, Sentir e Pertencer
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl mb-6 leading-tight">
            Cuidar de si é um ato de amor,
              <span className="italic text-[#6386AC]"> resistência e coragem.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#112E4B]/80 mb-10 max-w-lg leading-relaxed">
             Psicologia acolhedora, humana e democrática para ouvir a todos em sua totalidade. Um espaço para cuidar de seu bem-estar e das subjetividades.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/559882126848"
                className="bg-[#112E4B] text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition transform shadow-xl"
              >
                Inicie sua jornada
              </a>
            </div>
          </div>

          <div className="relative reveal active delay-300">
            <div className="organic-shape bg-[#BBD8EC]/40 w-full aspect-square max-w-md mx-auto overflow-hidden relative border-8 border-white shadow-2xl">
              <img src="assets/perfil.jpeg" alt="Pessoa Negra em momento de calma" className="w-full h-full object-cover" />
            </div>
            <img
              src="assets/bolacha.png"
              className="absolute -bottom-10 -right-10 w-32 opacity-40 float-element"
              style={{ animationDuration: "8s" }}
              alt=""
            />
          </div>
          <strong></strong>
        </div>

        <div className="wave"></div>
      </section>

      {/* Sobre Campelo */}
      <section id="sobre" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="reveal">
              <img
                src="assets/perfil2.jpeg"
                alt="Campelo"
                className="rounded-[40px] shadow-2xl grayscale hover:grayscale-0 transition duration-700"
              />
            </div>

            <div className="reveal delay-200">
              <img src="assets/alga.png" className="w-12 mb-6 opacity-40" alt="" />
              <h2 className="text-4xl mb-6">
                Sua voz merece um <span className="serif italic text-[#6386AC]">lugar seguro</span>.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
               Sou o Campelo, psicólogo que acredita na psicoterapia como espaço de dignidade e de reparação. Meu compromisso é oferecer uma escuta qualificada que reconhece as múltiplas vivências, que respeita a ancestralidade e valida cada sentimento.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
               Aqui, as questões de classe, gênero e raça não são meros detalhe, é um dos alicerce do meu trabalho. Juntos, caminharemos para reencontrar  seu o bem-estar consigo mesmo e no mundo.  
              </p>
              <div className="flex items-center gap-4 border-l-4 border-[#6386AC] pl-6 italic text-[#112E4B]/70">
                "Saúde mental é também respeitar as vivências de cada um"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section id="atuacao" className="py-24 bg-white/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl mb-4">
              Caminhos de <span className="serif italic">Cuidado</span>
            </h2>
            <p className="text-[#112E4B]/60">Especialidades voltadas para o bem-estar integral e identitário.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-8 rounded-[30px] hover:shadow-2xl transition-all duration-500 reveal">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-[#112E4B] rounded-xl">
                <i data-lucide="shield-check" className="text-white w-6"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Impactos do Racismo</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Acolhimento para feridas emocionais ligadas à vivência racial e social.
              </p>
            </div>

            <div className="glass-card p-8 rounded-[30px] hover:shadow-2xl transition-all duration-500 reveal delay-100">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-[#6386AC] rounded-xl">
                <i data-lucide="user" className="text-white w-6"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Autoestima e Identidade</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Fortalecimento do eu e celebração da própria história e imagem.
              </p>
            </div>

            <div className="glass-card p-8 rounded-[30px] hover:shadow-2xl transition-all duration-500 reveal delay-200">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-[#BBD8EC] rounded-xl">
                <i data-lucide="wind" className="text-[#112E4B] w-6"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Ansiedade</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Estratégias para encontrar calma e presença em meio às pressões do cotidiano.
              </p>
            </div>

            <div className="glass-card p-8 rounded-[30px] hover:shadow-2xl transition-all duration-500 reveal delay-300">
              <div className="w-12 h-12 mb-6 flex items-center justify-center bg-[#FDF6E5] border border-[#112E4B]/10 rounded-xl">
                <i data-lucide="heart" className="text-[#112E4B] w-6"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Vínculos Saudáveis</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Desenvolver relações baseadas no respeito, limites e afeto real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Biblioteca Emocional */}
      <section id="biblioteca" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <img src="assets/bolacha.png" className="w-12 mx-auto mb-4 opacity-30" alt="" />
            <h2 className="text-4xl mb-4">
              Reflexão & <span className="serif italic">Pertencimento</span>
            </h2>
            <p className="text-gray-500">Vozes pretas e saberes que curam.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="text-item reveal group cursor-pointer">
              <div className="aspect-[4/5] glass-card rounded-[40px] p-10 flex flex-col justify-between group-hover:bg-[#112E4B] group-hover:text-white transition-all duration-500 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Cultura & Mente</span>
                  <h4 className="text-2xl mt-4 leading-snug">O direito ao descanso como ato político.</h4>
                </div>
                <p className="text-sm opacity-70 italic">Ler reflexão →</p>
              </div>
            </article>

            <article className="text-item reveal delay-100 group cursor-pointer">
              <div className="aspect-[4/5] glass-card rounded-[40px] p-10 flex flex-col justify-between group-hover:bg-[#112E4B] group-hover:text-white transition-all duration-500 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Ancestralidade</span>
                  <h4 className="text-2xl mt-4 leading-snug">Curar o presente honrando o passado.</h4>
                </div>
                <p className="text-sm opacity-70 italic">Ler reflexão →</p>
              </div>
            </article>

            <article className="text-item reveal delay-200 group cursor-pointer">
              <div className="aspect-[4/5] glass-card rounded-[40px] p-10 flex flex-col justify-between group-hover:bg-[#112E4B] group-hover:text-white transition-all duration-500 shadow-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Psicologia Negra</span>
                  <h4 className="text-2xl mt-4 leading-snug">Sua história importa e seu sentir é legítimo.</h4>
                </div>
                <p className="text-sm opacity-70 italic">Ler reflexão →</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Podcast / Voz Preta */}
      <section id="conteudo" className="py-24 bg-[#112E4B] text-white rounded-[60px] mx-6 my-12 overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
                Vozes que ecoam <br />
                <span className="serif italic text-[#BBD8EC]">existência.</span>
              </h2>
              <p className="text-lg text-white/70 mb-10 leading-relaxed">
                No meu canal e podcast, conversamos sobre saúde mental, cotidiano e cultura negra. Um espaço para
                celebrarmos quem somos.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#6386AC] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:text-[#112E4B] transition">
                  <i data-lucide="youtube"></i> Assistir Conversas
                </button>
                <button className="border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
                  Ouvir Podcast
                </button>
              </div>
            </div>

            <div className="reveal delay-200 relative">
              <div className="bg-white/5 p-10 rounded-[40px] backdrop-blur-xl border border-white/10">
                <h4 className="text-xl font-bold mb-2">Episódio em destaque</h4>
                <p className="text-[#BBD8EC] mb-6 italic">"A estética do cuidado na população negra"</p>
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 bg-white text-[#112E4B] rounded-full flex items-center justify-center hover:scale-110 transition">
                    <i data-lucide="play" fill="currentColor"></i>
                  </button>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-[#BBD8EC]"></div>
                  </div>
                </div>
              </div>
              <img src="assets/tartaruga.png" className="absolute -top-10 -right-10 w-24 opacity-20" alt="" />
            </div>
          </div>
        </div>
      </section>

      <ContentSection />

      {/* Rodapé */}
      <footer className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="mb-12 reveal">
            <img src="assets/logo.png" alt="Logo Campelo" className="h-16 mx-auto mb-8" />
            <h2 className="text-3xl italic serif mb-4 max-w-lg mx-auto">
              "Cuidar de si também é um ato de dignidade."
            </h2>
            <p className="text-gray-400 text-sm">Campelo • CRP 00/00000</p>
          </div>

          <div className="flex justify-center gap-8 mb-16">
            <a href="#" className="text-[#112E4B] hover:text-[#6386AC] transition">
              <i data-lucide="instagram"></i>
            </a>
            <a href="#" className="text-[#112E4B] hover:text-[#6386AC] transition">
              <i data-lucide="linkedin"></i>
            </a>
          </div>

          <div className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">
            &copy; 2024 Campelo Psicologia • Representatividade e Cuidado.
          </div>
        </div>
      </footer>

      {/* WhatsApp Fixo */}
      <a
        href="https://wa.me/559882126848"
        className="fixed bottom-24 md:bottom-8 right-8 z-[60] bg-[#112E4B] text-white p-4 rounded-full shadow-2xl group flex items-center gap-3 hover:bg-[#6386AC] transition-all duration-500"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap px-0 group-hover:px-2 font-medium text-sm">
          Se quiser conversar, estou aqui.
        </span>
        <i data-lucide="message-square"></i>
      </a>
    </>
  );
}

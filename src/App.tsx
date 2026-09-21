import { useEffect } from "react";
import BlogTeaser from "./components/BlogTeaser";
import BotaoWhatsapp from "./components/BotaoWhatsapp";
import Caminhos from "./components/Caminhos";
import Chamada from "./components/Chamada";
import ComoFunciona from "./components/ComoFunciona";
import Conteudos from "./components/Conteudos";
import FaixaAtuacao from "./components/FaixaAtuacao";
import Faq from "./components/Faq";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Rodape from "./components/Rodape";
import Sobre from "./components/Sobre";
import { ProvedorConteudo } from "./lib/conteudo";

export default function App() {
  // A classe só entra quando o React monta. Assim o estado inicial escondido
  // das animações nunca existe para quem está sem JS: a página aparece inteira.
  useEffect(() => {
    document.documentElement.classList.add("js-revelar");
    return () => document.documentElement.classList.remove("js-revelar");
  }, []);

  return (
    <ProvedorConteudo>
      <Nav />

      <main id="conteudo-principal">
        <Hero />
        <FaixaAtuacao />
        <Sobre />
        <Caminhos />
        <ComoFunciona />
        <Conteudos />
        <BlogTeaser />
        <Faq />
        <Chamada />
      </main>

      <Rodape />
      <BotaoWhatsapp />
    </ProvedorConteudo>
  );
}

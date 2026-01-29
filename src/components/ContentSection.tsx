export default function ContentSection() {
  return (
    <section id="conteudos" className="py-24 bg-white/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-4xl mb-4">
            Conteúdos & <span className="serif italic">Mídias</span>
          </h2>
          <p className="text-[#112E4B]/60">
            Materiais para assistir, refletir e aprofundar o cuidado.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article className="glass-card p-8 rounded-[30px] shadow-sm reveal">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">YouTube</span>
            <h3 className="text-xl font-bold mt-3">Conversas em vídeo</h3>
            <p className="text-gray-600 leading-relaxed text-sm mt-3">
              Um episódio para refletir sobre cuidado, subjetividade e presença.
            </p>
            <div className="mt-6 relative w-full pt-[56.25%] overflow-hidden rounded-[24px] border border-white/80 bg-white/60">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/n4om7-0HlFM"
                title="YouTube video player"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <a
              href="https://m.youtube.com/watch?v=n4om7-0HlFM&pp=ygUjRW5jcnV6aWxoYWRhcyBtYXRoZXVzIGRpbml6IGNhbXBlbG8%3D"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center justify-center w-full bg-[#112E4B] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#6386AC] transition"
            >
              Assistir
            </a>
          </article>

          <article className="glass-card p-8 rounded-[30px] shadow-sm reveal delay-100">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Leitura</span>
            <h3 className="text-xl font-bold mt-3">Artigo recomendado</h3>
            <p className="text-gray-600 leading-relaxed text-sm mt-3">
              Reflexões sobre saúde mental, raça e representatividade.
            </p>
            <div className="mt-6 relative w-full pt-[56.25%] overflow-hidden rounded-[24px] border border-white/80 bg-white/60">
              <img
                src="assets/concha2.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="bg-white/80 backdrop-blur-md px-3 py-2 rounded-full text-xs font-semibold text-[#112E4B]">
                  Artigo externo
                </span>
              </div>
            </div>
            <a
              href="https://periodicos.newsciencepubl.com/arace/article/view/5292"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center justify-center w-full bg-[#112E4B] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#6386AC] transition"
            >
              Ler artigo
            </a>
          </article>

          <article className="glass-card p-8 rounded-[30px] shadow-sm reveal delay-200">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">PDF</span>
            <h3 className="text-xl font-bold mt-3">Leitura em PDF</h3>
            <p className="text-gray-600 leading-relaxed text-sm mt-3">
              Material para download e estudo no seu tempo.
            </p>
            <div className="mt-6 relative w-full pt-[56.25%] overflow-hidden rounded-[24px] border border-white/80 bg-white/60">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#112E4B] text-white flex items-center justify-center shadow-lg">
                  <i data-lucide="file-text" className="w-6 h-6"></i>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="bg-white/80 backdrop-blur-md px-3 py-2 rounded-full text-xs font-semibold text-[#112E4B]">
                  PDF local
                </span>
              </div>
            </div>
            <a
              href="assets/Trabalho-Completo-Encontro-de-Genero.pdf"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center justify-center w-full border border-[#112E4B]/20 text-[#112E4B] px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/60 transition"
            >
              Ver PDF
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

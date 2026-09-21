import CartaoPost from "../blog/CartaoPost";
import Revelar from "./Revelar";
import { usePosts } from "../lib/posts";

export default function BlogTeaser() {
  const { posts } = usePosts();

  if (!posts || posts.length === 0) return null;

  const destaques = posts.slice(0, 3);

  return (
    <section id="blog" className="bg-areia-funda">
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-16 md:py-24">
        <Revelar className="flex flex-col items-center gap-4 text-center">
          <span className="font-mono text-eyebrow uppercase text-mare">Blog</span>
          <h2 className="text-[2rem] md:text-[2.625rem]">Ideias, registradas para durar</h2>
          <p className="max-w-[35rem] text-[17px] text-tinta/70">
            Reflexões sobre saúde mental, identidade e cuidado, escritas por mim.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {destaques.map((post, indice) => (
            <CartaoPost key={post.id} post={post} atraso={indice * 90} />
          ))}
        </div>

        <Revelar className="mt-12 flex justify-center">
          <a
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-tinta/30 px-7 py-3.5 text-[15px] font-bold text-tinta transition-colors hover:border-tinta/60 hover:bg-tinta/5"
          >
            Ver todos os posts
            <span aria-hidden="true" className="transition-transform duration-300 ease-mare group-hover:translate-x-1">
              →
            </span>
          </a>
        </Revelar>
      </div>
    </section>
  );
}

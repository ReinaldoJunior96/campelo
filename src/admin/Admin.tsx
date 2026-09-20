import { useEffect, useState } from "react";
import Login from "./Login";
import Painel from "./Painel";
import { api } from "../lib/api";

/**
 * Porteiro do painel.
 *
 * A sessão é confirmada perguntando ao servidor, não olhando um flag salvo
 * no navegador. O cookie é httpOnly, então o JavaScript não consegue lê-lo
 * de qualquer forma, e esconder tela no cliente nunca foi proteção: quem
 * protege é o `exigirSessao` em cada rota da API.
 */
export default function Admin() {
  const [email, setEmail] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    // O painel não tem o que fazer nos resultados de busca.
    const marcador = document.createElement("meta");
    marcador.name = "robots";
    marcador.content = "noindex, nofollow";
    document.head.appendChild(marcador);

    const tituloAnterior = document.title;
    document.title = "Painel | Campelo";

    api
      .sessao()
      .then((sessao) => setEmail(sessao.email))
      .catch(() => setEmail(null))
      .finally(() => setVerificando(false));

    return () => {
      marcador.remove();
      document.title = tituloAnterior;
    };
  }, []);

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-areia-funda">
        <p className="text-sm text-tinta/65">Verificando sessão…</p>
      </main>
    );
  }

  if (!email) return <Login aoEntrar={setEmail} />;

  return <Painel email={email} aoSair={() => setEmail(null)} />;
}

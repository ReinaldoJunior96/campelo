import { useState } from "react";
import { Botao, Campo } from "./campos";
import { api } from "../lib/api";

export default function Login({ aoEntrar }: { aoEntrar: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function submeter(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setErro("");

    try {
      const sessao = await api.entrar(email, senha);
      aoEntrar(sessao.email);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não consegui entrar.");
      setSenha("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-areia-funda px-5 py-16">
      <div className="w-full max-w-sm">
        <img
          src="/assets/logo.png"
          alt="Campelo"
          width={132}
          height={40}
          className="mx-auto mb-10 h-9 w-auto"
        />

        <form
          onSubmit={submeter}
          className="flex flex-col gap-5 rounded-bloco border border-tinta/15 bg-areia p-7"
        >
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-bold tracking-tight">Painel</h1>
            <p className="text-sm text-tinta/65">Entre para editar o conteúdo do site.</p>
          </div>

          <Campo
            rotulo="E-mail"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            placeholder="voce@exemplo.com"
          />
          <Campo rotulo="Senha" tipo="password" valor={senha} aoMudar={setSenha} />

          {erro && (
            <p role="alert" className="rounded-lg bg-barro/10 px-4 py-3 text-sm font-bold text-barro">
              {erro}
            </p>
          )}

          <Botao tipo="submit" variante="primario" desabilitado={enviando || !email || !senha}>
            {enviando ? "Entrando…" : "Entrar"}
          </Botao>
        </form>

        <p className="mt-6 text-center text-xs text-tinta/55">
          Esqueceu a senha? Ela só pode ser redefinida no servidor, pelo comando
          <code className="mx-1 rounded bg-tinta/10 px-1.5 py-0.5 font-mono">npm run senha</code>.
        </p>
      </div>
    </main>
  );
}

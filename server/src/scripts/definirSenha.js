/**
 * Cria a conta do painel ou troca a senha pela linha de comando.
 *
 *   npm run senha -- campelo@exemplo.com "uma senha longa aqui"
 *
 * É a saída quando ninguém lembra a senha: não existe "esqueci minha senha"
 * por e-mail neste sistema, porque para um único usuário isso significaria
 * manter servidor de e-mail, token de recuperação e mais uma superfície de
 * ataque, tudo para um caso que se resolve com acesso ao servidor.
 */
import { agora, consultas, db } from "../db.js";
import { gerarHash } from "../auth.js";

const [email, senha] = process.argv.slice(2);

if (!email || !senha) {
  console.error('Uso: npm run senha -- <email> "<senha>"');
  process.exit(1);
}

if (senha.length < 10) {
  console.error("A senha precisa ter pelo menos 10 caracteres.");
  process.exit(1);
}

const hash = await gerarHash(senha);
const existente = consultas.usuarioPorEmail(email);

if (existente) {
  consultas.atualizarSenha(existente.id, hash);
  console.log(`Senha atualizada para ${email}.`);
} else {
  const momento = agora();
  db.prepare(
    "INSERT INTO usuario (email, senha_hash, criado_em, atualizado_em) VALUES (?, ?, ?, ?)",
  ).run(email, hash, momento, momento);
  console.log(`Conta criada para ${email}.`);
}

process.exit(0);

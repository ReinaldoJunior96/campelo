# Campelo Psicologia

Landing page do Campelo, psicólogo (CRP 22/07472), com painel para ele editar
o conteúdo sozinho.

- **Site**: React + Vite + Tailwind, servido por nginx.
- **API**: Node + Express + SQLite, para conteúdo, sessão e upload de imagem.
- **Borda**: Caddy, que resolve HTTPS sozinho.
- **Painel**: `/admin`.

Tudo roda em Docker. Você não precisa de Node instalado para nada, nem para
buildar, nem para testar.

```
make            # lista os comandos
```

## Rodar local

```bash
cp .env.example .env     # preencha JWT_SECRET e ADMIN_SENHA
make dev                 # site em :5173, com recarga automática
make prod                # testa o build de produção em :8080, sem TLS
make verificar           # typecheck + build do site + build da imagem da API
```

`make verificar` roda tudo dentro de containers descartáveis. É o que confere
se o projeto ainda compila antes de você subir para a VPS.

## Subir na VPS

**Antes de rodar qualquer coisa**: aponte o domínio para o IP da máquina e
libere as portas 80 e 443. O Caddy valida o domínio no primeiro boot, e se o
DNS ainda não tiver propagado a emissão falha.

```bash
git clone <repo> campelo && cd campelo
cp .env.example .env && nano .env
make deploy
make logs
```

O `.env` precisa de:

| Variável | O que é |
|---|---|
| `JWT_SECRET` | `openssl rand -hex 32`. Quem tiver isso entra no painel sem senha |
| `ADMIN_EMAIL` | E-mail do Campelo. **Precisa ter domínio completo** |
| `ADMIN_SENHA` | Mínimo 10 caracteres. Só usada na primeira subida |
| `DOMINIO` | O domínio do site, sem `https://` |
| `EMAIL_TLS` | Para os avisos de expiração do certificado |

O `make deploy` é o mesmo comando para subir a primeira vez e para atualizar
depois. Para atualizar: `git pull && make deploy`.

### Testar pelo IP, antes de ter domínio

```env
DOMINIO=:80
COOKIE_SEGURO=false
```

O `COOKIE_SEGURO=false` é obrigatório nesse caso. A flag `secure` faz o
cookie de sessão só viajar por HTTPS: ligada em um site HTTP puro, o
navegador **descarta o cookie em silêncio** e o login volta para o formulário
sem mensagem de erro nenhuma. Ao apontar o domínio, volte para `true`.

## O painel

Fica em `/admin`. O Campelo edita por lá:

| Aba | O que muda |
|---|---|
| Perfil e contato | Nome, CRP, cidade, modalidade, formação, abordagem, WhatsApp, redes |
| Topo da página | Título, texto, botões, foto |
| Sobre | Título e parágrafos (adiciona e remove), foto |
| Caminhos de cuidado | As áreas de atuação, com reordenação |
| Como funciona | Os passos até a primeira sessão |
| Conteúdos e mídias | Vídeos, artigos e PDFs. Zero itens esconde a seção |
| Perguntas frequentes | As perguntas. Zero itens esconde a seção |
| Chamada e rodapé | Bloco final e frase do rodapé |
| Imagens | Tudo que já foi enviado, com aviso de qual está em uso |
| Conta | Trocar a senha |

Cada gravação vira uma **linha nova** na tabela `conteudo`, nunca um update.
O histórico fica no banco: `make historico`.

Perdeu a senha? Não existe recuperação por e-mail (seria um servidor de
e-mail e mais uma superfície de ataque para um único usuário):

```bash
make senha EMAIL=campelo@gmail.com SENHA='a senha nova'
```

## Backup

O volume `campelo-dados` é o **único** estado do sistema: banco e uploads. Se
você fizer backup de uma coisa só neste projeto, faça dele.

```bash
make backup                                    # gera ./backups/campelo-<data>.tar.gz
make restaurar ARQUIVO=backups/campelo-....tar.gz
```

Vale colocar no cron da VPS:

```cron
0 3 * * * cd /caminho/para/campelo && make backup
```

## Como o conteúdo chega na tela

```
src/conteudoPadrao.ts     padrão, dentro do bundle
        |
        v
  site renderiza na hora com esse padrão
        |
        +---> GET /api/conteudo
                  |
                  +-- tem gravação?  troca pelo conteúdo do banco
                  +-- banco vazio ou API fora?  fica no padrão
```

Duas consequências, ambas de propósito:

1. **O site não cai se a API cair.** Volta ao conteúdo padrão em vez de
   mostrar página em branco.
2. **Um campo editado pisca no valor antigo** por um instante antes de
   trocar. Para uma página desse tamanho o troco compensa: renderizar na hora
   é melhor que esperar a rede com a tela vazia. Se incomodar, o caminho é
   pré-renderizar o HTML no build.

`src/tipos.ts` é o contrato. Mexeu lá, mexa também em `src/conteudoPadrao.ts`
e em `server/src/esquema.js`, que é quem de fato valida o que entra no banco.

## Campos pendentes

Textos no formato `[ASSIM]` aparecem sublinhados em barro na página e com
aviso no painel. É de propósito: placeholder que se parece com texto final
vai para produção sem ninguém notar.

Faltam hoje: cidade, modalidade, formação, abordagem, duração e frequência da
sessão, valor, tempo de resposta, Instagram e LinkedIn. Todos editáveis pelo
painel, sem deploy.

Fora do painel, um `TODO` no `index.html` e outro no `robots.txt`: o domínio
real (aparece em seis lugares, entre canonical, Open Graph e JSON-LD) e uma
imagem de compartilhamento 1200x630 em `public/og.jpg`.

## Design

Direção "Maré". O sistema sai da própria marca: o lettering líquido do logo e
as ilustrações de traço já existiam e definem o tom.

| Papel | Valor |
|---|---|
| Tinta | `#112E4B` |
| Tinta funda | `#0C2340` |
| Maré | `#6386AC` |
| Espuma | `#BBD8EC` |
| Areia | `#FDF6E5` |
| Areia funda | `#F2E6CC` |
| Barro | `#A9502F` |

Títulos em Bricolage Grotesque, texto em Karla, detalhes em DM Mono. Tudo em
`tailwind.config.cjs`: não há hex solto nos componentes. Barro é a única cor
que não vem da marca original, entra só em ação e foi aprovada junto com a
direção.

## Estrutura

```
Caddyfile                 TLS e cabeçalhos de segurança
docker-compose.yml        dev e teste local
docker-compose.prod.yml   VPS, com Caddy na frente
Makefile                  atalhos de tudo
nginx.conf                arquivos estáticos, cache e proxy da API
index.html                meta, Open Graph, JSON-LD, fontes
public/                   favicon, robots, imagens da marca
src/
  tipos.ts                o contrato do conteúdo
  conteudoPadrao.ts       o conteúdo inicial
  main.tsx                decide entre site e painel pelo caminho
  App.tsx                 o site
  lib/api.ts              cliente da API
  lib/conteudo.tsx        provider que busca e entrega o conteúdo
  components/             seções do site
  admin/                  Login, Painel, campos, seletor de imagem
server/
  src/config.js           variáveis de ambiente
  src/db.js               SQLite, schema e consultas
  src/auth.js             bcrypt, JWT, cookie de sessão
  src/esquema.js          validação (zod)
  src/rotas/              sessao, conteudo, midia
  src/scripts/            definirSenha
```

## Decisões de segurança

**Só o Caddy publica porta.** O nginx e a API ficam em `expose`, alcançáveis
apenas pela rede interna do compose. Não dá para driblar o TLS batendo na
porta do nginx.

**A sessão vive em cookie httpOnly**, não no localStorage: lá qualquer XSS
leria o token. `SameSite=strict` cobre CSRF sem token separado, já que a API
só aceita requisição da própria origem.

**Login tem limite de cinco tentativas a cada quinze minutos por IP.** Depende
de `TRUST_PROXY` estar certo: com valor alto demais, qualquer um forja o
cabeçalho `X-Forwarded-For` e escapa do limite. São dois saltos (Caddy e
nginx), então `TRUST_PROXY=2`.

**E-mail inexistente e senha errada devolvem a mesma mensagem**, e o e-mail
inexistente ainda roda um bcrypt descartável, para que o tempo de resposta não
entregue quais contas existem.

**A validação real é a do servidor.** O formulário valida para dar feedback,
mas qualquer pessoa autenticada pode chamar `PUT /api/conteudo` direto. Quem
decide o que entra no banco é `server/src/esquema.js`, incluindo recusar
`href` com `javascript:` e imagem apontando para domínio de fora.

**Imagem enviada é sempre reescrita pelo sharp** como WebP, com nome
aleatório. Isso descarta EXIF (incluindo GPS da foto) e qualquer coisa
escondida num arquivo que só finge ser imagem.

**JWT_SECRET não tem valor padrão em produção**: o servidor se recusa a subir
sem ele.

## Decisões de front

**Sem Lucide por CDN.** Os ícones eram injetados por um script global que
rodava `createIcons()` uma vez no mount, e sumiam a cada remontagem. Agora são
componentes em `Icones.tsx`.

**Sem iframe do YouTube.** O embed baixa cerca de 1 MB de script de terceiro e
grava cookie antes de alguém apertar o play. A capa é estática.

**Sem listener de scroll.** A entrada dos blocos usa `IntersectionObserver`.
O estado escondido vive sob a classe `.js-revelar`, aplicada só quando o React
monta, então sem JS a página aparece inteira em vez de ficar em branco.

**`prefers-reduced-motion` desliga** animação, transição e scroll suave.

**Sem router.** São duas telas sem navegação entre elas: `main.tsx` resolve
com um `if` no pathname, e o `try_files` do nginx entrega o index em `/admin`.

**Bundles em `/build/`, imagens da marca em `/assets/`.** Separados porque os
primeiros têm hash no nome e podem ser imutáveis no cache; os segundos têm
nome fixo e um deploy pode trocar o conteúdo.

## Pendência conhecida: peso das imagens da marca

As fotos enviadas pelo painel já saem otimizadas. As de `public/assets/`, que
vieram no projeto, não: são cerca de 12 MB sem tratamento. O logo tem 2266px e
728 KB para renderizar a 30px. Já existe `width`/`height` em todo `<img>` e
`loading="lazy"` abaixo da dobra, mas falta reduzir os arquivos. Sem instalar
nada:

```bash
docker run --rm -v "$PWD/public/assets":/img dpokidov/imagemagick \
  -resize 400x /img/logo.png /img/logo.png
```

Outros pontos de peso:

- `public/assets/foto.jpg` (3 MB) não é usado por componente nenhum, mas o
  Vite copia `public/` inteiro para o `dist`, então é publicado à toa.
- `public/assets/Trabalho-Completo-Encontro-de-Genero.pdf` tem 5,9 MB e 582
  páginas. Melhor hospedar fora e linkar.
- A pasta `assets/` na raiz é cópia de `public/assets/`. Só `public/` é
  servida, então a da raiz é peso morto no repositório.

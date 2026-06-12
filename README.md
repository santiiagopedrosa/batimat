# BATIMAT — Site + Backoffice

Site institucional para empresa de construção civil, com **backoffice** para gerir projetos, fotos, textos e pedidos de contacto.

Estrutura inspirada no briefing:
- **Sobre nós** (na página inicial)
- **Projetos + detalhe de projeto** (com galeria de fotos)
- **Contactos** (com formulário)
- **Backoffice (BO)** para gerir projetos, fotos e textos
- **Projetos reservados** — implementada a opção sugerida no orçamento: em vez de uma área de login, os projetos exclusivos aparecem com apenas **uma foto, nome, descrição curta e formulário de contacto**, o que elimina o login desnecessário e incentiva a lead.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + CSS Modules (JavaScript) |
| Backend / API | Node.js + Express |
| Autenticação BO | JWT (palavra-passe única de administrador) |
| Base de dados | Ficheiro JSON (`server/data/db.json`) |
| Upload de fotos | Multer → `server/uploads/` |

## Como correr (desenvolvimento)

Requisitos: Node.js 18 ou superior.

```bash
# 1. Instalar dependências (raiz + servidor + cliente)
npm install
npm run install:all

# 2. Arrancar tudo (API na porta 4000 + Vite na 5173)
npm run dev
```

- Site: http://localhost:5173
- Backoffice: http://localhost:5173/admin/login
- **Palavra-passe do BO (por omissão): `batimat2026`**

Para alterar a palavra-passe, copiar `server/.env.example` para `server/.env` e arrancar com as variáveis definidas, por exemplo:

```bash
ADMIN_PASSWORD=nova-pass JWT_SECRET=chave-longa-aleatoria npm run dev
```

## Como correr (produção)

```bash
npm run build          # gera client/dist
npm start              # o Express serve a API + o build do site na porta 4000
```

Em produção o servidor Express serve tudo num único processo: API, uploads e o site compilado.

## Backoffice — o que dá para fazer

- **Projetos**: criar, editar e apagar obras; carregar foto de capa e galeria; marcar como **Destaque** (aparece na homepage) ou **Reservado**.
- **Textos do site**: editar o topo da homepage, a secção "Sobre nós", os serviços e os contactos.
- **Pedidos de contacto**: ver e apagar as leads recebidas pelos formulários (geral e por projeto reservado).

## Projetos reservados (a "área privada" sem login)

Quando um projeto é marcado como **Reservado** no BO:
- na listagem aparece com a foto a preto-e-branco e uma fita de obra "Projeto reservado";
- na página de detalhe só são mostrados a capa, o nome e a descrição curta;
- a descrição completa e a galeria **nunca saem da API** para visitantes (o filtro é feito no servidor, não no browser);
- é mostrado um formulário "peça a apresentação completa", que cria uma lead identificada com o projeto.

Se mais tarde o cliente insistir numa área de login verdadeira, a base já está montada: o servidor já tem JWT e o filtro `publicView()` em `server/src/index.js` é o único sítio a alterar.

## Notas de deploy

- O projeto precisa de um **servidor Node persistente** (uploads e db.json escrevem em disco). Funciona bem em Render, Railway, Fly.io ou num VPS.
- A Vercel serve para o frontend, mas as funções serverless não guardam ficheiros — para manter os uploads e o db.json era preciso migrar para uma base de dados (ex.: Postgres/Neon) e storage (ex.: Vercel Blob). Para uma primeira versão, um único servidor Node é mais simples e barato.
- Em produção definir sempre `ADMIN_PASSWORD` e `JWT_SECRET` próprios.

## Estrutura de pastas

```
batimat/
├── client/                  # Frontend (Vite + React)
│   └── src/
│       ├── pages/           # Home, Projetos, Detalhe, Contactos
│       ├── admin/           # Backoffice (login, projetos, textos, leads)
│       ├── components/      # Navbar, Footer, ProjectCard, LeadForm
│       └── styles/          # global.css (tokens de design)
└── server/                  # API (Express)
    ├── src/index.js         # rotas
    ├── src/db.js            # persistência JSON
    ├── data/db.json         # conteúdos (projetos, textos, leads)
    └── uploads/             # fotos carregadas no BO
```

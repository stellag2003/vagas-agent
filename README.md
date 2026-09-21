# Agente de Matching de Vagas

Eu tenho um currículo e um perfil de LinkedIn, e toda semana perco tempo lendo vaga por vaga para
descobrir se vale a pena me candidatar. Esse projeto lê meu currículo, lê uma lista de vagas, e me
diz quais delas realmente combinam comigo — e por quê.

Monorepo [Nx](https://nx.dev) com frontend em **React + Next.js** e backend em **Node + NestJS**,
seguindo os princípios **SOLID** e o padrão **MVC** no backend.

## Estrutura

```
apps/
  frontend/      -> Next.js (React) — formulário de currículo/vagas e exibição do ranking
  backend/        -> NestJS — API REST que calcula o ranking (Controller -> Service -> domínio)
libs/
  matching/       -> lógica de domínio pura (parser de skills + cálculo de score + ranking),
                     independente de framework, usada pelo backend via injeção de dependência
python-mvp/       -> protótipo original em Python (mantido como referência)
```

Ver [`apps/backend/src/app/vagas`](apps/backend/src/app/vagas) para o exemplo do padrão MVC/SOLID:
`VagasController` (View/entrada HTTP) → `VagasService` (Model/orquestração) → `JobRanker` (domínio,
injetado por interface via `SKILL_EXTRACTOR`/`MATCH_CALCULATOR`).

## Como rodar

```bash
npm install

npx nx serve backend    # API em http://localhost:3000/api
npx nx dev frontend      # app em http://localhost:4200
```

## Como testar

```bash
npx nx run-many -t test
```

## Status atual

O matching é baseado em sobreposição de palavras-chave técnicas entre o currículo e a descrição da
vaga (`libs/matching`) — não é ainda um agente de IA de verdade (sem LLM/embeddings). Essa é a base
sobre a qual o agente vai evoluir. Ver `PROXIMOS_PASSOS.md`.

O MVP original em Python (CLI, sem API/frontend) está preservado em [`python-mvp/`](python-mvp/).

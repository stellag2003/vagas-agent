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

## Verificadores (CI + branch protection)

Os mesmos scripts rodam localmente e no CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)),
em todo push na `main` e em todo PR para a `main`:

| Script              | O que faz                                                                  | Job no CI                        |
| ------------------- | -------------------------------------------------------------------------- | -------------------------------- |
| `npm run lint`      | `prettier --check .` (o monorepo não tem ESLint)                           | Lint                             |
| `npm run typecheck` | `nx run-many -t typecheck` + `tsc --noEmit` no frontend                    | Type check                       |
| `npm run build`     | `nx run-many -t build`                                                     | Build                            |
| `npm test`          | `nx run-many -t test` (matching, backend, frontend)                        | Test                             |
| `npm run audit`     | `npm audit --audit-level=high`: falha com vulnerabilidade high/critical    | Dependency check (npm audit)     |
| —                   | `dependency-review-action` no PR, falha se o PR adicionar dependência high | Dependency check (revisão do PR) |

**Branch protection na `main`:** o merge só é permitido via PR, com os jobs Lint, Type check, Build,
Test e Dependency check (npm audit) verdes e a branch atualizada com a `main`. A regra vale também
para administradores. O repositório é **público**, então a branch protection e o
`dependency-review-action` funcionam sem plano pago nem Student Pack.

**Auditoria de dependências:** `npm audit --audit-level=high` termina com código 0. Para chegar
nisso, o Nx foi alinhado em `23.3.1`, o Next subiu para `16.4.5`, e o `package.json` tem
`overrides` para dependências transitivas que já têm correção na mesma major (`multer ^2.5.0`,
`undici ^7.30.1`, `postcss ^8.5.23`). As que sobram são moderate/low em ferramentas de
desenvolvimento (`deepmerge`, `glob`, `minimatch`, `uuid`, via Jest/Nx/webpack-dev-server): a
correção automática exigiria downgrade de major do Nx/Jest, pior do que o risco, e elas não vão
para produção.

## Status atual

O matching é baseado em sobreposição de palavras-chave técnicas entre o currículo e a descrição da
vaga (`libs/matching`) — não é ainda um agente de IA de verdade (sem LLM/embeddings). Essa é a base
sobre a qual o agente vai evoluir. Ver `PROXIMOS_PASSOS.md`.

O MVP original em Python (CLI, sem API/frontend) está preservado em [`python-mvp/`](python-mvp/).

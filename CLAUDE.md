# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Agente que lê um currículo e uma lista de vagas e retorna quais vagas combinam com o perfil, e por quê.
O matching é feito por sobreposição de palavras-chave técnicas entre currículo e descrição da vaga —
**não é ainda um agente de IA de verdade** (sem LLM, sem embeddings). Ver `PROXIMOS_PASSOS.md` para os
próximos passos priorizados (embeddings/LLM no lugar de keyword-matching, ingestão de vagas reais,
parser de currículo real, integração com LinkedIn, explicação em linguagem natural do "porquê").

O projeto é um **monorepo Nx** com frontend React/Next.js e backend Node/NestJS. Há também um
protótipo original em Python (`python-mvp/`), mantido como referência, não mais o ponto de entrada
principal.

## Comandos (monorepo Nx — raiz do repo)

```bash
npm install

npx nx dev frontend      # Next.js em http://localhost:4200
npx nx serve backend     # NestJS em http://localhost:3000/api

npx nx run-many -t test  # roda os testes de todos os projetos
npx nx test matching     # testes só da lib de domínio
npx nx test backend      # testes só do backend
npx nx test frontend     # testes só do frontend

npx nx graph             # visualiza as dependências entre projetos do monorepo
```

Não há linter configurado no monorepo (gerado com `--linter=none` no frontend).

## Comandos (protótipo Python — `python-mvp/`)

```bash
cd python-mvp
pip install -r requirements.txt
python -m src.agent --resume data/resume_exemplo.txt --jobs data/vagas_exemplo.json --perfil data/perfil_exemplo.json
pytest tests/ -v
```

## Arquitetura do monorepo

```
apps/frontend/   Next.js (App Router) — formulário de currículo + vagas, chama a API e mostra o ranking
apps/backend/    NestJS — API REST
libs/matching/   lógica de domínio pura (sem framework), consumida pelo backend via DI
python-mvp/      protótipo original em Python (referência)
```

### `libs/matching` — domínio, com SOLID

Porta para TypeScript a lógica que estava em `python-mvp/src/parser.py` e `matcher.py`, desenhada em
torno de duas abstrações que o `JobRanker` consome por injeção de dependência (nunca instancia
diretamente) — trocar a extração de skills por embeddings/LLM no futuro não deve exigir mudar o
`JobRanker` nem os consumidores dele:

- **`SkillExtractor`** (interface) → `KeywordSkillExtractor` (implementação atual: casa termos de
  `SKILLS_CONHECIDAS` contra o texto via regex).
- **`MatchCalculator`** (interface) → `OverlapMatchCalculator` (score = interseção / skills da vaga).
- **`JobRanker`** — recebe as duas abstrações no construtor e expõe `ranquear(textoPerfil, vagas)`,
  ordenado por score decrescente.

Cada classe tem uma única responsabilidade (extrair, calcular, orquestrar/ordenar), e novas
implementações das interfaces não quebram as existentes (Open/Closed).

### `apps/backend` — NestJS em MVC

O módulo de referência do padrão é [`apps/backend/src/app/vagas`](apps/backend/src/app/vagas):

- **`VagasController`** (Controller) — só HTTP: recebe `POST /api/vagas/ranking`, valida o corpo via
  `RankingRequestDto` (`class-validator`/`class-transformer`, com `ValidationPipe` global em
  `main.ts`), delega ao service.
- **`VagasService`** (Model/serviço) — instancia um `JobRanker` a partir das abstrações injetadas via
  os tokens `SKILL_EXTRACTOR`/`MATCH_CALCULATOR` (`vagas.tokens.ts`) e serializa `Set<string>` para
  `string[]` (JSON não serializa `Set`).
- **`VagasModule`** — liga os tokens às implementações concretas de `@org/matching`
  (`useClass: KeywordSkillExtractor` / `OverlapMatchCalculator`). É o único lugar que conhece as
  implementações concretas — Dependency Inversion Principle aplicado via Nest DI.

Novos recursos (ex.: perfil do candidato, candidatura assistida) devem seguir o mesmo padrão: pasta
por feature em `apps/backend/src/app/<feature>/` com `*.controller.ts` + `*.service.ts` + `dto/`, e
lógica de domínio reutilizável (se houver) em uma lib própria dentro de `libs/`.

### `apps/frontend` — Next.js

Client component em `src/app/page.tsx` (form de currículo + vagas), chamando a API através de
`src/services/vagas-api.ts` — o único módulo que sabe a URL da API e o formato da requisição HTTP
(a UI não faz `fetch` diretamente). URL da API configurável via `NEXT_PUBLIC_API_URL` (padrão
`http://localhost:3000/api`).

## Importando `@org/matching`

A lib é resolvida como pacote de workspace npm (`"@org/matching"`, ver `libs/matching/package.json`).
Em dev, o `customConditions: ["@org/source"]` em `tsconfig.base.json` faz os imports apontarem direto
para `libs/matching/src/index.ts` (sem precisar buildar a lib antes de rodar/testar).

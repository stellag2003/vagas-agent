---
name: revisao-matching
description: Checklist de revisão de PR do vagas-agent — fronteira entre libs/matching, backend NestJS e frontend Next.js (inversão de dependência), contrato do domínio de matching (skill canônica, sem contagem dupla, score entre 0 e 1) e testes que conferem o cenário com valor exato. Use ao revisar um diff, uma PR ou uma branch deste repositório, depois que o CI (lint, typecheck, build, test) já passou.
---

# Revisão do vagas-agent: fronteiras, domínio de matching e testes

O CI já cobre formatação (prettier), tipos (tsc), build e testes verdes. Esta revisão
olha o que esses sensores **não** pegam. Não reporte problema de formatação, de tipo ou
"o teste falha": isso é do CI.

## O que olhar

### 1. Fronteira entre módulos (inversão de dependência)

- `libs/matching/` é domínio puro: **nenhum** import de `@nestjs/*`, `next`, `react`,
  `class-validator`, `fetch` ou I/O (arquivo, rede, `process.env`).
- `JobRanker`, `VagasService` e `VagasController` dependem só das interfaces
  `SkillExtractor` / `MatchCalculator`. Nunca fazem `new KeywordSkillExtractor()` /
  `new OverlapMatchCalculator()` (exceto em arquivos `*.spec.ts`).
- `apps/backend/src/app/vagas/vagas.module.ts` é o **único** lugar do backend que conhece
  as implementações concretas (`useClass`). Implementação nova entra por lá.
- Controller só traduz HTTP; regra fica no service ou na lib. Conversão `Set` → `string[]`
  fica no `VagasService`, não na lib nem no controller.
- No frontend, só `apps/frontend/src/services/vagas-api.ts` conhece a URL da API e faz
  `fetch`. Componente com `fetch` direto ou URL hardcoded é achado.
- Feature nova no backend segue o padrão `apps/backend/src/app/<feature>/` com
  `*.controller.ts` + `*.service.ts` + `dto/` (DTO com `class-validator`).

### 2. Contrato do domínio de matching

- Skill é sempre o **nome canônico em minúsculas** (o mesmo que está em
  `SKILLS_CONHECIDAS`). Duas grafias da mesma tecnologia (`node` e `node.js`,
  `react` e `reactjs`) não podem virar duas skills.
- Uma tecnologia citada no texto não pode contar **duas vezes** no score (ex.: um termo
  do vocabulário que é prefixo de outro, como `node` dentro de `node.js`).
- Termo curto ou ambíguo (`js`, `ts`, `ia`, `go`, `r`) precisa casar como palavra
  inteira; confira se ele não casa dentro de outra palavra ou de outro termo
  (`ia` em "Mar**ia**", `ts` em "**ts**x"/"nex**t**.js").
- `score` fica entre 0 e 1; vaga sem skill identificada tem score 0. A ordenação do
  ranking é por score decrescente.
- Uma mudança no vocabulário ou na normalização afeta **currículo e vaga** (os dois
  passam pelo mesmo `SkillExtractor`); confira se a PR considerou os dois lados.

### 3. Testes que conferem o cenário

- Comportamento novo ou bug corrigido vem com teste no mesmo PR, e o teste falharia sem
  a mudança (pense: "se eu reverter a linha X, este teste fica vermelho?").
- Assert com valor exato: `toEqual(new Set([...]))`, `toBe(0.5)`. É achado quando o
  teste só confere `toBeDefined`, `toBeTruthy`, `Array.isArray`, `.size > 0` ou
  `toBeGreaterThan` em algo que tem um valor esperado conhecido.
- O nome do `it(...)` descreve o comportamento em pt-BR e o corpo confere o que o nome
  promete.
- Caso de borda relevante coberto: texto vazio, termo fora do vocabulário, sinônimo,
  termo ambíguo, vaga sem skills.
- Sem `.only`, `.skip`, `xit`, `xdescribe`.

## Como classificar cada achado

- **BLOQUEIA** — quebra uma regra acima de um jeito que gera resultado errado para a
  pessoa usuária (score ou ranking errado, skill contada duas vezes), viola a fronteira
  de módulos, ou comportamento novo sem teste que o prove.
- **SUGESTÃO** — melhora clara, mas a PR funciona sem ela (teste mais forte, nome mais
  claro, caso de borda extra).
- **DÚVIDA** — você não tem certeza se é problema; precisa de decisão de quem escreveu
  (ex.: escolha de vocabulário, se um sinônimo faz sentido no mercado).

Só reporte o que você viu no código, com evidência. Não invente achado para preencher a
lista; se não há nada numa categoria, não escreva nada nela.

## Formato da saída

Markdown pronto para virar comentário de PR. Achados do mais grave ao menos grave:

```markdown
## Revisão do agente `revisor` — PR #<número>

### 1. [BLOQUEIA] `caminho/do/arquivo.ts:<linha>` — título curto

- **Problema:** o que está errado, com o trecho de código ou o comportamento.
- **Por que importa:** consequência concreta neste projeto (qual regra da skill, que
  resultado errado a pessoa usuária vê).
- **Sugestão:** a correção mínima.

### 2. [SUGESTÃO] ...

### 3. [DÚVIDA] ...

---

**Resumo:** N achados (X bloqueia, Y sugestão, Z dúvida).
**O que examinei:** arquivos lidos e as três áreas checadas (fronteira, domínio, testes).
```

A linha é a do arquivo **depois** da mudança (lado `+` do diff). Se não houver achados,
escreva "Sem achados" e o que você examinou.

---
name: rodar-testes
description: Roda a suíte de testes do monorepo Nx (vagas-agent) e resume o resultado — quais projetos passaram, quais falharam, e o motivo de cada falha. Use sempre que o usuário pedir para rodar os testes, checar se os testes passam, ou perguntar "os testes ainda passam?" antes de commitar ou abrir PR. Aceita rodar tudo ou só um projeto específico (ex.: matching, backend, frontend).
allowed-tools: Bash
---

# Rodar testes

Roda os testes do monorepo Nx e devolve um resumo curto — não o log inteiro. O objetivo é que o
usuário saiba em poucas linhas se pode seguir em frente ou o que precisa consertar.

## Passo 1 — escolher o comando

- Sem projeto específico pedido → roda tudo:
  ```
  npx nx run-many -t test --output-style=static
  ```
- Se o usuário pedir um projeto específico (ex. "roda só o matching", "testa o backend") → roda só
  aquele projeto:
  ```
  npx nx test <projeto> --output-style=static
  ```
  Projetos válidos neste repo: `matching`, `backend`, `frontend` (ver `CLAUDE.md` na raiz).

O `--output-style=static` é importante: sem ele, quando o Nx usa o cache de uma run anterior, ele
esconde o output real ("Output of N successful tasks were not shown") e não dá pra saber quantos
testes rodaram nem extrair falhas. Com essa flag o output do Jest de cada projeto aparece sempre,
mesmo em cache hit.

Rode com o Bash tool e capture toda a saída (stdout + stderr).

## Passo 2 — resumir o resultado, não colar o log

Depois de rodar, produza um resumo assim:

```
✅ matching — X testes passaram
✅ backend — X testes passaram
❌ frontend — X passaram, Y falharam

Falhas:
- <arquivo de teste>::<nome do teste> — <mensagem de erro resumida em 1 linha>
- <arquivo de teste>::<nome do teste> — <mensagem de erro resumida em 1 linha>
```

Regras para o resumo:

- Para cada projeto rodado, diga quantos testes passaram/falharam (ou "sem testes" se não houver
  nenhum).
- Para cada teste que falhou, extraia da saída: o nome do teste (describe/it) e a linha de
  asserção ou erro que explica a causa (ex. "expected 3 to be 5", "Cannot find module X"). Corte
  stack traces longos — uma linha de causa basta.
- Nunca cole o log bruto do Jest/Nx inteiro na resposta. Se o usuário quiser ver mais detalhe de
  uma falha específica, ofereça mostrar o trecho relevante daquele teste, não o log todo.
- Se tudo passar, a resposta pode ser só uma linha confirmando (ex. "✅ Todos os testes passaram —
  matching, backend e frontend.").
- Se o comando falhar antes mesmo de rodar testes (erro de build, projeto não encontrado, etc.),
  reporte isso claramente em vez de tentar encaixar no formato de resumo acima.

## Por que não tem um reference.md

Separar conteúdo em `reference.md` só compensa quando parte do material é usado às vezes, não
sempre (ex.: um caso raro, uma tabela grande, um domínio alternativo) — aí faz sentido não carregar
aquilo em toda execução. Aqui não é o caso: as duas seções acima (qual comando rodar e como
resumir) são usadas em 100% das execuções da skill, o arquivo já é curto, e não há variantes por
projeto ou por framework de teste. Extrair algo pra outro arquivo só trocaria "ler direto" por "ler
via link", sem economizar contexto. Se um dia isso mudar — por exemplo, formatos de erro
específicos por projeto, ou suporte a outro test runner além do Jest — vale revisitar essa decisão.

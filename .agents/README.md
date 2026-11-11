# .agents/

Agentes e skills do projeto, independentes de ferramenta. É a fonte da verdade.

```
.agents/agents/revisor.md                 agente revisor de PR (só leitura)
.agents/skills/revisao-matching/SKILL.md  o que o revisor olha e o formato da saída
```

O Claude Code carrega de `.claude/agents` e `.claude/skills`. Como o repo é usado no
Windows com `core.symlinks=false`, as pastas são **copiadas** em vez de linkadas:

```bash
npm run agents:sync   # copia .agents/{agents,skills} para .claude/
```

Edite sempre em `.agents/` e rode o sync; não edite a cópia em `.claude/`.

## Fluxo de revisão de PR

O revisor roda **depois** do CI (lint, typecheck, build, test), não no lugar dele.

```bash
# no Claude Code
@agent-revisor revise a PR #<n>          # o agente lê com gh pr diff <n>
# salve a saída em revisao.md e poste:
gh pr comment <n> --body-file revisao.md
```

Depois, responda logo abaixo com o resumo: quantos achados, quais aceitou, quais
rejeitou e por quê, e o que o agente não viu.

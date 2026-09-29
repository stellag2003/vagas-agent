# rodar-testes

Skill do Claude Code que roda a suíte de testes deste monorepo Nx (tudo ou um projeto específico —
`matching`, `backend`, `frontend`) e devolve um resumo curto de quais passaram/falharam, em vez de
despejar o log inteiro do Jest/Nx.

Para usar em outro projeto: copie esta pasta inteira para o `.claude/skills/` do repositório
desejado e reinicie o Claude Code — ele passa a listar `rodar-testes` como skill disponível
(ajuste os comandos do `SKILL.md` se o projeto não for Nx/Jest).

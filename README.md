# Agente de Matching de Vagas

Eu tenho um currículo e um perfil de LinkedIn, e toda semana perco tempo lendo vaga por vaga para
descobrir se vale a pena me candidatar. Esse projeto lê meu currículo, lê uma lista de vagas, e me
diz quais delas realmente combinam comigo — e por quê.

> ⚠️ Este README foi escrito como ponto de partida. Reescreva o parágrafo acima com suas próprias
> palavras antes de considerar o "contrato mínimo" cumprido — o objetivo é você conseguir explicar
> o problema sem jargão técnico, para qualquer pessoa.

## Como rodar

```bash
pip install -r requirements.txt
python -m src.agent --resume data/resume_exemplo.txt --jobs data/vagas_exemplo.json

# opcional: inclui seus dados básicos (nome, e-mail, telefone...) na saída
python -m src.agent --resume data/resume_exemplo.txt --jobs data/vagas_exemplo.json --perfil data/perfil_exemplo.json
```

> Para usar seus dados reais, copie `data/perfil_exemplo.json` para `data/perfil.json` e preencha —
> esse arquivo é ignorado pelo git (`.gitignore`) porque o repositório é público.

## Como testar

```bash
pytest tests/ -v
```

## Estrutura

```
src/        -> código do agente (parser de currículo + matching + perfil + CLI)
tests/      -> testes automatizados do matching
data/       -> exemplos de currículo e vagas para rodar o agente localmente
```

## Status atual (MVP)

O matching hoje é baseado em sobreposição de palavras-chave técnicas entre o currículo e a
descrição da vaga (`src/matcher.py`). Isso funciona como ponto de partida, mas **não é ainda um
agente de IA de verdade** — é a base sobre a qual o agente (com LLM, embeddings, ou outra
abordagem) vai ser construído. Ver `PROXIMOS_PASSOS.md`.

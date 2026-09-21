# Agente de Matching de Vagas (MVP em Python)

Protótipo original do agente: lê um currículo, lê uma lista de vagas, e diz quais combinam — e por
quê — usando sobreposição de palavras-chave técnicas. Foi movido para esta pasta quando o projeto
virou o monorepo Nx (`apps/frontend` + `apps/backend`) na raiz do repositório; fica aqui como
referência/protótipo, não é mais o ponto de entrada principal do projeto.

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

## Status

O matching aqui é baseado em sobreposição de palavras-chave técnicas entre o currículo e a
descrição da vaga (`src/matcher.py`) — não é um agente de IA de verdade (sem LLM/embeddings). A
lógica equivalente está sendo portada para `apps/backend` (NestJS) no monorepo.

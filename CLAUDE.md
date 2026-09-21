# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Agente que lê um currículo e uma lista de vagas e retorna quais vagas combinam com o perfil, e por quê.
O estado atual é um MVP: o "matching" é feito por sobreposição de palavras-chave técnicas entre currículo
e descrição da vaga — **não é ainda um agente de IA de verdade** (sem LLM, sem embeddings). Essa base
existe para provar que a lógica de ranking funciona antes de trocar por uma abordagem semântica. Ver
`PROXIMOS_PASSOS.md` para os próximos passos já priorizados (nessa ordem): embeddings/LLM no lugar de
keyword-matching, ingestão de vagas reais (API/scraping), parser de currículo real (PDF/DOCX), integração
com LinkedIn, e explicação em linguagem natural do "porquê" do match.

## Comandos

```bash
pip install -r requirements.txt

# Rodar o agente (imprime ranking de vagas x currículo)
python -m src.agent --resume data/resume_exemplo.txt --jobs data/vagas_exemplo.json

# Com --perfil opcional, também imprime os dados básicos do candidato
python -m src.agent --resume data/resume_exemplo.txt --jobs data/vagas_exemplo.json --perfil data/perfil_exemplo.json

# Rodar todos os testes
pytest tests/ -v

# Rodar um teste específico
pytest tests/test_matcher.py::test_match_parcial_calcula_proporcao_correta -v
```

Não há linter/formatter configurado no projeto.

## Arquitetura

Pipeline linear de 3 estágios, cada um em seu próprio módulo:

1. **`src/parser.py`** — `extrair_skills(texto)` extrai um `set[str]` de skills de um texto livre,
   comparando contra o vocabulário fixo `SKILLS_CONHECIDAS`. É a única fonte de "o que conta como skill"
   no sistema; currículo e descrição de vaga passam pela mesma função. Termos são casados como
   palavra/frase inteira (regex com lookaround `(?<!\w)...(?!\w)`), não substring — por isso o vocabulário
   entra em minúsculas e sem acentuação especial.

2. **`src/matcher.py`** — `calcular_match(skills_perfil, skills_vaga, vaga_titulo)` calcula o score de uma
   vaga (`len(interseção) / len(skills_vaga)`); `ranquear_vagas(texto_perfil, vagas)` orquestra: extrai
   skills do currículo uma vez, extrai skills de cada vaga, calcula match e ordena por score decrescente.
   Retorna `list[ResultadoMatch]` (dataclass com `vaga_titulo`, `score`, `skills_em_comum`,
   `skills_faltando`). Vaga cuja descrição não bate com nenhuma skill conhecida recebe score 0 (o sistema
   nunca afirma compatibilidade sem evidência).

3. **`src/perfil.py`** — dataclass `Perfil` (nome, email, telefone, linkedin, cidade, curriculo_path) com
   `carregar_perfil`/`salvar_perfil` para persistir os dados básicos que toda candidatura pede, evitando
   redigitá-los a cada vaga. O perfil real vive em `data/perfil.json`, que é ignorado pelo git (repositório
   é público) — `data/perfil_exemplo.json` é o template versionado. Esse módulo é a base para o próximo
   passo de auto-preenchimento/candidatura assistida.

4. **`src/agent.py`** — CLI (`argparse`) que lê `--resume` (`.txt`) e `--jobs` (`.json`, lista de objetos
   `{"titulo", "descricao"}`), chama `ranquear_vagas` e imprime o ranking formatado. `--perfil` (opcional)
   carrega um `Perfil` e imprime os dados básicos do candidato junto ao ranking.

Como o vocabulário de skills é um `set` fixo em `parser.py`, sinônimos não normalizados (ex.: "React" vs
"ReactJS") são tratados como termos diferentes — essa é a limitação central que a troca para
embeddings/LLM (item 1 de `PROXIMOS_PASSOS.md`) resolve.

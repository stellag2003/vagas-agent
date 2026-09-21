"""
Extrai um conjunto de "skills" (tecnologias, ferramentas, conceitos) de um texto livre.

Abordagem atual: comparar o texto contra um dicionário de termos conhecidos do mercado de TI.
É simples de propósito — é o ponto de partida do agente, não o agente final.
"""
import re

# Dicionário inicial. Adicione/edite os termos que fazem sentido para a vaga que você busca.
SKILLS_CONHECIDAS = {
    "python", "javascript", "typescript", "java", "sql", "nosql", "react", "node",
    "node.js", "django", "flask", "fastapi", "git", "docker", "kubernetes", "aws",
    "azure", "gcp", "linux", "html", "css", "api", "rest", "graphql", "postgresql",
    "mysql", "mongodb", "redis", "ci/cd", "agile", "scrum", "testes automatizados",
    "machine learning", "ia", "llm", "pandas", "numpy", "excel", "power bi",
}


def normalizar(texto: str) -> str:
    return re.sub(r"\s+", " ", texto.lower()).strip()


def extrair_skills(texto: str, vocabulario: set[str] = SKILLS_CONHECIDAS) -> set[str]:
    """Retorna o subconjunto de `vocabulario` que aparece em `texto` como palavra/termo inteiro."""
    texto_normalizado = normalizar(texto)
    encontradas = set()
    for skill in vocabulario:
        padrao = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"
        if re.search(padrao, texto_normalizado):
            encontradas.add(skill)
    return encontradas

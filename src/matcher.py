"""
Calcula a compatibilidade entre o perfil (currículo + LinkedIn) e uma vaga.
"""
from dataclasses import dataclass

from src.parser import extrair_skills


@dataclass
class ResultadoMatch:
    vaga_titulo: str
    score: float  # 0.0 a 1.0
    skills_em_comum: set[str]
    skills_faltando: set[str]


def calcular_match(skills_perfil: set[str], skills_vaga: set[str], vaga_titulo: str = "") -> ResultadoMatch:
    """
    Score = quantas skills pedidas na vaga o perfil já tem, proporcionalmente.
    Vaga sem nenhuma skill identificada tem score 0 (não dá pra afirmar compatibilidade).
    """
    if not skills_vaga:
        return ResultadoMatch(vaga_titulo, 0.0, set(), set())

    em_comum = skills_perfil & skills_vaga
    faltando = skills_vaga - skills_perfil
    score = len(em_comum) / len(skills_vaga)

    return ResultadoMatch(vaga_titulo, round(score, 2), em_comum, faltando)


def ranquear_vagas(texto_perfil: str, vagas: list[dict]) -> list[ResultadoMatch]:
    """
    vagas: lista de dicts com chaves "titulo" e "descricao".
    Retorna os resultados ordenados do maior para o menor score.
    """
    skills_perfil = extrair_skills(texto_perfil)
    resultados = [
        calcular_match(skills_perfil, extrair_skills(vaga["descricao"]), vaga["titulo"])
        for vaga in vagas
    ]
    return sorted(resultados, key=lambda r: r.score, reverse=True)

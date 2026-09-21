from src.matcher import calcular_match, ranquear_vagas
from src.parser import extrair_skills


def test_extrai_skills_conhecidas_do_texto():
    texto = "Tenho experiência com Python, Git e Docker."
    skills = extrair_skills(texto)
    assert skills == {"python", "git", "docker"}


def test_ignora_termos_fora_do_vocabulario():
    texto = "Sou muito organizado e proativo."
    assert extrair_skills(texto) == set()


def test_match_perfeito_tem_score_1():
    resultado = calcular_match({"python", "sql"}, {"python", "sql"}, "Vaga X")
    assert resultado.score == 1.0
    assert resultado.skills_faltando == set()


def test_match_parcial_calcula_proporcao_correta():
    # perfil tem 1 das 2 skills pedidas -> score 0.5
    resultado = calcular_match({"python"}, {"python", "aws"}, "Vaga Y")
    assert resultado.score == 0.5
    assert resultado.skills_em_comum == {"python"}
    assert resultado.skills_faltando == {"aws"}


def test_vaga_sem_skills_identificadas_nao_afirma_match():
    resultado = calcular_match({"python"}, set(), "Vaga sem descrição útil")
    assert resultado.score == 0.0


def test_ranqueamento_ordena_do_maior_para_menor_score():
    perfil = "Python, SQL e Docker"
    vagas = [
        {"titulo": "Vaga fraca", "descricao": "React e TypeScript"},
        {"titulo": "Vaga forte", "descricao": "Python, SQL, Docker"},
    ]
    resultados = ranquear_vagas(perfil, vagas)
    assert resultados[0].vaga_titulo == "Vaga forte"
    assert resultados[0].score > resultados[1].score

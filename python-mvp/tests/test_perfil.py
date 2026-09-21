import json

from src.perfil import Perfil, carregar_perfil, salvar_perfil


def test_carregar_perfil_do_exemplo_versionado():
    perfil = carregar_perfil("data/perfil_exemplo.json")
    assert perfil.nome
    assert "@" in perfil.email


def test_salvar_e_recarregar_perfil_preserva_dados(tmp_path):
    perfil = Perfil(
        nome="Ciclana",
        email="ciclana@example.com",
        telefone="(21) 91234-5678",
        linkedin="https://linkedin.com/in/ciclana",
        cidade="Rio de Janeiro, RJ",
        curriculo_path="data/resume_exemplo.txt",
    )
    caminho = tmp_path / "perfil.json"

    salvar_perfil(perfil, caminho)
    recarregado = carregar_perfil(caminho)

    assert recarregado == perfil


def test_perfil_salvo_e_json_valido(tmp_path):
    perfil = Perfil(
        nome="Beltrano",
        email="beltrano@example.com",
        telefone="(31) 99999-0000",
        linkedin="https://linkedin.com/in/beltrano",
        cidade="Belo Horizonte, MG",
        curriculo_path="data/resume_exemplo.txt",
    )
    caminho = tmp_path / "perfil.json"

    salvar_perfil(perfil, caminho)

    with open(caminho, encoding="utf-8") as f:
        dados = json.load(f)
    assert dados["nome"] == "Beltrano"

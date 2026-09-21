"""
Perfil do candidato: dados básicos que praticamente toda candidatura pede
(nome, e-mail, telefone, LinkedIn, currículo). Guardar isso uma vez evita
redigitar em cada vaga.

O perfil real (com dados de verdade) fica em `data/perfil.json`, fora do git
(ver .gitignore) — só o `data/perfil_exemplo.json` é versionado, como template.
"""
import json
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass
class Perfil:
    nome: str
    email: str
    telefone: str
    linkedin: str
    cidade: str
    curriculo_path: str


def carregar_perfil(caminho: str | Path) -> Perfil:
    """Lê o perfil de um .json. Lança FileNotFoundError se o arquivo não existir."""
    with open(caminho, encoding="utf-8") as f:
        dados = json.load(f)
    return Perfil(**dados)


def salvar_perfil(perfil: Perfil, caminho: str | Path) -> None:
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(asdict(perfil), f, ensure_ascii=False, indent=2)

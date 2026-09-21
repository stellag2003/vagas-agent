"""
CLI: lê um currículo e uma lista de vagas, e imprime o ranking de compatibilidade.

Uso:
    python -m src.agent --resume data/resume_exemplo.txt --jobs data/vagas_exemplo.json
"""
import argparse
import json
import sys

from src.matcher import ranquear_vagas


def main() -> None:
    parser = argparse.ArgumentParser(description="Agente de matching currículo x vagas")
    parser.add_argument("--resume", required=True, help="Caminho para o .txt do currículo")
    parser.add_argument("--jobs", required=True, help="Caminho para o .json com as vagas")
    args = parser.parse_args()

    with open(args.resume, encoding="utf-8") as f:
        texto_perfil = f.read()

    with open(args.jobs, encoding="utf-8") as f:
        vagas = json.load(f)

    resultados = ranquear_vagas(texto_perfil, vagas)

    print(f"\n{'VAGA':40} {'SCORE':>6}")
    print("-" * 50)
    for r in resultados:
        print(f"{r.vaga_titulo[:40]:40} {r.score:>6.0%}")
        if r.skills_em_comum:
            print(f"   ✓ Você já tem: {', '.join(sorted(r.skills_em_comum))}")
        if r.skills_faltando:
            print(f"   ✗ Falta: {', '.join(sorted(r.skills_faltando))}")
        print()


if __name__ == "__main__":
    sys.exit(main())

import type { SkillExtractor } from './skill-extractor.js';
import type { MatchCalculator } from './match-calculator.js';
import type { ResultadoMatch, Vaga } from './types.js';

/**
 * Orquestra o ranking de vagas para um perfil.
 *
 * Depende apenas das abstrações `SkillExtractor` e `MatchCalculator` (inversão de
 * dependência) — trocar a extração de skills por embeddings/LLM, ou o cálculo de
 * score por outra fórmula, não exige mudar esta classe.
 */
export class JobRanker {
  constructor(
    private readonly skillExtractor: SkillExtractor,
    private readonly matchCalculator: MatchCalculator,
  ) {}

  ranquear(textoPerfil: string, vagas: Vaga[]): ResultadoMatch[] {
    const skillsPerfil = this.skillExtractor.extrairSkills(textoPerfil);

    const resultados = vagas.map((vaga) => {
      const skillsVaga = this.skillExtractor.extrairSkills(vaga.descricao);
      return this.matchCalculator.calcular(skillsPerfil, skillsVaga, vaga.titulo);
    });

    return resultados.sort((a, b) => b.score - a.score);
  }
}

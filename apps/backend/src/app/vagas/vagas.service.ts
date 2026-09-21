import { Inject, Injectable } from '@nestjs/common';
import { JobRanker, type MatchCalculator, type SkillExtractor, type Vaga } from '@org/matching';
import { MATCH_CALCULATOR, SKILL_EXTRACTOR } from './vagas.tokens.js';
import type { RankingItemDto } from './dto/ranking-item.dto.js';

/**
 * Camada de serviço (Model, no sentido de MVC): orquestra o domínio de matching
 * e traduz o resultado para um formato serializável em JSON (Set -> array).
 */
@Injectable()
export class VagasService {
  private readonly ranker: JobRanker;

  constructor(
    @Inject(SKILL_EXTRACTOR) skillExtractor: SkillExtractor,
    @Inject(MATCH_CALCULATOR) matchCalculator: MatchCalculator,
  ) {
    this.ranker = new JobRanker(skillExtractor, matchCalculator);
  }

  ranquear(curriculo: string, vagas: Vaga[]): RankingItemDto[] {
    return this.ranker.ranquear(curriculo, vagas).map((resultado) => ({
      vagaTitulo: resultado.vagaTitulo,
      score: resultado.score,
      skillsEmComum: [...resultado.skillsEmComum].sort(),
      skillsFaltando: [...resultado.skillsFaltando].sort(),
    }));
  }
}

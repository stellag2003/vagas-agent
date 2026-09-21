import { Module } from '@nestjs/common';
import { KeywordSkillExtractor, OverlapMatchCalculator } from '@org/matching';
import { VagasController } from './vagas.controller.js';
import { VagasService } from './vagas.service.js';
import { MATCH_CALCULATOR, SKILL_EXTRACTOR } from './vagas.tokens.js';

@Module({
  controllers: [VagasController],
  providers: [
    VagasService,
    { provide: SKILL_EXTRACTOR, useClass: KeywordSkillExtractor },
    { provide: MATCH_CALCULATOR, useClass: OverlapMatchCalculator },
  ],
})
export class VagasModule {}

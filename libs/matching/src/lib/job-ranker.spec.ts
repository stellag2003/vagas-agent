import { JobRanker } from './job-ranker.js';
import { KeywordSkillExtractor } from './skill-extractor.js';
import { OverlapMatchCalculator } from './match-calculator.js';

describe('JobRanker', () => {
  const ranker = new JobRanker(
    new KeywordSkillExtractor(),
    new OverlapMatchCalculator(),
  );

  it('ordena as vagas da maior para a menor pontuação', () => {
    const resultados = ranker.ranquear('Python, SQL e Docker', [
      { titulo: 'Vaga fraca', descricao: 'React e TypeScript' },
      { titulo: 'Vaga forte', descricao: 'Python, SQL, Docker' },
    ]);

    expect(resultados[0].vagaTitulo).toBe('Vaga forte');
    expect(resultados[0].score).toBeGreaterThan(resultados[1].score);
  });

  it('dá o mesmo score para vaga e currículo que escrevem a skill diferente', () => {
    const [resultado] = ranker.ranquear('Sei React.js e Node.js', [
      {
        titulo: 'Full stack',
        descricao: 'Buscamos pessoa com ReactJS e NodeJS',
      },
    ]);

    expect(resultado.score).toBe(1);
  });
});

import { KeywordSkillExtractor, OverlapMatchCalculator } from '@org/matching';
import { VagasService } from './vagas.service.js';

describe('VagasService', () => {
  it('ranqueia vagas e serializa skills como arrays ordenados', () => {
    const service = new VagasService(new KeywordSkillExtractor(), new OverlapMatchCalculator());

    const resultado = service.ranquear('Python, SQL e Docker', [
      { titulo: 'Vaga fraca', descricao: 'React e TypeScript' },
      { titulo: 'Vaga forte', descricao: 'Python, SQL, Docker' },
    ]);

    expect(resultado[0].vagaTitulo).toBe('Vaga forte');
    expect(resultado[0].skillsEmComum).toEqual(['docker', 'python', 'sql']);
    expect(Array.isArray(resultado[0].skillsFaltando)).toBe(true);
  });
});

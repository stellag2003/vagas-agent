import { OverlapMatchCalculator } from './match-calculator.js';

describe('OverlapMatchCalculator', () => {
  const calculator = new OverlapMatchCalculator();

  it('dá score 1 para match perfeito', () => {
    const resultado = calculator.calcular(new Set(['python', 'sql']), new Set(['python', 'sql']), 'Vaga X');
    expect(resultado.score).toBe(1);
    expect(resultado.skillsFaltando.size).toBe(0);
  });

  it('calcula a proporção correta para match parcial', () => {
    const resultado = calculator.calcular(new Set(['python']), new Set(['python', 'aws']), 'Vaga Y');
    expect(resultado.score).toBe(0.5);
    expect(resultado.skillsEmComum).toEqual(new Set(['python']));
    expect(resultado.skillsFaltando).toEqual(new Set(['aws']));
  });

  it('não afirma compatibilidade quando a vaga não tem skills identificadas', () => {
    const resultado = calculator.calcular(new Set(['python']), new Set(), 'Vaga sem descrição útil');
    expect(resultado.score).toBe(0);
  });
});

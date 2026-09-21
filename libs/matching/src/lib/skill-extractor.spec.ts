import { KeywordSkillExtractor } from './skill-extractor.js';

describe('KeywordSkillExtractor', () => {
  const extractor = new KeywordSkillExtractor();

  it('extrai skills conhecidas do texto', () => {
    const skills = extractor.extrairSkills('Tenho experiência com Python, Git e Docker.');
    expect(skills).toEqual(new Set(['python', 'git', 'docker']));
  });

  it('ignora termos fora do vocabulário', () => {
    const skills = extractor.extrairSkills('Sou muito organizado e proativo.');
    expect(skills.size).toBe(0);
  });
});

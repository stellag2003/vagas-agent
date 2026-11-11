import { KeywordSkillExtractor } from './skill-extractor.js';

describe('KeywordSkillExtractor', () => {
  const extractor = new KeywordSkillExtractor();

  it('extrai skills conhecidas do texto', () => {
    const skills = extractor.extrairSkills(
      'Tenho experiência com Python, Git e Docker.',
    );
    expect(skills).toEqual(new Set(['python', 'git', 'docker']));
  });

  it('ignora termos fora do vocabulário', () => {
    const skills = extractor.extrairSkills('Sou muito organizado e proativo.');
    expect(skills.size).toBe(0);
  });

  it('trata variações de escrita como a mesma skill canônica', () => {
    const skills = extractor.extrairSkills(
      'Experiência com ReactJS, NodeJS, Postgres e K8s.',
    );
    expect(skills).toEqual(
      new Set(['react', 'node', 'postgresql', 'kubernetes']),
    );
  });

  it('não conta Node.js duas vezes (node e node.js)', () => {
    const skills = extractor.extrairSkills('Back-end em Node.js.');
    expect(skills).toEqual(new Set(['node']));
  });

  it('reconhece sinônimos curtos e com ponto (JS, TS, NextJS, Nest.js, Mongo)', () => {
    const skills = extractor.extrairSkills('JS/TS, NextJS, Nest.js e Mongo');
    expect(skills).toEqual(
      new Set(['javascript', 'typescript', 'next.js', 'nestjs', 'mongodb']),
    );
  });

  it('não confunde Next.js e Node.js com o sinônimo js', () => {
    const skills = extractor.extrairSkills('Projetos em Next.js e Node.js');
    expect(skills).toEqual(new Set(['next.js', 'node']));
  });

  it('não lê js/ts de frameworks fora do vocabulário nem de extensões', () => {
    const skills = extractor.extrairSkills(
      'Front-end com Vue.js, Express.js, D3.js e componentes .tsx',
    );
    expect(skills).toEqual(new Set());
  });
});

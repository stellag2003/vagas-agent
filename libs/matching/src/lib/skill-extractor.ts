/**
 * Extrai um conjunto de "skills" (tecnologias, ferramentas, conceitos) de um texto livre.
 */
export interface SkillExtractor {
  extrairSkills(texto: string): Set<string>;
}

// Vocabulário inicial. Adicione/edite os termos que fazem sentido para a vaga que você busca.
export const SKILLS_CONHECIDAS: ReadonlySet<string> = new Set([
  'python', 'javascript', 'typescript', 'java', 'sql', 'nosql', 'react', 'node',
  'node.js', 'django', 'flask', 'fastapi', 'git', 'docker', 'kubernetes', 'aws',
  'azure', 'gcp', 'linux', 'html', 'css', 'api', 'rest', 'graphql', 'postgresql',
  'mysql', 'mongodb', 'redis', 'ci/cd', 'agile', 'scrum', 'testes automatizados',
  'machine learning', 'ia', 'llm', 'pandas', 'numpy', 'excel', 'power bi',
  'nestjs', 'next.js', 'nx',
]);

function normalizar(texto: string): string {
  return texto.toLowerCase().replace(/\s+/g, ' ').trim();
}

function escapeRegExp(termo: string): string {
  return termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Implementação por comparação contra um vocabulário fixo de termos conhecidos do
 * mercado de TI. É simples de propósito — é o ponto de partida do agente, não o
 * agente final (ver KeywordSkillExtractor vs. uma futura implementação semântica).
 */
export class KeywordSkillExtractor implements SkillExtractor {
  constructor(private readonly vocabulario: ReadonlySet<string> = SKILLS_CONHECIDAS) {}

  extrairSkills(texto: string): Set<string> {
    const textoNormalizado = normalizar(texto);
    const encontradas = new Set<string>();

    for (const skill of this.vocabulario) {
      const padrao = new RegExp(`(?<!\\w)${escapeRegExp(skill)}(?!\\w)`);
      if (padrao.test(textoNormalizado)) {
        encontradas.add(skill);
      }
    }

    return encontradas;
  }
}

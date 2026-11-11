/**
 * Extrai um conjunto de "skills" (tecnologias, ferramentas, conceitos) de um texto livre.
 */
export interface SkillExtractor {
  extrairSkills(texto: string): Set<string>;
}

// Vocabulário inicial. Adicione/edite os termos que fazem sentido para a vaga que você busca.
export const SKILLS_CONHECIDAS: ReadonlySet<string> = new Set([
  'python',
  'javascript',
  'typescript',
  'java',
  'sql',
  'nosql',
  'react',
  'node',
  'django',
  'flask',
  'fastapi',
  'git',
  'docker',
  'kubernetes',
  'aws',
  'azure',
  'gcp',
  'linux',
  'html',
  'css',
  'api',
  'rest',
  'graphql',
  'postgresql',
  'mysql',
  'mongodb',
  'redis',
  'ci/cd',
  'agile',
  'scrum',
  'testes automatizados',
  'machine learning',
  'ia',
  'llm',
  'pandas',
  'numpy',
  'excel',
  'power bi',
  'nestjs',
  'next.js',
  'nx',
]);

/**
 * Variações de escrita -> nome canônico (que precisa estar no vocabulário).
 * Assim "ReactJS" e "React" viram a mesma skill e não contam como duas.
 */
export const SINONIMOS: Readonly<Record<string, string>> = {
  'node.js': 'node',
  nodejs: 'node',
  reactjs: 'react',
  'react.js': 'react',
  js: 'javascript',
  ts: 'typescript',
  postgres: 'postgresql',
  mongo: 'mongodb',
  k8s: 'kubernetes',
  nextjs: 'next.js',
  'nest.js': 'nestjs',
};

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
  // Termo encontrado no texto -> skill canônica, do termo mais longo para o mais curto.
  private readonly termos: [string, string][];

  constructor(
    vocabulario: ReadonlySet<string> = SKILLS_CONHECIDAS,
    sinonimos: Readonly<Record<string, string>> = SINONIMOS,
  ) {
    const termos = new Map<string, string>();
    for (const skill of vocabulario) termos.set(skill, skill);
    for (const [variacao, canonica] of Object.entries(sinonimos)) {
      if (vocabulario.has(canonica)) termos.set(variacao, canonica);
    }
    this.termos = [...termos].sort(([a], [b]) => b.length - a.length);
  }

  extrairSkills(texto: string): Set<string> {
    let restante = normalizar(texto);
    const encontradas = new Set<string>();

    for (const [termo, canonica] of this.termos) {
      const padrao = new RegExp(`(?<!\\w)${escapeRegExp(termo)}(?!\\w)`, 'g');
      if (padrao.test(restante)) {
        encontradas.add(canonica);
        // Consome o trecho para um termo mais curto ("node") não casar de novo
        // dentro de um mais longo ("node.js").
        restante = restante.replace(padrao, ' ');
      }
    }

    return encontradas;
  }
}

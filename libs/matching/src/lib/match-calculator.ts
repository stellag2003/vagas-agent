import type { ResultadoMatch } from './types.js';

/**
 * Calcula a compatibilidade entre as skills do perfil e as skills pedidas por uma vaga.
 */
export interface MatchCalculator {
  calcular(skillsPerfil: Set<string>, skillsVaga: Set<string>, vagaTitulo?: string): ResultadoMatch;
}

/**
 * Score = quantas skills pedidas na vaga o perfil já tem, proporcionalmente.
 * Vaga sem nenhuma skill identificada tem score 0 (não dá pra afirmar compatibilidade).
 */
export class OverlapMatchCalculator implements MatchCalculator {
  calcular(skillsPerfil: Set<string>, skillsVaga: Set<string>, vagaTitulo = ''): ResultadoMatch {
    if (skillsVaga.size === 0) {
      return { vagaTitulo, score: 0, skillsEmComum: new Set(), skillsFaltando: new Set() };
    }

    const skillsEmComum = new Set([...skillsPerfil].filter((skill) => skillsVaga.has(skill)));
    const skillsFaltando = new Set([...skillsVaga].filter((skill) => !skillsPerfil.has(skill)));
    const score = Math.round((skillsEmComum.size / skillsVaga.size) * 100) / 100;

    return { vagaTitulo, score, skillsEmComum, skillsFaltando };
  }
}

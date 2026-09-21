/**
 * Tokens de injeção para as abstrações de `@org/matching`.
 *
 * O NestJS injeta a implementação concreta (ver `vagas.module.ts`) nesses tokens —
 * o `VagasService` depende só das interfaces (Dependency Inversion Principle),
 * então trocar `KeywordSkillExtractor` por uma extração via embeddings/LLM não
 * exige tocar no service nem no controller.
 */
export const SKILL_EXTRACTOR = Symbol('SKILL_EXTRACTOR');
export const MATCH_CALCULATOR = Symbol('MATCH_CALCULATOR');

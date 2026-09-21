export interface Vaga {
  titulo: string;
  descricao: string;
}

export interface ResultadoMatch {
  vagaTitulo: string;
  score: number; // 0.0 a 1.0
  skillsEmComum: Set<string>;
  skillsFaltando: Set<string>;
}

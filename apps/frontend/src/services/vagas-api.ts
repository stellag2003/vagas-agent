export interface VagaInput {
  titulo: string;
  descricao: string;
}

export interface RankingItem {
  vagaTitulo: string;
  score: number;
  skillsEmComum: string[];
  skillsFaltando: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

/**
 * Único ponto de contato com o backend — a UI não sabe (nem precisa saber)
 * qual é a URL da API ou o formato exato da requisição HTTP.
 */
export async function ranquearVagas(curriculo: string, vagas: VagaInput[]): Promise<RankingItem[]> {
  const resposta = await fetch(`${API_URL}/vagas/ranking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ curriculo, vagas }),
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao calcular o ranking (HTTP ${resposta.status})`);
  }

  return resposta.json();
}

'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { ranquearVagas, type RankingItem } from '../services/vagas-api';

const VAGAS_EXEMPLO = JSON.stringify(
  [
    {
      titulo: 'Desenvolvedor Backend Jr (Python/Django)',
      descricao: 'Buscamos dev Python com Django, PostgreSQL, Git e API REST. Diferencial: Docker e AWS.',
    },
    {
      titulo: 'Frontend React Pleno',
      descricao: 'React, TypeScript, CSS avançado, testes automatizados e CI/CD. Não exige backend.',
    },
  ],
  null,
  2,
);

export default function Index() {
  const [curriculo, setCurriculo] = useState('');
  const [vagasJson, setVagasJson] = useState(VAGAS_EXEMPLO);
  const [resultados, setResultados] = useState<RankingItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro(null);
    setResultados(null);

    let vagas;
    try {
      vagas = JSON.parse(vagasJson);
    } catch {
      setErro('O JSON das vagas está inválido.');
      return;
    }

    setCarregando(true);
    try {
      setResultados(await ranquearVagas(curriculo, vagas));
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado ao calcular o ranking.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className={styles.page}>
      <h1>Agente de Matching de Vagas</h1>
      <p className={styles.subtitle}>
        Cole seu currículo e uma lista de vagas para ver o ranking de compatibilidade.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="curriculo">Currículo</label>
          <textarea
            id="curriculo"
            rows={6}
            value={curriculo}
            onChange={(e) => setCurriculo(e.target.value)}
            placeholder="Cole aqui o texto do seu currículo..."
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="vagas">Vagas (JSON: [{'{ titulo, descricao }'}])</label>
          <textarea
            id="vagas"
            rows={10}
            value={vagasJson}
            onChange={(e) => setVagasJson(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.submit} disabled={carregando || !curriculo.trim()}>
          {carregando ? 'Calculando...' : 'Calcular ranking'}
        </button>

        {erro && <p className={styles.error}>{erro}</p>}
      </form>

      {resultados && (
        <div className={styles.results}>
          {resultados.map((r) => (
            <div key={r.vagaTitulo} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <span>{r.vagaTitulo}</span>
                <span className={styles.score}>{Math.round(r.score * 100)}%</span>
              </div>
              {r.skillsEmComum.length > 0 && (
                <p className={styles.skillLine}>✓ Você já tem: {r.skillsEmComum.join(', ')}</p>
              )}
              {r.skillsFaltando.length > 0 && (
                <p className={styles.skillLine}>✗ Falta: {r.skillsFaltando.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

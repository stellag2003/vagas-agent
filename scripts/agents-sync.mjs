// Copia .agents/agents e .agents/skills para .claude/, onde o Claude Code os carrega.
//
// .agents/ é a fonte da verdade (agnóstica de ferramenta). No Windows com
// core.symlinks=false um symlink .claude -> .agents vira arquivo de texto, então
// copiamos. Rode `npm run agents:sync` depois de editar algo em .agents/.
import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const raiz = join(import.meta.dirname, '..');

for (const pasta of ['agents', 'skills']) {
  const origem = join(raiz, '.agents', pasta);
  if (!existsSync(origem)) continue;
  cpSync(origem, join(raiz, '.claude', pasta), { recursive: true });
  console.log(`.agents/${pasta} -> .claude/${pasta}`);
}

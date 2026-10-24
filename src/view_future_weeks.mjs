import fs from 'node:fs';

const semanas = JSON.parse(fs.readFileSync('cache/todas_semanas.json', 'utf8'));

for (const [num, s] of Object.entries(semanas)) {
  console.log(`\n================ SEMANA ${num} ================`);
  console.log(`🏢 Meio de Semana: ${s.meioSemana.titulo} | Tema: ${s.meioSemana.tema}`);
  console.log(`   Partes (${s.meioSemana.partes.length}): ${s.meioSemana.partes.map(p => p.titulo.substring(0, 30)).join(', ')}`);
  console.log(`🗼 A Sentinela: ${s.fimSemana.titulo} (${s.fimSemana.paragrafos.length} perguntas)`);
}

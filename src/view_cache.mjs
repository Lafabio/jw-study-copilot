import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('cache/semana_2026_43.json', 'utf8'));

console.log('=== PROGRAMAÇÃO REAL EXTRAÍDA DA SEMANA ===');
console.log(`Semana: ${data.meioSemana.titulo} | Tema: ${data.meioSemana.tema}\n`);

console.log('--- PARTES DO MEIO DE SEMANA ---');
for (const p of data.meioSemana.partes) {
  console.log(`${p.id}. ${p.titulo} (${p.duracao})`);
  if (p.perguntas && p.perguntas.length > 0) {
    p.perguntas.forEach(q => console.log(`   ❓ ${q}`));
  }
}

console.log('\n--- A SENTINELA (FIM DE SEMANA) ---');
console.log(`Artigo: ${data.fimSemana.titulo}`);
console.log(`Tema: ${data.fimSemana.tema}\n`);
for (const p of data.fimSemana.paragrafos.slice(0, 5)) {
  console.log(`Parágrafo ${p.numero}: ${p.pergunta}`);
  if (p.textosLidos && p.textosLidos.length > 0) {
    console.log(`   📖 Textos para ler: ${p.textosLidos.join(', ')}`);
  }
}

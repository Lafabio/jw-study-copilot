import fs from 'node:fs';

const html = fs.readFileSync('temp_mwb_43.html', 'utf8');

// Vamos ver os blocos e títulos
const headers = [...html.matchAll(/<(h[1-5])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => {
  return `${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`;
});

console.log('--- CABEÇALHOS ---');
console.log(headers.join('\n'));

// Vamos ver todas as classes principais e tags p
const pMatches = [...html.matchAll(/<p[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/p>/gi)].slice(0, 25).map(m => {
  return `[${m[1]}] ${m[2].replace(/<[^>]+>/g, '').trim()}`;
});

console.log('\n--- AMOSTRA DE PARÁGRAFOS ---');
console.log(pMatches.join('\n'));

import fs from 'node:fs';

const html = fs.readFileSync('temp_sentinela_full.html', 'utf8');

// Vamos ver a estrutura de um parágrafo completo no HTML
const sample = html.match(/<div class="bodyTxt"[\s\S]*?<\/div>\s*<\/article>/i) || html.match(/<article[\s\S]*?<\/article>/i);
if (sample) {
  // Pega os primeiros 3000 caracteres do artigo
  console.log(sample[0].substring(0, 3500));
}

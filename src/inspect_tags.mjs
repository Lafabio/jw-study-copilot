import fs from 'node:fs';

const article = fs.readFileSync('temp_article_body.html', 'utf8');

// Vamos ver as divs de seção e seus filhos
// No WOL cada parte tem uma estrutura muito limpa. Vamos extrair parágrafo por parágrafo com as classes
const regex = /<(h[1-4]|p|li|ul|ol)[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/\1>/gi;
let m;
let count = 0;
while ((m = regex.exec(article)) !== null && count < 60) {
  const tag = m[1];
  const cls = m[2];
  const text = m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text) {
    console.log(`[${tag}.${cls}] ${text}`);
    count++;
  }
}

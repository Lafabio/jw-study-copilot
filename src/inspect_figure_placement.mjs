import fs from 'node:fs';

const sHtml = fs.readFileSync('temp_sentinela_full.html', 'utf8');

// Extrai figuras com o contexto ao redor
const regex = /<figure[\s\S]*?<\/figure>/gi;
let m;
while ((m = regex.exec(sHtml)) !== null) {
  const fig = m[0];
  const srcMatch = fig.match(/src="([^"]+)"/i);
  const altMatch = fig.match(/alt="([^"]*)"/i);
  const capMatch = fig.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  
  const src = srcMatch ? 'https://wol.jw.org' + srcMatch[1] : '';
  const alt = altMatch ? altMatch[1].trim() : '';
  const caption = capMatch ? capMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : alt;

  // Encontra qual parágrafo está antes ou depois desta figura
  const pos = m.index;
  const before = sHtml.substring(Math.max(0, pos - 500), pos);
  const after = sHtml.substring(pos, Math.min(sHtml.length, pos + 500));

  const pBeforeMatch = [...before.matchAll(/data-pnum="([0-9]+)"|class="qu"[^>]*>[\s\S]*?([0-9]+)\./gi)];
  const pAfterMatch = [...after.matchAll(/data-pnum="([0-9]+)"|class="qu"[^>]*>[\s\S]*?([0-9]+)\./gi)];

  console.log(`\nIMG: ${src}`);
  console.log(`CAP: ${caption}`);
  console.log(`P antes:`, pBeforeMatch.map(x => x[1] || x[2]));
  console.log(`P depois:`, pAfterMatch.map(x => x[1] || x[2]));
}

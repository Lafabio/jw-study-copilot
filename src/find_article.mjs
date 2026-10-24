import fs from 'node:fs';

const html = fs.readFileSync('temp_mwb_43.html', 'utf8');

// Vamos ver o conteúdo do artigo (geralmente dentro de <article> ou <div class="articleBody" ou <div id="article">)
const articleMatch = html.match(/<article[\s\S]*?<\/article>/i) || html.match(/<div[^>]*class="[^"]*articleBody[^"]*"[\s\S]*?<\/div>/i);

if (articleMatch) {
  console.log('Article encontrado! Tamanho:', articleMatch[0].length);
  // Vamos salvar apenas o article
  fs.writeFileSync('temp_article_body.html', articleMatch[0], 'utf8');
} else {
  // Procura div com id="article" ou classe "bodyTxt"
  const bodyMatch = html.match(/<div id="article"[\s\S]*?<\/article>/i) || html.match(/<div class="bodyTxt"[\s\S]*?<\/div>/i);
  console.log('Body match:', bodyMatch ? bodyMatch[0].length : 'não encontrado');
}

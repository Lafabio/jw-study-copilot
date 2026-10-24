import fs from 'node:fs';

const article = fs.readFileSync('temp_article_body.html', 'utf8');
const idx9 = article.indexOf('9. Estudo bíblico de congregação');
const idxFim = article.indexOf('Comentários finais');

console.log(article.substring(idx9, idxFim));

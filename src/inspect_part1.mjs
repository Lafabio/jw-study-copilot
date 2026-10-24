import fs from 'node:fs';

const article = fs.readFileSync('temp_article_body.html', 'utf8');

// Pega da parte 1 até a parte 2
const idx1 = article.indexOf('1. Ter esperança é o segredo para o contentamento');
const idx2 = article.indexOf('2. Joias espirituais');

console.log('--- CONTEÚDO PARTE 1 ---');
console.log(article.substring(idx1, idx2).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

// Pega da parte 2 até a parte 3
const idx3 = article.indexOf('3. Leitura da Bíblia');
console.log('\n--- CONTEÚDO PARTE 2 ---');
console.log(article.substring(idx2, idx3).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

// Pega da parte 8 até a parte 9
const idx8 = article.indexOf('8. ‘Partilhe com outros o que você tem’');
const idx9 = article.indexOf('9. Estudo bíblico de congregação');
console.log('\n--- CONTEÚDO PARTE 8 ---');
console.log(article.substring(idx8, idx9).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));

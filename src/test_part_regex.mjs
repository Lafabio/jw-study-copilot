import fs from 'node:fs';

const html = fs.readFileSync('temp_mwb_43.html', 'utf8');

const regex = /<h3[^>]*>(?:<strong[^>]*>)?([0-9]+\.[\s\S]*?)(?:<\/strong>)?<\/h3>([\s\S]*?)(?=<h3|<h2|<article|$)/gi;
let m;
let count = 0;
while ((m = regex.exec(html)) !== null) {
  const tit = m[1].replace(/<[^>]+>/g, '').trim();
  const body = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Parte: ${tit}`);
  console.log(`   Texto: ${body.substring(0, 80)}...`);
  count++;
}
console.log('Total de partes encontradas:', count);

import fs from 'node:fs';

const sHtml = fs.readFileSync('temp_sentinela_full.html', 'utf8');
const mHtml = fs.readFileSync('temp_mwb_43.html', 'utf8');

console.log('=== IMAGENS NA SENTINELA ===');
const sImgs = [...sHtml.matchAll(/<figure[\s\S]*?<\/figure>|<img[^>]+>/gi)].map(m => m[0]);
console.log('Total encontrados:', sImgs.length);
sImgs.forEach((img, i) => {
  console.log(`\n[Figura ${i + 1}]`);
  console.log(img.substring(0, 300));
});

console.log('\n=== IMAGENS NO MWB (APOSTILA) ===');
const mImgs = [...mHtml.matchAll(/<figure[\s\S]*?<\/figure>|<img[^>]+>/gi)].map(m => m[0]);
console.log('Total encontrados:', mImgs.length);
mImgs.forEach((img, i) => {
  console.log(`\n[Figura ${i + 1}]`);
  console.log(img.substring(0, 300));
});

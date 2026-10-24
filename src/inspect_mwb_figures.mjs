import fs from 'node:fs';

const mHtml = fs.readFileSync('temp_mwb_43.html', 'utf8');

const regex = /<figure[\s\S]*?<\/figure>/gi;
let m;
while ((m = regex.exec(mHtml)) !== null) {
  const fig = m[0];
  const srcMatch = fig.match(/src="([^"]+)"/i);
  const altMatch = fig.match(/alt="([^"]*)"/i);
  const capMatch = fig.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  
  const src = srcMatch ? 'https://wol.jw.org' + srcMatch[1] : '';
  const alt = altMatch ? altMatch[1].trim() : '';
  const caption = capMatch ? capMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : alt;

  console.log(`\nMWB IMG: ${src}`);
  console.log(`ALT: ${alt}`);
  console.log(`CAP: ${caption}`);
}

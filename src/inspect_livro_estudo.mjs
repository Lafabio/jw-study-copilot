import fs from 'node:fs';

async function run() {
  const res = await fetch('https://wol.jw.org/pt/wol/d/r5/lp-t/1102025913');
  const html = await res.text();
  fs.writeFileSync('temp_wcg13.html', html, 'utf8');

  // Let's inspect headings, paragraphs, and questions in wcg 13
  const regexP = /<p id="p(\d+)"[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  let count = 0;
  while ((match = regexP.exec(html)) !== null && count < 30) {
    const pid = match[1];
    const text = match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`p${pid}: ${text.substring(0, 120)}...`);
    count++;
  }
}

run();

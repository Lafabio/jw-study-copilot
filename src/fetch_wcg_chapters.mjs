import fs from 'node:fs';

async function main() {
  const res = await fetch('https://wol.jw.org/pt/wol/publication/r5/lp-t/wcg');
  const text = await res.text();
  fs.writeFileSync('temp_wcg_toc.html', text, 'utf8');

  const regex = /href="(\/pt\/wol\/d\/r5\/lp-t\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  const list = [];
  while ((m = regex.exec(text)) !== null) {
    const title = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (title.length > 0) {
      list.push({ url: 'https://wol.jw.org' + m[1], title });
    }
  }
  console.log('Chapters found:', list.length);
  list.forEach((c, i) => console.log(i + ':', c.title, '->', c.url));
}

main().catch(console.error);

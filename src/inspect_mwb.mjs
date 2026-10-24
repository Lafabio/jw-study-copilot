import fs from 'node:fs';

async function inspectMwb() {
  const url = 'https://wol.jw.org/pt/wol/meetings/r5/lp-t/2026/43';
  const res = await fetch(url);
  const html = await res.text();
  
  // Extrai todos os links do WOL
  const re = /href="(\/[a-z]{2}\/wol\/d\/r5\/lp-t\/[0-9]+)"/g;
  const hrefs = [];
  let match;
  while ((match = re.exec(html)) !== null) {
    if (!hrefs.includes(match[1])) hrefs.push(match[1]);
  }
  console.log('Links na semana 43:', hrefs);

  if (hrefs.length > 0) {
    const artRes = await fetch('https://wol.jw.org' + hrefs[0]);
    const artHtml = await artRes.text();
    fs.writeFileSync('temp_mwb_43.html', artHtml, 'utf8');
    console.log('Salvo temp_mwb_43.html com tamanho:', artHtml.length);
  }
}

inspectMwb();

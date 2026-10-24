import fs from 'node:fs';

async function parseSentinelaFull() {
  const r = await fetch('https://wol.jw.org/pt/wol/d/r5/lp-t/2026522');
  const html = await r.text();
  fs.writeFileSync('temp_sentinela_full.html', html, 'utf8');

  // Título e Tema
  const titulo = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  const tema = html.match(/<p[^>]*class="[^"]*themeScrp[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  console.log('Título:', titulo);
  console.log('Tema:', tema);

  // Cânticos
  const canticos = [...html.matchAll(/<p[^>]*class="[^"]*themeGroup[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Cânticos:', canticos);

  // Parágrafos e perguntas
  // No WOL, os parágrafos vêm com data-pid e as perguntas têm class="qu"
  const pList = [...html.matchAll(/<p[^>]*id="p(\d+)"[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => {
    return {
      pid: m[1],
      cls: m[2],
      text: m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    };
  });

  console.log('Total de tags <p>:', pList.length);
  // Identifica quais são perguntas (cls tem "qu") e quais são parágrafos de texto (cls tem "sb" ou inicia com número)
  const perguntas = pList.filter(p => p.cls.includes('qu'));
  console.log('Total de perguntas:', perguntas.length);
  perguntas.slice(0, 8).forEach(q => console.log(' ->', q.text));
}

parseSentinelaFull();
async function inspectSentinela() {
  const r = await fetch('https://wol.jw.org/pt/wol/d/r5/lp-t/2026522');
  const t = await r.text();
  console.log('Tamanho da Sentinela:', t.length);

  const titleMatch = t.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  console.log('Título:', titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Não encontrado');

  // Parágrafos com numeração (ex: 1, 2, 3, 4-5) e perguntas
  // No WOL, perguntas de parágrafo vêm com classes especiais ou no rodapé do bloco
  const questions = [...t.matchAll(/<p[^>]*class="[^"]*(?:qu|question)[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Total de perguntas encontradas:', questions.length);
  console.log('Primeiras 5 perguntas:', questions.slice(0, 5));
}

inspectSentinela();
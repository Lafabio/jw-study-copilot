async function inspectArticle(path, label) {
  const url = 'https://wol.jw.org' + path;
  console.log(`\n=================== ${label} ===================`);
  console.log(`URL: ${url}`);
  const res = await fetch(url);
  const html = await res.text();
  console.log('Tamanho HTML:', html.length);

  // Extrai título do artigo
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  console.log('Título H1:', titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Não encontrado');

  // Extrai subtítulos ou partes
  const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Subtítulos H2:', h2s);

  // Extrai perguntas (parágrafos com classe 'qu' ou terminando em '?')
  const perguntas = [...html.matchAll(/<p[^>]+class="[^"]*qu[^"]*"[^>]*>(.*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log(`Perguntas encontradas (${perguntas.length}):`, perguntas.slice(0, 5));
}

async function run() {
  await inspectArticle('/pt/wol/d/r5/lp-t/202024321', 'VIDA E MINISTÉRIO');
  await inspectArticle('/pt/wol/d/r5/lp-t/2024442', 'A SENTINELA');
}

run();

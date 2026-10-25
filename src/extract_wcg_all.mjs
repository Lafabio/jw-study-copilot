import fs from 'node:fs';

const urls = {
  13: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025913',
  14: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025914',
  15: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025915',
  16: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025916',
  17: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025917'
};

function parseWcgChapter(html, capNum) {
  const contextMatch = html.match(/<p class="contextTtl[^>]*>([\s\S]*?)<\/p>/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  let personagem = contextMatch ? contextMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  personagem = personagem.replace(/^\d+\s*/, '').trim();
  
  const titulo = h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  const bibleList = [];
  const bibleSectionMatch = html.match(/<h3[^>]*><strong>Leia o relato na Bíblia:<\/strong><\/h3>[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (bibleSectionMatch) {
    const liMatches = bibleSectionMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/gi);
    for (const li of liMatches) {
      bibleList.push(li[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
  }

  const articleBodyIdx = html.indexOf('class="bodyTxt"');
  const readBibleIdx = html.indexOf('Leia o relato na Bíblia:');
  const narrativeHtml = html.substring(articleBodyIdx, readBibleIdx !== -1 ? readBibleIdx : undefined);

  const narrativeParagraphs = [];
  const pRegex = /<p id="p(\d+)"[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(narrativeHtml)) !== null) {
    const text = pMatch[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text && !text.startsWith('Imagem ') && !text.includes('class="pageNum"') && !text.includes('alt="')) {
      // Filter out duplicate or pull quotes
      if (!narrativeParagraphs.includes(text)) {
        narrativeParagraphs.push(text);
      }
    }
  }

  const questions = [];
  
  // 1. "Para considerar"
  const paraConsiderarMatch = html.match(/Para considerar:[\s\S]*?<p id="p\d+"[^>]*>([\s\S]*?)<\/p>/i);
  if (paraConsiderarMatch) {
    questions.push({
      secao: 'Para considerar',
      pergunta: paraConsiderarMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    });
  }

  // 2. "Analise mais a fundo"
  const analiseSection = html.match(/Analise mais a fundo[\s\S]*?<ol[^>]*>([\s\S]*?)<\/ol>/i);
  if (analiseSection) {
    const liMatches = analiseSection[1].matchAll(/<li>[\s\S]*?<p id="p\d+"[^>]*>([\s\S]*?)<\/p>/gi);
    for (const li of liMatches) {
      const qText = li[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      questions.push({
        secao: 'Analise mais a fundo',
        pergunta: qText
      });
    }
  }

  // 3. Meditações / Perguntas adicionais
  const afterOlIdx = html.indexOf('</ol>');
  if (afterOlIdx !== -1) {
    const restHtml = html.substring(afterOlIdx);
    const textareaRegex = /<p id="p(\d+)"[^>]*>([\s\S]*?)<\/p>\s*<div class="gen-field"/gi;
    let tMatch;
    while ((tMatch = textareaRegex.exec(restHtml)) !== null) {
      const qText = tMatch[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (qText && !qText.startsWith('Imagem ') && !questions.some(q => q.pergunta === qText)) {
        questions.push({
          secao: 'Pense e medite',
          pergunta: qText
        });
      }
    }
  }

  return {
    publicacao: 'Coragem (wcg)',
    capitulo: capNum,
    personagem,
    titulo,
    leituraBiblia: bibleList,
    paragrafos: narrativeParagraphs,
    perguntas: questions
  };
}

async function main() {
  const chapters = {};
  for (const [cap, url] of Object.entries(urls)) {
    console.log(`Buscando Capítulo ${cap}...`);
    const res = await fetch(url);
    const html = await res.text();
    chapters[cap] = parseWcgChapter(html, Number(cap));
    console.log(`✅ Cap ${cap} carregado: ${chapters[cap].personagem} - "${chapters[cap].titulo}" (${chapters[cap].perguntas.length} perguntas)`);
  }

  // Salva no cache local de livros
  fs.writeFileSync('cache/livro_coragem_caps.json', JSON.stringify(chapters, null, 2), 'utf8');
  console.log('✅ Salvo em cache/livro_coragem_caps.json');

  // Mapeia para as semanas
  // Semana 43 -> Cap 13
  // Semana 44 -> Cap 14
  // Semana 45 -> Cap 15
  // Semana 46 -> Cap 16
  // Semana 47 -> Cap 17
  const semanaCapMap = {
    43: 13,
    44: 14,
    45: 15,
    46: 16,
    47: 17
  };

  const todasFull = JSON.parse(fs.readFileSync('cache/todas_semanas_full.json', 'utf8'));

  for (const [semana, capNum] of Object.entries(semanaCapMap)) {
    if (todasFull[semana]?.meioSemana?.partes) {
      const partes = todasFull[semana].meioSemana.partes;
      const estudoIdx = partes.findIndex(p => p.titulo && p.titulo.toLowerCase().includes('estudo b'));
      if (estudoIdx !== -1) {
        const capData = chapters[capNum];
        partes[estudoIdx].livroEstudo = capData;
        partes[estudoIdx].temPerguntas = true;
        partes[estudoIdx].perguntas = capData.perguntas.map(q => q.pergunta);
        console.log(`✅ Semana ${semana} atualizada com Cap ${capNum}`);
      }
    }
  }

  fs.writeFileSync('cache/todas_semanas_full.json', JSON.stringify(todasFull, null, 2), 'utf8');
  console.log('✅ cache/todas_semanas_full.json atualizado com sucesso!');

  // Atualiza cache/todas_semanas.json também
  if (fs.existsSync('cache/todas_semanas.json')) {
    const todasCompact = JSON.parse(fs.readFileSync('cache/todas_semanas.json', 'utf8'));
    for (const [semana, capNum] of Object.entries(semanaCapMap)) {
      if (todasCompact[semana]?.meioSemana?.partes) {
        const partes = todasCompact[semana].meioSemana.partes;
        const estudoIdx = partes.findIndex(p => p.titulo && p.titulo.toLowerCase().includes('estudo b'));
        if (estudoIdx !== -1) {
          const capData = chapters[capNum];
          partes[estudoIdx].livroEstudo = capData;
          partes[estudoIdx].temPerguntas = true;
          partes[estudoIdx].perguntas = capData.perguntas.map(q => q.pergunta);
        }
      }
    }
    fs.writeFileSync('cache/todas_semanas.json', JSON.stringify(todasCompact, null, 2), 'utf8');
    console.log('✅ cache/todas_semanas.json atualizado!');
  }
}

main().catch(console.error);

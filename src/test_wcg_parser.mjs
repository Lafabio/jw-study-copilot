import fs from 'node:fs';

const urls = {
  13: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025913',
  14: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025914',
  15: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025915',
  16: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025916',
  17: 'https://wol.jw.org/pt/wol/d/r5/lp-t/1102025917'
};

function parseWcgChapter(html, capNum) {
  // Extract context title (character) and main title
  const contextMatch = html.match(/<p class="contextTtl[^>]*>([\s\S]*?)<\/p>/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  let personagem = contextMatch ? contextMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  personagem = personagem.replace(/^\d+\s*/, '').trim();
  
  const titulo = h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  // Extract Bible readings
  const bibleList = [];
  const bibleSectionMatch = html.match(/<h3[^>]*><strong>Leia o relato na Bíblia:<\/strong><\/h3>[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
  if (bibleSectionMatch) {
    const liMatches = bibleSectionMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/gi);
    for (const li of liMatches) {
      bibleList.push(li[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
  }

  // Extract paragraphs of narrative (before "Leia o relato na Bíblia")
  const articleBodyIdx = html.indexOf('class="bodyTxt"');
  const readBibleIdx = html.indexOf('Leia o relato na Bíblia:');
  const narrativeHtml = html.substring(articleBodyIdx, readBibleIdx !== -1 ? readBibleIdx : undefined);

  const narrativeParagraphs = [];
  const pRegex = /<p id="p(\d+)"[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(narrativeHtml)) !== null) {
    const text = pMatch[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text && !text.startsWith('Imagem ') && !text.includes('class="pageNum"')) {
      narrativeParagraphs.push(text);
    }
  }

  // Extract all questions
  // In wcg, questions have `<div class="gen-field"` following them, or are in `<ol>` in "Analise mais a fundo", or under "Pense e medite"
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

  // 3. Meditações / Perguntas adicionais com textarea
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
    capitulo: capNum,
    personagem,
    titulo,
    leituraBiblia: bibleList,
    paragrafos: narrativeParagraphs,
    perguntas: questions
  };
}

async function testAll() {
  for (const [cap, url] of Object.entries(urls)) {
    console.log(`Fetching Cap ${cap}: ${url}`);
    const res = await fetch(url);
    const html = await res.text();
    const data = parseWcgChapter(html, Number(cap));
    console.log(`Cap ${cap}: ${data.personagem} - "${data.titulo}"`);
    console.log(`  Parágrafos: ${data.paragrafos.length}`);
    console.log(`  Perguntas: ${data.perguntas.length}`);
    data.perguntas.forEach((q, i) => console.log(`    ${i+1}. [${q.secao}] ${q.pergunta.substring(0, 80)}...`));
  }
}

testAll().catch(console.error);

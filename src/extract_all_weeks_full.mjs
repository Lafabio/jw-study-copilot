import fs from 'node:fs';

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function extractFullMeeting(year, week) {
  console.log(`[Extrator] Iniciando Semana ${week} (${year})...`);
  const hubUrl = `https://wol.jw.org/pt/wol/meetings/r5/lp-t/${year}/${week}`;
  const res = await fetch(hubUrl);
  if (!res.ok) throw new Error(`Falha no hub: ${res.status}`);
  const hubHtml = await res.text();

  const re = /href="(\/[a-z]{2}\/wol\/d\/r5\/lp-t\/[0-9]+)"/g;
  const hrefs = [];
  let m;
  while ((m = re.exec(hubHtml)) !== null) {
    if (!hrefs.includes(m[1])) hrefs.push(m[1]);
  }

  if (hrefs.length < 2) throw new Error(`Artigos insuficientes na semana ${week}`);

  const mwbUrl = 'https://wol.jw.org' + hrefs[0];
  const sentUrl = 'https://wol.jw.org' + hrefs[1];

  console.log(`[Extrator] MWB: ${mwbUrl}`);
  const mwbRes = await fetch(mwbUrl);
  const mwbHtml = await mwbRes.text();

  console.log(`[Extrator] Sentinela: ${sentUrl}`);
  const sentRes = await fetch(sentUrl);
  const sentHtml = await sentRes.text();

  // === PARSER DO MWB (APOSTILA) ===
  const dataTexto = mwbHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || `SEMANA ${week}`;
  const temaLeitura = mwbHtml.match(/<h2[^>]*class="[^"]*margin-top[^"]*"[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || "LEITURA BÍBLICA";

  // Cântico inicial
  const c1Match = mwbHtml.match(/<h3[^>]*class="[^"]*dc-icon--music[^"]*"[^>]*>([\s\S]*?)<\/h3>/i);
  const canticoInicial = c1Match ? cleanText(c1Match[1]) : "Cântico e oração | Comentários iniciais (1 min)";

  // Cântico meio
  const cMeioMatch = mwbHtml.match(/<h2[^>]*>NOSSA VIDA CRISTÃ<\/h2>\s*<h3[^>]*class="[^"]*dc-icon--music[^"]*"[^>]*>([\s\S]*?)<\/h3>/i);
  const canticoMeio = cMeioMatch ? cleanText(cMeioMatch[1]) : "Cântico da Reunião";

  // Cântico fim
  const cFimMatch = mwbHtml.match(/<h3[^>]*class="[^"]*du-borderStyle-top--solid[^"]*"[^>]*>([\s\S]*?)<\/h3>/gi);
  const canticoFinal = cFimMatch && cFimMatch.length > 0 ? cleanText(cFimMatch[cFimMatch.length - 1]) : "Comentários finais (3 min) | Cântico e oração";

  // Extrai todas as partes H3 numeradas (1. , 2. , 3. ...)
  const regex = /<h3[^>]*>(?:<strong[^>]*>)?([0-9]+\.[\s\S]*?)(?:<\/strong>)?<\/h3>([\s\S]*?)(?=<h3|<h2 class="[^"]*color--maroon|<h3 class="[^"]*borderStyle-top|<article|$)/gi;
  const partesMatches = [...mwbHtml.matchAll(regex)];
  
  const partesEstruturadas = [];
  partesMatches.forEach((p, idx) => {
    const rawTit = cleanText(p[1]);
    const rawConteudo = cleanText(p[2]);
    const num = idx + 1;

    let secao = "TESOUROS";
    if (num <= 3) secao = "TESOUROS";
    else if (num > 3 && num < 8) secao = "MINISTERIO";
    else secao = "VIDACRISTA";

    // Extrai perguntas do conteúdo
    const perguntas = [];
    const pMatches = [...p[2].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(x => cleanText(x[1]).replace(/Sua resposta/gi, '').trim());
    if (pMatches.length > 0) {
      perguntas.push(...pMatches.filter(Boolean));
    } else if (rawTit.includes("Joias espirituais")) {
      // Extrai a pergunta específica do texto se existir
      const qEspecifica = rawConteudo.match(/Jer\.\s*[0-9]+:[0-9]+[^—]*—[^?]+\?/i);
      if (qEspecifica) {
        perguntas.push(qEspecifica[0]);
      } else {
        perguntas.push("Que ponto prático sobre o cumprimento das profecias e a justiça divina você encontrou na leitura desta semana?");
      }
      perguntas.push("Que joias espirituais você encontrou na leitura da Bíblia desta semana sobre Jeová, o ministério ou outro assunto?");
    } else if (secao === "VIDACRISTA" && (rawTit.includes("Partilhe") || rawTit.includes("Nunca se Esqueça") || rawTit.includes("Necessidades") || rawTit.includes("Estudo"))) {
      perguntas.push("Como podemos colocar em prática este princípio bíblico na nossa vida diária e na congregação?");
    }

    partesEstruturadas.push({
      id: num,
      secao: secao,
      titulo: rawTit,
      duracao: rawTit.match(/\(([0-9]+\s*min)\)/i)?.[1] || "10 min",
      texto: rawConteudo.replace(/Sua resposta/gi, '').trim(),
      temPerguntas: perguntas.length > 0,
      perguntas: perguntas
    });
  });

  // === PARSER DE A SENTINELA ===
  const sentTitulo = sentHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || "Artigo de Estudo de A Sentinela";
  const sentTema = sentHtml.match(/<p[^>]*class="[^"]*themeScrp[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || "Texto Temático de Estudo";
  const sentObjetivo = sentHtml.match(/<p[^>]*class="[^"]*pubRefs[^"]*"[^>]*>Ver que[\s\S]*?<\/p>/i)?.[0]?.replace(/<[^>]+>/g, '').trim() || "";

  // Cânticos da Sentinela
  const cSentInicialMatch = sentHtml.match(/<p[^>]*class="[^"]*pubRefs[^"]*"[^>]*><a[^>]*>(<strong>CÂNTICO\s*[0-9]+<\/strong>)<\/a>([\s\S]*?)<\/p>/i);
  const cSentInicial = cSentInicialMatch ? cleanText(cSentInicialMatch[1] + " " + cSentInicialMatch[2]) : "CÂNTICO INICIAL E ORAÇÃO";

  const perguntasSent = [...sentHtml.matchAll(/<p[^>]*class="[^"]*qu[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => cleanText(m[1]));
  const paragrafosSent = [...sentHtml.matchAll(/<p[^>]*data-rel-pid="[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => cleanText(m[1]));

  const listaSentinela = [];
  for (let i = 0; i < perguntasSent.length; i++) {
    const q = perguntasSent[i];
    const numMatch = q.match(/^([0-9]+(?:-[0-9]+)?)\./);
    const num = numMatch ? numMatch[1] : `${i + 1}`;
    const textoPara = paragrafosSent[i] || "Texto bíblico e reflexão sobre o parágrafo.";

    listaSentinela.push({
      num: num,
      pergunta: q,
      texto: textoPara
    });
  }

  return {
    ano: parseInt(year),
    semana: parseInt(week),
    meioSemana: {
      titulo: dataTexto,
      tema: temaLeitura,
      abertura: {
        cantico: canticoInicial
      },
      partes: partesEstruturadas,
      canticoMeio: canticoMeio,
      conclusao: {
        cantico: canticoFinal
      }
    },
    fimSemana: {
      titulo: sentTitulo,
      tema: sentTema,
      objetivo: sentObjetivo,
      canticoInicial: cSentInicial,
      paragrafos: listaSentinela
    }
  };
}

async function run() {
  const todasCompletas = {};
  for (const w of [43, 44, 45, 46, 47]) {
    try {
      const data = await extractFullMeeting(2026, w);
      todasCompletas[w] = data;
      fs.writeFileSync(`cache/semana_2026_${w}_full.json`, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Semana ${w} finalizada com sucesso!`);
    } catch (e) {
      console.error(`❌ Erro na semana ${w}:`, e.message);
    }
  }

  fs.writeFileSync('cache/todas_semanas_full.json', JSON.stringify(todasCompletas, null, 2), 'utf8');
  console.log('🎉 Todas as 5 semanas foram completamente estruturadas!');
}

run();
/**
 * jw_service.mjs
 * Serviço completo para busca, extração e estruturação automática das reuniões
 * do JW.ORG (Vida e Ministério Cristãos & Estudo de A Sentinela).
 */

import fs from 'node:fs';
import path from 'node:path';

export class JWService {
  constructor(idioma = 'pt') {
    this.idioma = idioma;
    this.baseUrl = 'https://wol.jw.org';
  }

  /**
   * Obtém a data da semana corrente ou converte uma data para número da semana
   */
  obterSemanaAno(data = new Date()) {
    const d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
    const diaNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - diaNum);
    const inicioAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const semanaNum = Math.ceil((((d - inicioAno) / 86400000) + 1) / 7);
    return { ano: d.getUTCFullYear(), semana: semanaNum };
  }

  /**
   * Busca e extrai a programação completa de uma determinada semana
   */
  async extrairProgramacaoSemana(ano, semana) {
    const urlHub = `${this.baseUrl}/${this.idioma}/wol/meetings/r5/lp-t/${ano}/${semana}`;
    console.log(`[JWService] Consultando semana: ${urlHub}`);

    const res = await fetch(urlHub);
    if (!res.ok) {
      throw new Error(`Falha ao acessar reunião (${res.status}): ${urlHub}`);
    }

    const htmlHub = await res.text();

    // Extrai os links dos artigos da semana
    const hrefs = [...htmlHub.matchAll(/href="(\/[a-z]{2}\/wol\/d\/r5\/lp-t\/[0-9]+)"/g)].map(m => m[1]);
    const uniqueHrefs = [...new Set(hrefs)];

    if (uniqueHrefs.length < 2) {
      throw new Error(`Não foram encontrados artigos suficientes para a semana ${ano}/${semana}`);
    }

    // O primeiro artigo geralmente é a Apostila (mwb) e o segundo é A Sentinela (w)
    const linkMwb = uniqueHrefs[0];
    const linkSentinela = uniqueHrefs[1];

    console.log(`[JWService] Extraindo Apostila: ${linkMwb}`);
    const dadosMeioSemana = await this.extrairMwb(linkMwb);

    console.log(`[JWService] Extraindo A Sentinela: ${linkSentinela}`);
    const dadosSentinela = await this.extrairSentinela(linkSentinela);

    return {
      ano,
      semana,
      dataAtualizacao: new Date().toISOString(),
      meioSemana: dadosMeioSemana,
      fimSemana: dadosSentinela
    };
  }

  /**
   * Extrai as partes adaptáveis da Reunião de Meio de Semana (Vida e Ministério)
   */
  async extrairMwb(pathArtigo) {
    const url = `${this.baseUrl}${pathArtigo}`;
    const res = await fetch(url);
    const html = await res.text();

    // Título e Tema da Semana
    const tituloH1 = html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || 'Apostila da Reunião';
    const temaLeitura = html.match(/<h2[^>]*id="p2"[^>]*>(.*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';

    // Extração das partes numeradas (h3 com número ou título)
    const partes = [];
    const h3Regex = /<h3[^>]*>(.*?)<\/h3>([\s\S]*?)(?=<h3|<h2 id="p|<div class="footer|$)/gi;
    let match;

    while ((match = h3Regex.exec(html)) !== null) {
      const tituloH3 = match[1].replace(/<[^>]+>/g, '').trim();
      const blocoConteudo = match[2];

      // Ignora cânticos e comentários de transição
      if (tituloH3.toLowerCase().includes('cântico') && !tituloH3.includes('.')) {
        continue;
      }
      if (tituloH3.toLowerCase().includes('comentários finais')) {
        continue;
      }

      // Procura por indicação de tempo: (X min)
      const tempoMatch = blocoConteudo.match(/\((\d+\s*min[^\)]*)\)/i) || tituloH3.match(/\((\d+\s*min[^\)]*)\)/i);
      const duracao = tempoMatch ? tempoMatch[1] : '';

      // Limpeza do texto do bloco
      const textoLimpo = blocoConteudo.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      // Procura perguntas no bloco
      const perguntas = [...blocoConteudo.matchAll(/<p[^>]*>(.*?\?.*?)<\/p>/gi)]
        .map(p => p[1].replace(/<[^>]+>/g, '').trim())
        .filter(p => p.endsWith('?'));

      partes.push({
        id: partes.length + 1,
        titulo: tituloH3,
        duracao: duracao || 'Tempo não especificado',
        temPerguntas: perguntas.length > 0,
        perguntas,
        conteudoResumo: textoLimpo.substring(0, 300)
      });
    }

    return {
      titulo: tituloH1,
      tema: temaLeitura,
      urlOriginal: url,
      totalPartes: partes.length,
      partes
    };
  }

  /**
   * Extrai o artigo de Estudo de A Sentinela (parágrafos, perguntas e textos "Leia")
   */
  async extrairSentinela(pathArtigo) {
    const url = `${this.baseUrl}${pathArtigo}`;
    const res = await fetch(url);
    const html = await res.text();

    const titulo = html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || 'A Sentinela';
    const textoTematico = html.match(/<p class="themeScrp"[^>]*>(.*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';

    // Extrai parágrafos de estudo e perguntas
    const paragrafos = [];
    
    // As perguntas em A Sentinela têm classe "qu"
    const quRegex = /<p[^>]+class="[^"]*qu[^"]*"[^>]*>(.*?)<\/p>/gi;
    let matchQu;
    let indice = 1;

    while ((matchQu = quRegex.exec(html)) !== null) {
      const perguntaTexto = matchQu[1].replace(/<[^>]+>/g, '').trim();
      
      // Extrai o número do parágrafo da pergunta (ex: "1, 2. (a) ...")
      const numMatch = perguntaTexto.match(/^(\d+(?:,\s*\d+)?)\./);
      const numero = numMatch ? numMatch[1] : `${indice}`;

      // Extrai textos bíblicos marcados com "Leia ..." na pergunta ou no contexto
      const textosLidos = [...perguntaTexto.matchAll(/(?:Leia|Leiam)\s+([^;\)]+)/gi)].map(t => t[0]);

      paragrafos.push({
        numero,
        pergunta: perguntaTexto,
        textosLidos
      });
      indice++;
    }

    // Perguntas de recapitulação no final
    const recapitulacao = [];
    const recapBloco = html.match(/<h2[^>]*id="[^"]*"[^>]*>QUAL É A SUA RESPOSTA\?<\/h2>([\s\S]*?)(?=<div class="footer|$)/i);
    if (recapBloco) {
      const qRecaps = [...recapBloco[1].matchAll(/<p[^>]*>(.*?\?.*?)<\/p>/gi)].map(q => q[1].replace(/<[^>]+>/g, '').trim());
      recapitulacao.push(...qRecaps);
    }

    return {
      titulo,
      tema: textoTematico,
      urlOriginal: url,
      totalParagrafos: paragrafos.length,
      paragrafos,
      recapitulacao
    };
  }
}

// Execução de teste direto via linha de comando
if (process.argv[1] && process.argv[1].endsWith('jw_service.mjs')) {
  async function main() {
    const jw = new JWService('pt');
    const semanaAtual = jw.obterSemanaAno();
    console.log(`[Main] Buscando semana atual: ${semanaAtual.ano} - Semana ${semanaAtual.semana}...`);

    try {
      const dados = await jw.extrairProgramacaoSemana(semanaAtual.ano, semanaAtual.semana);
      
      const outputPath = path.resolve('cache', `semana_${semanaAtual.ano}_${semanaAtual.semana}.json`);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(dados, null, 2), 'utf-8');

      console.log(`\n✅ Sucesso! Dados completos extraídos e salvos em: ${outputPath}`);
      console.log(`- Meio de Semana: ${dados.meioSemana.titulo} (${dados.meioSemana.totalPartes} partes)`);
      console.log(`- Fim de Semana (A Sentinela): ${dados.fimSemana.titulo} (${dados.fimSemana.totalParagrafos} perguntas)`);
    } catch (err) {
      console.error('❌ Erro na extração:', err.message);
    }
  }

  main();
}

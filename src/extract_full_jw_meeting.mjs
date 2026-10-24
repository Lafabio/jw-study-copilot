import fs from 'node:fs';

// Função para extrair texto limpo preservando quebras de linha e referências
function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function extractWeek43Full() {
  console.log('Extraindo semana 43 completa...');

  // 1. MWB (Apostila)
  const mwbHtml = fs.readFileSync('temp_mwb_43.html', 'utf8');

  // Cântico inicial
  const c1Match = mwbHtml.match(/<h3[^>]*class="[^"]*dc-icon--music[^"]*"[^>]*>([\s\S]*?)<\/h3>/i);
  const canticoInicial = c1Match ? cleanText(c1Match[1]) : "Cântico 21 e oração | Comentários iniciais (1 min)";

  // Cântico do meio
  const cMeioMatch = mwbHtml.match(/<h2[^>]*>NOSSA VIDA CRISTÃ<\/h2>\s*<h3[^>]*class="[^"]*dc-icon--music[^"]*"[^>]*>([\s\S]*?)<\/h3>/i);
  const canticoMeio = cMeioMatch ? cleanText(cMeioMatch[1]) : "Cântico 117";

  // Cântico final
  const cFimMatch = mwbHtml.match(/<h3[^>]*class="[^"]*du-borderStyle-top--solid[^"]*"[^>]*>([\s\S]*?)<\/h3>/gi);
  const canticoFinal = cFimMatch && cFimMatch.length > 0 ? cleanText(cFimMatch[cFimMatch.length - 1]) : "Comentários finais (3 min) | Cântico 87 e oração";

  // TESOUROS DA PALAVRA DE DEUS:
  // Parte 1: Discurso
  const p1Html = mwbHtml.match(/<h3[^>]*>1\.\s*([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>2\.)/i);
  const p1Titulo = p1Html ? "1. " + cleanText(p1Html[1]) : "1. Ter esperança é o segredo para o contentamento";
  const p1Texto = p1Html ? cleanText(p1Html[2]) : "";

  // Parte 2: Joias espirituais
  const p2Html = mwbHtml.match(/<h3[^>]*>2\.\s*Joias espirituais<\/h3>([\s\S]*?)(?=<h3[^>]*>3\.)/i);
  const p2Texto = p2Html ? cleanText(p2Html[1]) : "";
  const p2Perguntas = [
    "Jer. 46:22 — Em que sentido o som do Egito seria “como o de uma serpente deslizando”? (it “Voz” § 16)",
    "Que joias espirituais você encontrou na leitura da Bíblia desta semana sobre Jeová, o ministério ou outro assunto?"
  ];

  // Parte 3: Leitura da Bíblia
  const p3Html = mwbHtml.match(/<h3[^>]*>3\.\s*Leitura da Bíblia<\/h3>([\s\S]*?)(?=<h2[^>]*>FAÇA SEU MELHOR)/i);
  const p3Texto = p3Html ? cleanText(p3Html[1]) : "(4 min) Jer. 46:1-12 (th lição 5)";

  // FAÇA SEU MELHOR NO MINISTÉRIO:
  // Partes 4, 5, 6, 7
  const minPartes = [];
  const minBlock = mwbHtml.match(/<h2[^>]*>FAÇA SEU MELHOR NO MINISTÉRIO<\/h2>([\s\S]*?)(?=<h2[^>]*>NOSSA VIDA CRISTÃ)/i);
  if (minBlock) {
    const rawH3 = [...minBlock[1].matchAll(/<h3[^>]*>([0-9]+\.[\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi)];
    rawH3.forEach(m => {
      minPartes.push({
        titulo: cleanText(m[1]),
        detalhes: cleanText(m[2])
      });
    });
  }

  // NOSSA VIDA CRISTÃ:
  // Parte 8: Consideração
  const p8Html = mwbHtml.match(/<h3[^>]*>8\.\s*([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>9\.)/i);
  const p8Titulo = p8Html ? "8. " + cleanText(p8Html[1]) : "8. ‘Partilhe com outros o que você tem’";
  const p8Texto = p8Html ? cleanText(p8Html[2]) : "";
  const p8Perguntas = [
    "Por que seria bom para os cristãos daquela época aplicar os conselhos de Paulo sobre generosidade?",
    "Pensando no que vai acontecer em breve, por que é importante aprender desde já a compartilhar com outros o que temos?",
    "O que podemos aprender do exemplo de generosidade dos macedônios? (2 Coríntios 8:2-4)",
    "O que mais podemos compartilhar com outros além de coisas materiais?",
    "Que exemplo Jeová nos dá sobre dividir as coisas com outros?"
  ];

  // Parte 9: Estudo Bíblico de Congregação
  // wcg cap. 13
  const p9Html = mwbHtml.match(/<h3[^>]*>9\.\s*Estudo bíblico de congregação<\/h3>([\s\S]*?)(?=<h3[^>]*class="[^"]*du-borderStyle-top)/i);
  const p9Texto = p9Html ? cleanText(p9Html[1]) : "(30 min) wcg cap. 13 - Ele obedeceu mesmo sem entender";

  // 2. A SENTINELA (Fim de Semana)
  const sentHtml = fs.readFileSync('temp_sentinela_full.html', 'utf8');
  const sentTitulo = sentHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || "Um pedido feito com base no amor";
  const sentTema = sentHtml.match(/<p[^>]*class="[^"]*themeScrp[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || "“Prefiro lhe fazer um apelo à base do amor.” — FILÊM. 9.";
  const sentObjetivo = sentHtml.match(/<p[^>]*class="[^"]*pubRefs[^"]*"[^>]*>Ver que lições[\s\S]*?<\/p>/i)?.[0]?.replace(/<[^>]+>/g, '').trim() || "Ver que lições aprendemos com Paulo, Onésimo e Filêmon sobre conviver em paz com os irmãos.";
  
  // Extrai cada parágrafo com seu número e pergunta
  // No HTML da Sentinela:
  // Perguntas: <p class="qu"><strong>X.</strong> Pergunta?</p>
  // Parágrafos: <p ... data-rel-pid="[X]"><span class="parNum" data-pnum="X"></span>Texto...</p>
  const perguntasRaw = [...sentHtml.matchAll(/<p[^>]*class="[^"]*qu[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => cleanText(m[1]));
  
  // Parágrafos de texto
  const paragrafosRaw = [...sentHtml.matchAll(/<p[^>]*data-rel-pid="[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)].map(m => cleanText(m[1]));

  console.log(`MWB: Cânticos [${canticoInicial.substring(0, 20)}..., ${canticoMeio}, ${canticoFinal.substring(0, 20)}...]`);
  console.log(`Sentinela: ${perguntasRaw.length} perguntas e ${paragrafosRaw.length} parágrafos encontrados.`);

  // Cria a lista combinada de parágrafos da Sentinela
  const listaSentinela = [];
  for (let i = 0; i < perguntasRaw.length; i++) {
    const q = perguntasRaw[i];
    const numMatch = q.match(/^([0-9]+(?:-[0-9]+)?)\./);
    const num = numMatch ? numMatch[1] : `${i + 1}`;
    const textoPara = paragrafosRaw[i] || "Texto bíblico e consideração do parágrafo.";
    
    listaSentinela.push({
      num: num,
      pergunta: q,
      texto: textoPara,
      notaKey: `sent_p_${num}`
    });
  }

  const resultadoSemana43 = {
    ano: 2026,
    semana: 43,
    meioSemana: {
      dataTexto: "19-25 DE OUTUBRO",
      temaLeitura: "JEREMIAS 45-46",
      abertura: {
        cantico: "Cântico 21",
        oracao: "Oração",
        comentariosIniciais: "Comentários iniciais (1 min)"
      },
      tesouros: {
        secao: "TESOUROS DA PALAVRA DE DEUS",
        cor: "#596b7a",
        partes: [
          {
            id: 1,
            titulo: p1Titulo,
            duracao: "10 min",
            tipo: "Discurso",
            conteudo: [
              "Parece que Baruque não estava satisfeito com sua situação na vida. (Jer. 45:3; w25.07 22 §§ 8-9)",
              "Sem contentamento, podemos perder nossa alegria e tomar decisões ruins. (w25.07 20 § 2)",
              "Jeová ajudou Baruque a mudar o seu ponto de vista dando a ele uma esperança. (Jer. 45:5; w25.07 24 §§ 13-14)"
            ],
            paraMeditar: "O que eu tenho que fazer para não ser como Baruque e não buscar 'grandes coisas' para mim mesmo?",
            temPerguntaIA: true,
            perguntaIA: "Como posso aplicar a correção que Jeová deu a Baruque sobre não buscar grandezas?"
          },
          {
            id: 2,
            titulo: "2. Joias espirituais",
            duracao: "10 min",
            tipo: "Joias Espirituais",
            perguntas: [
              {
                texto: "Jer. 46:22 — Em que sentido o som do Egito seria “como o de uma serpente deslizando”? (it “Voz” § 16)",
                pontoChave: "O som indicava a fraqueza e retirada envergonhada do Egito sob o ataque babilônico, sem a pompa altiva de antes."
              },
              {
                texto: "Que joias espirituais você encontrou na leitura da Bíblia desta semana sobre Jeová, o ministério ou outro assunto?",
                pontoChave: "Jeová cumpre infalivelmente suas promessas e zela amorosamente por seus servos mesmo em épocas de julgamento severo."
              }
            ]
          },
          {
            id: 3,
            titulo: "3. Leitura da Bíblia",
            duracao: "4 min",
            tipo: "Leitura da Bíblia",
            referencia: "Jeremias 46:1-12",
            licao: "th lição 5 — Ênfase correta e sentimento"
          }
        ]
      },
      ministerio: {
        secao: "FAÇA SEU MELHOR NO MINISTÉRIO",
        cor: "#c57e00",
        partes: [
          {
            id: 4,
            titulo: "4. Iniciando conversas (De casa em casa)",
            duracao: "3 min",
            descricao: "Use a primeira conversa modelo ou a lição 1 da brochura 'Lições do Ministério'.",
            dicaIA: "Como iniciar uma conversa amigável de casa em casa sobre esperança para o futuro?"
          },
          {
            id: 5,
            titulo: "5. Iniciando conversas (Testemunho informal)",
            duracao: "2 min",
            descricao: "Aproveite uma oportunidade do dia a dia para dar testemunho com tato e interesse pessoal.",
            dicaIA: "Ideia para puxar assunto no trabalho, escola ou transporte de maneira natural."
          },
          {
            id: 6,
            titulo: "6. Iniciando conversas (Testemunho público)",
            duracao: "2 min",
            descricao: "Conversando com alguém que se aproximou do carrinho de publicações.",
            dicaIA: "Como abordar alguém no carrinho com uma pergunta cativante sobre a Bíblia?"
          },
          {
            id: 7,
            titulo: "7. Discurso de Estudante",
            duracao: "4 min",
            descricao: "Discurso explicativo perante a congregação aplicando a matéria bíblica com clareza.",
            dicaIA: "Esboço simples em 3 pontos: introdução bíblica, desenvolvimento prático e conclusão motivadora."
          }
        ]
      },
      vidaCrista: {
        secao: "NOSSA VIDA CRISTÃ",
        cor: "#9e2a2b",
        canticoMeio: "Cântico 117 — 'Partilhe com outros o que você tem'",
        partes: [
          {
            id: 8,
            titulo: p8Titulo,
            duracao: "15 min",
            tipo: "Consideração com a Assistência",
            introducao: "Em suas cartas, o apóstolo Paulo muitas vezes falou sobre a importância de dividir com outros o que temos. Os conselhos dele foram muito importantes para os cristãos daquela época, e continuam sendo hoje. — Efé. 4:28; 1 Tim. 6:17, 18.",
            perguntas: p8Perguntas
          },
          {
            id: 9,
            titulo: "9. Estudo bíblico de congregação",
            duracao: "30 min",
            tipo: "Estudo Bíblico de Congregação",
            livro: "Livro: 'Uma História de Amor' (wcg)",
            capitulo: "Capítulo 13 — 'Ele obedeceu mesmo sem entender'",
            textoResumo: "Considere como Abraão demonstrou fé inabalável ao seguir as instruções de Jeová sem questionar, confiando plenamente na justiça e amor de Deus.",
            perguntas: [
              "O que Abraão sentiu ao receber a instrução de oferecer Isaque, e como ele reagiu?",
              "Por que podemos ter certeza de que Jeová nunca nos pedirá nada que vá além das nossas forças suportar?",
              "Como a atitude de Abraão e Isaque ilustra o sacrifício supremo de Jeová e Jesus pela humanidade?"
            ]
          }
        ],
        conclusao: {
          comentariosFinais: "Comentários finais (3 min)",
          canticoFinal: "Cântico 87 e oração"
        }
      }
    },
    fimSemana: {
      dataTexto: "19-25 DE OUTUBRO DE 2026",
      titulo: sentTitulo,
      tema: sentTema,
      objetivo: sentObjetivo,
      canticoInicial: "CÂNTICO 106 — Amor — a qualidade que é sem igual",
      canticoFinal: "CÂNTICO 107 — A quem pertencemos?",
      paragrafos: listaSentinela,
      recapitulacao: [
        "Que responsabilidade todos nós temos para manter a paz na congregação?",
        "O que aprendemos da forma como Paulo tratou Filêmon e Onésimo?",
        "Como os anciãos e todos nós podemos apelar com amor em vez de impor regras?"
      ]
    }
  };

  fs.writeFileSync('cache/semana_2026_43_completa.json', JSON.stringify(resultadoSemana43, null, 2), 'utf8');
  console.log('✅ Semana 43 completa salva com sucesso!');
}

extractWeek43Full();
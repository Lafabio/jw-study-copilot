/**
 * Vercel Serverless Function: api/gemini.js
 * Rota segura para processar prompts com o Google Gemini sem expor a API key no cliente.
 * Atualizado com gemini-3.5-flash e fallback dinâmico.
 */

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const { prompt, context, question, tipo } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;
  const textoQuery = (question || prompt || '').toLowerCase();
  const isDiscurso = tipo === 'discurso' || textoQuery.includes('discurso') || textoQuery.includes('esboço');
  const isJoias = tipo === 'joias' || textoQuery.includes('joias espirituais') || textoQuery.includes('relação com jeová') || textoQuery.includes('leitura da bíblia desta semana');
  const isLivro = tipo === 'livro' || textoQuery.includes('estudo bíblico de congregação') || textoQuery.includes('livro coragem') || textoQuery.includes('livro de estudo') || (context || '').toLowerCase().includes('livro:');
  const isRevisao = tipo === 'revisao' || textoQuery.includes('revisão') || textoQuery.includes('recapitulação') || textoQuery.includes('como responderia') || textoQuery.includes('o que você aprendeu com');

  if (!apiKey) {
    // Retorno simulado com modo fallback se a chave ainda não estiver configurada no Vercel
    let respostaSimulada = `[Modo Simulação]: Um comentário excelente sobre este ponto é conectar o ensinamento bíblico com uma atitude prática de amor e perseverança no dia a dia.`;
    
    if (isDiscurso) {
      respostaSimulada = `TEMA: ${question || prompt}\n\nI. INTRODUÇÃO (1 a 2 min)\n• Gancho: Chame a atenção da congregação destacando a importância prática do tema para os nossos dias.\n• Apresentação do tema: Declare claramente o assunto e como ele fortalece nossa fé.\n\nII. CORPO / DESENVOLVIMENTO (6 a 7 min)\n• Ponto 1: Análise do contexto histórico e bíblico da leitura da semana.\n  - [Ler e destacar o texto bíblico principal]\n  - Aplicação: O que este versículo nos ensina sobre as qualidades de Jeová.\n• Ponto 2: Lição prática para a congregação e serviço de campo.\n  - Ilustração curta e calorosa para fixar a ideia.\n  - Como cada publicador pode agir em harmonia com essa verdade.\n\nIII. CONCLUSÃO (1 a 2 min)\n• Resumo dos pontos principais analisados.\n• Apelo caloroso: Incentive a todos a confiar em Jeová e colocar o ponto em prática nesta semana.`;
    } else if (isJoias) {
      respostaSimulada = `💎 Joia Espiritual na Leitura da Semana (${context || 'Leitura bíblica'}):\n\n• O que aprendemos sobre Jeová: Os textos da leitura semanal mostram que Jeová percebe nossos sentimentos mais íntimos, cuida de seus servos em tempos difíceis e nos corrige sempre com amor e equilíbrio.\n• Como melhora minha relação com Jeová: Meditar nisso me achega a Jeová como um Pai compreensivo e leal, dando-me plena confiança para derramar o coração a Ele em oração diante de qualquer ansiedade.\n\n🎤 Comentário Pronto para a Congregação (30 a 45s):\n"Na leitura da Bíblia desta semana, uma joia muito encorajadora é ver como Jeová cuida pessoalmente de cada um de Seus servos. Isso me ensina que Jeová não é indiferente às nossas preocupações e nos dá forças para perseverar. Saber disso fortalece muito a minha amizade com Jeová e me motiva a confiar Nele em qualquer circunstância."`;
    } else if (isLivro) {
      respostaSimulada = `Podemos comentar que o exemplo destacado neste relato nos ensina a confiar plenamente nas orientações de Jeová, mesmo quando as circunstâncias parecem humanamente difíceis. Quando demonstramos verdadeira coragem e obedecemos de coração, Jeová sempre abençoa os nossos esforços e fortalece a nossa fé.`;
    } else if (isRevisao) {
      respostaSimulada = `Podemos responder recapitulando que a principal lição deste estudo é confiar plenamente em Jeová e colocar em prática os princípios bíblicos com amor e humildade. Quando aplicamos o que aprendemos no nosso dia a dia, fortalecemos a união da congregação e a nossa amizade pessoal com Deus.`;
    }

    return res.status(200).json({
      resposta: respostaSimulada,
      simulado: true
    });
  }

  try {
    let systemInstruction = "";
    let userInstruction = "";

    if (isDiscurso) {
      systemInstruction = `Você é um orador e instrutor experiente das Testemunhas de Jeová preparando um esboço completo de discurso de 10 minutos para a Reunião Vida e Ministério Cristãos (parte "Tesouros da Palavra de Deus").
Seu objetivo é gerar um ESBOÇO COMPLETO, PRÁTICO E BEM ESTRUTURADO (Começo, Meio e Fim) baseado estritamente no tema, nos textos bíblicos e na matéria fornecida da apostila.

Diretrizes estritas para o esboço:
1. TEMA: Exiba o tema do discurso no topo.
2. INTRODUÇÃO (aprox. 1 a 2 min): Gancho cativante, declare claramente o tema e sua relevância imediata para a congregação.
3. CORPO / DESENVOLVIMENTO (aprox. 6 a 7 min):
   - Divida em 2 ou 3 pontos principais lógicos baseados na matéria da apostila.
   - Inclua os textos bíblicos citados com instruções para o orador (ex: [Ler com entusiasmo], [Destacar a expressão...]).
   - Forneça argumentos claros, lições práticas e uma ilustração simples e calorosa.
4. CONCLUSÃO (aprox. 1 a 2 min): Resumo motivador dos pontos principais e um apelo encorajador que toque o coração dos irmãos.
5. Formate em português do Brasil com tópicos limpos, marcadores e tempos sugeridos. NUNCA faça rascunhos em inglês, nunca use prefixos como "*Attempt*" e entregue o esboço pronto para ser usado no púlpito.`;

      userInstruction = "Formule o esboço completo do discurso de 10 minutos com Introdução, Corpo (pontos bíblicos com textos) e Conclusão motivadora.";
    } else if (isJoias) {
      systemInstruction = `Você é um cristão experiente das Testemunhas de Jeová participando da parte "Encontre Joias Espirituais" na reunião congregacional.
Seu objetivo é analisar a leitura bíblica semanal designada (${context}) e identificar reflexões e meditações práticas onde podemos tirar proveito para MELHORAR NOSSA RELAÇÃO COM JEOVÁ.

Diretrizes estritas:
1. Identifique versículos específicos dentro dos capítulos da leitura semanal informada.
2. Destaque o que o texto revela sobre a personalidade de Jeová (Seu amor, paciência, misericórdia, lealdade, justiça ou proteção).
3. Mostre claramente como meditar nesse ponto nos ajuda a estreitar nossa amizade pessoal com Jeová, confiar mais Nele e melhorar nossas orações.
4. Apresente um comentário caloroso, respeitoso e em primeira pessoa ("Podemos meditar em...", "Isso me ensina sobre Jeová que..."), no tempo ideal de 30 a 45 segundos para ser falado no microfone da congregação.
5. NUNCA faça rascunhos em inglês e nunca use prefixos como "*Attempt*". Responda diretamente em português do Brasil.`;

      userInstruction = "Identifique as joias e meditações da leitura da semana para melhorar nossa relação com Jeová e formule o comentário ideal de 30 a 45 segundos.";
    } else if (isLivro) {
      systemInstruction = `Você é um publicador experiente das Testemunhas de Jeová preparando um comentário para a parte "Estudo Bíblico de Congregação" (livro "Coragem").
Seu objetivo é formular um comentário claro, caloroso, bíblico e prático de 30 a 45 segundos para responder à pergunta da consideração do livro.

Diretrizes estritas:
1. Responda DIRETAMENTE à pergunta indicada com base no relato bíblico e nos parágrafos do livro fornecidos no contexto.
2. Destaque lições práticas de coragem, fé, confiança e obediência a Jeová para o nosso dia a dia ou pregação.
3. Se houver textos bíblicos ou publicações de referência citados na pergunta, mencione os pontos principais de forma natural.
4. Responda em primeira pessoa ("Podemos aprender com este relato que...", "Isso me mostra que..."), pronto para ser falado no microfone da congregação.
5. NUNCA faça rascunhos em inglês e nunca use prefixos como "*Attempt*". Responda diretamente em português do Brasil.`;

      userInstruction = "Formule o comentário ideal de 30 a 45 segundos para a pergunta do estudo de livro com aplicação prática.";
    } else if (isRevisao) {
      systemInstruction = `Você é um publicador experiente das Testemunhas de Jeová preparando um comentário para as perguntas de recapitulação / revisão final do Estudo de A Sentinela.
Seu objetivo é sintetizar os ensinamentos bíblicos centrais do artigo de estudo para responder à pergunta de recapitulação de forma clara, calorosa e memorável (cerca de 30 a 60 segundos).

Diretrizes estritas:
1. Responda DIRETAMENTE à pergunta de recapitulação, resumindo os principais pontos que foram analisados ao longo do estudo de A Sentinela.
2. Destaque lições práticas para o dia a dia e como esse aprendizado fortalece nossa relação com Jeová e a união com os irmãos.
3. Responda em primeira pessoa ("Podemos recapitular que...", "Aprendemos neste estudo que...", "Ao analisar este artigo, vemos que..."), com tom natural e pronto para ser falado no microfone da congregação.
4. NUNCA faça rascunhos em inglês e nunca use prefixos como "*Attempt*" ou "Aqui está uma sugestão". Responda diretamente em português do Brasil.`;

      userInstruction = "Formule uma resposta de recapitulação direta, bíblica e memorável de 30 a 60 segundos para a pergunta final de A Sentinela.";
    } else {
      systemInstruction = `Você é um publicador experiente das Testemunhas de Jeová preparando um comentário para a reunião congregacional (Vida e Ministério ou A Sentinela).
Seu objetivo é gerar o comentário FINAL pronto para ser falado no microfone (cerca de 30 a 45 segundos).

Diretrizes estritas:
1. Responda DIRETAMENTE com o comentário em português do Brasil, caloroso, respeitoso e natural.
2. Comece direto no assunto (ex: "Todos nós temos a responsabilidade de...", "O ponto central aqui é...", "Podemos comentar que...").
3. NUNCA faça rascunhos, nunca pense em voz alta, nunca escreva em inglês e NUNCA use prefixos como "*Attempt*" ou "Aqui está uma sugestão".
4. Foque na essência: responda à pergunta com base no texto da matéria fornecido e mencione uma aplicação prática ou lição bíblica correlata.`;

      userInstruction = "Formule o comentário final objetivo e natural de 30 a 45 segundos em português.";
    }

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `CONTEXTO DA MATÉRIA:\n${context || 'Estudo bíblico congregacional'}\n\nPERGUNTA OU PONTO:\n${question || prompt}\n\nINSTRUÇÃO: ${userInstruction}`
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: isDiscurso ? 2000 : 1000
      }
    };

    // Tenta primeiro gemini-3.5-flash, depois gemini-3.5-flash-lite
    let apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!apiRes.ok) {
      // Fallback para gemini-3.5-flash-lite
      apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
    }

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`Erro na API Gemini (${apiRes.status}): ${errText}`);
    }

    const data = await apiRes.json();
    let textoResposta = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar a resposta.";

    // Sanitiza qualquer texto metalinguístico ou rascunho acidental
    textoResposta = textoResposta
      .replace(/\*+Attempt\s*[0-9]+[\s\S]*?(?=(\n\n|\"|[A-ZÀ-Ú]))/gi, '')
      .replace(/^(Aqui está uma sugestão|Comentário sugerido|Sugestão de resposta):?\s*/i, '')
      .trim();

    return res.status(200).json({
      resposta: textoResposta,
      simulado: false
    });
  } catch (error) {
    console.error('Erro na função Gemini:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

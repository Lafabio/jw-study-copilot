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
  const isDiscurso = tipo === 'discurso' || (question || prompt || '').toLowerCase().includes('discurso') || (question || prompt || '').toLowerCase().includes('esboço');

  if (!apiKey) {
    // Retorno simulado com modo fallback se a chave ainda não estiver configurada no Vercel
    const respostaSimulada = isDiscurso
      ? `TEMA: ${question || prompt}\n\nI. INTRODUÇÃO (1 a 2 min)\n• Gancho: Chame a atenção da congregação destacando a importância prática do tema para os nossos dias.\n• Apresentação do tema: Declare claramente o assunto e como ele fortalece nossa fé.\n\nII. CORPO / DESENVOLVIMENTO (6 a 7 min)\n• Ponto 1: Análise do contexto histórico e bíblico da leitura da semana.\n  - [Ler e destacar o texto bíblico principal]\n  - Aplicação: O que este versículo nos ensina sobre as qualidades de Jeová.\n• Ponto 2: Lição prática para a congregação e serviço de campo.\n  - Ilustração curta e calorosa para fixar a ideia.\n  - Como cada publicador pode agir em harmonia com essa verdade.\n\nIII. CONCLUSÃO (1 a 2 min)\n• Resumo dos pontos principais analisados.\n• Apelo caloroso: Incentive a todos a confiar em Jeová e colocar o ponto em prática nesta semana.`
      : `[Modo Simulação]: Um comentário excelente sobre este ponto é conectar o ensinamento bíblico com uma atitude prática de amor e perseverança no dia a dia.`;

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

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

  const { prompt, context, question } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Retorno simulado com modo fallback se a chave ainda não estiver configurada no Vercel
    return res.status(200).json({
      resposta: `[Modo Simulação - Adicione GEMINI_API_KEY no painel da Vercel]: Um comentário excelente sobre este ponto é conectar o ensinamento bíblico com uma atitude prática de amor e perseverança no dia a dia.`,
      simulado: true
    });
  }

  try {
    const systemInstruction = `
Você é um publicador experiente das Testemunhas de Jeová preparando um comentário para a reunião congregacional (Vida e Ministério ou A Sentinela).
Seu objetivo é gerar o comentário FINAL pronto para ser falado no microfone (cerca de 30 a 45 segundos).

Diretrizes estritas:
1. Responda DIRETAMENTE com o comentário em português do Brasil, caloroso, respeitoso e natural.
2. Comece direto no assunto (ex: "Todos nós temos a responsabilidade de...", "O ponto central aqui é...", "Podemos comentar que...").
3. NUNCA faça rascunhos, nunca pense em voz alta, nunca escreva em inglês e NUNCA use prefixos como "*Attempt*" ou "Aqui está uma sugestão".
4. Foque na essência: responda à pergunta com base no texto da matéria fornecido e mencione uma aplicação prática ou lição bíblica correlata.
`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `CONTEXTO DA MATÉRIA:\n${context || 'Estudo bíblico congregacional'}\n\nPERGUNTA OU PONTO:\n${question || prompt}\n\nINSTRUÇÃO: Formule o comentário final objetivo e natural de 30 a 45 segundos em português.`
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1000
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

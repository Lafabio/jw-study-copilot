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
Você é um assistente pessoal de estudo bíblico para as reuniões congregacionais (Vida e Ministério e A Sentinela).
Seu objetivo é ajudar o usuário a formular comentários e discursos claros, objetivos e com as próprias palavras.

Regras fundamentais:
1. Respostas para comentários na congregação devem ser concisas (ideal para 30 a 45 segundos de fala).
2. Use linguagem natural e respeitosa, evitando termos difíceis.
3. Não leia o texto literalmente; reformule a essência do raciocínio bíblico.
4. Conecte com o texto bíblico aplicado e ofereça uma aplicação prática quando cabível.
`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `CONTEXTO DA MATÉRIA:\n${context || 'Estudo bíblico congregacional'}\n\nPERGUNTA OU PONTO:\n${question || prompt}\n\nINSTRUÇÃO: Formule um comentário objetivo de 30 a 45 segundos com as próprias palavras.`
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
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
    const textoResposta = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar a resposta.";

    return res.status(200).json({
      resposta: textoResposta,
      simulado: false
    });
  } catch (error) {
    console.error('Erro na função Gemini:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

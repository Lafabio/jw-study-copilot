/**
 * Vercel Serverless Function: api/notas.js
 * Sincroniza anotações e comentários com o Supabase.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const supabaseKey = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      aviso: 'Supabase não configurado no Vercel. Operação salva apenas localmente no navegador (localStorage).',
      sucesso: true
    });
  }

  // GET: Obter notas do usuário para a semana
  if (req.method === 'GET') {
    const { userId, ano, semana } = req.query;
    try {
      const supaRes = await fetch(
        `${supabaseUrl}/rest/v1/user_notes?user_id=eq.${userId}&year=eq.${ano}&week_number=eq.${semana}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );
      const data = await supaRes.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // POST: Salvar ou atualizar nota
  if (req.method === 'POST') {
    const { userId, ano, semana, meetingType, itemKey, noteText, aiComment } = req.body || {};

    try {
      const payload = {
        user_id: userId || 'anonymous',
        year: parseInt(ano),
        week_number: parseInt(semana),
        meeting_type: meetingType,
        item_key: itemKey,
        note_text: noteText,
        ai_comment: aiComment,
        updated_at: new Date().toISOString()
      };

      const supaRes = await fetch(`${supabaseUrl}/rest/v1/user_notes`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      if (!supaRes.ok) {
        throw new Error(await supaRes.text());
      }

      return res.status(200).json({ sucesso: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Método não suportado' });
}

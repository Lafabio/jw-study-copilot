import fs from 'node:fs';

const SUPABASE_URL = 'https://jjmjjlvpaxafxpebvrwb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_B5LuMRBbudUuwdEkgH5Vkw_BOqHt6re';

async function uploadFullToSupabase() {
  const filePath = 'cache/todas_semanas_full.json';
  const todas = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const [semanaStr, conteudo] of Object.entries(todas)) {
    const semana = parseInt(semanaStr);
    console.log(`[Upload] Enviando Semana ${semana} Completa para o Supabase...`);

    const payload = {
      year: 2026,
      week_number: semana,
      content_json: conteudo,
      updated_at: new Date().toISOString()
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/meetings_cache?on_conflict=year,week_number`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log(`✅ Semana ${semana} gravada com sucesso no Supabase!`);
      } else {
        const err = await res.text();
        console.error(`❌ Falha ao salvar semana ${semana}:`, err);
      }
    } catch (e) {
      console.error(`❌ Erro de conexão na semana ${semana}:`, e.message);
    }
  }
}

uploadFullToSupabase();
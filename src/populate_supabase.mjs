/**
 * populate_supabase.mjs
 * Envia as semanas extraídas para a tabela meetings_cache no Supabase.
 */

import fs from 'node:fs';

const url = 'https://jjmjjlvpaxafxpebvrwb.supabase.co';
const key = 'sb_publishable_B5LuMRBbudUuwdEkgH5Vkw_BOqHt6re';

async function uploadWeeks() {
  const todasSemanas = JSON.parse(fs.readFileSync('cache/todas_semanas.json', 'utf8'));

  for (const [semanaNum, dados] of Object.entries(todasSemanas)) {
    console.log(`[Upload] Enviando Semana ${semanaNum} para o Supabase...`);

    const payload = {
      year: 2026,
      week_number: parseInt(semanaNum),
      content_json: dados,
      updated_at: new Date().toISOString()
    };

    try {
      const res = await fetch(`${url}/rest/v1/meetings_cache`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log(`✅ Semana ${semanaNum} salva com sucesso no Supabase!`);
      } else {
        const err = await res.text();
        console.error(`❌ Falha ao salvar semana ${semanaNum}:`, err);
      }
    } catch (e) {
      console.error(`❌ Erro de rede:`, e.message);
    }
  }
}

uploadWeeks();

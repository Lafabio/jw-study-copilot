/**
 * Vercel Serverless Function: api/semanas.js
 * Retorna os dados da semana solicitada consultando o Supabase ou o cache local.
 */

import fs from 'node:fs';
import path from 'node:path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { ano = 2026, semana = 43 } = req.query;
  const anoInt = parseInt(ano);
  const semanaInt = parseInt(semana);

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 1. Tenta buscar no Supabase se configurado
  if (supabaseUrl && supabaseKey) {
    try {
      const supaRes = await fetch(
        `${supabaseUrl}/rest/v1/meetings_cache?year=eq.${anoInt}&week_number=eq.${semanaInt}&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (supaRes.ok) {
        const rows = await supaRes.json();
        if (rows && rows.length > 0) {
          return res.status(200).json({
            origem: 'supabase',
            dados: rows[0].content_json
          });
        }
      }
    } catch (e) {
      console.warn('Falha na consulta ao Supabase, caindo para cache local:', e.message);
    }
  }

  // 2. Fallback: Lê do arquivo local de cache do repositório
  try {
    const cachePath = path.resolve(process.cwd(), 'cache', 'todas_semanas.json');
    if (fs.existsSync(cachePath)) {
      const todas = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      if (todas[semanaInt]) {
        return res.status(200).json({
          origem: 'cache_local',
          dados: todas[semanaInt]
        });
      }
    }
  } catch (err) {
    console.error('Erro ao ler cache local:', err.message);
  }

  return res.status(404).json({ error: `Dados para o ano ${anoInt}, semana ${semanaInt} não encontrados.` });
}

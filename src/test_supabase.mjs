import fs from 'node:fs';

const url = 'https://jjmjjlvpaxafxpebvrwb.supabase.co';
const key = 'sb_publishable_B5LuMRBbudUuwdEkgH5Vkw_BOqHt6re';

async function testSupabase() {
  console.log(`[Supabase] Testando conexão com: ${url}...`);

  try {
    // Testa consulta à tabela meetings_cache
    const res = await fetch(`${url}/rest/v1/meetings_cache?select=*&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    console.log(`[Supabase] Status da resposta: ${res.status} (${res.statusText})`);

    if (res.status === 200) {
      const data = await res.json();
      console.log('✅ Conexão bem-sucedida! Tabela meetings_cache encontrada. Registros:', data.length);
      return true;
    } else if (res.status === 404 || res.status === 401 || res.status === 400) {
      const err = await res.text();
      console.log('ℹ️ Resposta da API:', err);
      return false;
    }
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
    return false;
  }
}

testSupabase();

import fs from 'node:fs';
import { JWService } from './jw_service.mjs';

async function crawlAndSave() {
  const service = new JWService('pt');
  const cachePath = './cache/todas_semanas.json';
  let todas = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};

  for (const s of [46, 47]) {
    try {
      console.log(`Extraindo semana ${s}...`);
      const res = await service.extrairProgramacaoSemana(2026, s);
      todas[s] = res;
      fs.writeFileSync(`./cache/semana_2026_${s}.json`, JSON.stringify(res, null, 2), 'utf8');
      console.log(`✅ Salva semana ${s}`);
    } catch(e) {
      console.error(`❌ Erro na semana ${s}:`, e.message);
    }
  }

  fs.writeFileSync(cachePath, JSON.stringify(todas, null, 2), 'utf8');
  console.log('Total de semanas disponíveis:', Object.keys(todas));
}

crawlAndSave();
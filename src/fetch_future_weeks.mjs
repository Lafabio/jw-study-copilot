import { JWService } from './jw_service.mjs';
import fs from 'node:fs';
import path from 'node:path';

async function fetchMultipleWeeks() {
  const jw = new JWService('pt');
  const semanasParaBuscar = [43, 44, 45]; // Atual, Próxima, e Seguinte

  const resultadoSemanas = {};

  for (const sem of semanasParaBuscar) {
    console.log(`\n[MultiWeek] Baixando semana ${sem}...`);
    try {
      const dados = await jw.extrairProgramacaoSemana(2026, sem);
      resultadoSemanas[sem] = dados;
      
      const file = path.resolve('cache', `semana_2026_${sem}.json`);
      fs.writeFileSync(file, JSON.stringify(dados, null, 2), 'utf-8');
      console.log(`✅ Semana ${sem} salva em cache!`);
    } catch (e) {
      console.error(`❌ Erro na semana ${sem}:`, e.message);
    }
  }

  // Gera o arquivo combinado para o protótipo
  const combinedFile = path.resolve('cache', 'todas_semanas.json');
  fs.writeFileSync(combinedFile, JSON.stringify(resultadoSemanas, null, 2), 'utf-8');
  console.log(`\n🎉 Todas as semanas salvas em: ${combinedFile}`);
}

fetchMultipleWeeks();

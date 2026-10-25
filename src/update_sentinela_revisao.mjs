import fs from 'node:fs';

const revisaoData = {
  "43": {
    titulo: "O QUE VOCÊ APRENDEU COM . . .",
    perguntas: [
      "O que você aprendeu com o apóstolo Paulo?",
      "O que você aprendeu com Onésimo?",
      "O que você aprendeu com Filêmon?"
    ]
  },
  "44": {
    titulo: "DE ACORDO COM A PROFECIA EM LUCAS 1:68-79, . . .",
    perguntas: [
      "De acordo com a profecia em Lucas 1:68-79, que presente maravilhoso Jeová nos deu?",
      "De acordo com a profecia em Lucas 1:68-79, que privilégio temos por causa do sacrifício de Jesus?",
      "De acordo com a profecia em Lucas 1:68-79, qual é a nossa responsabilidade?"
    ]
  },
  "45": {
    titulo: "COMO RESPONDERIA?",
    perguntas: [
      "Que tipo de proteção o Salmo 91 promete?",
      "Como Jeová nos protege hoje?",
      "Como Jeová vai nos proteger no futuro?"
    ]
  },
  "46": {
    titulo: "COMO RESPONDERIA?",
    perguntas: [
      "O que podemos aprender do mau exemplo dos israelitas que saíram do Egito?",
      "Como Jeosafá mostrou que tinha “um coração obediente”?",
      "O que podemos aprender do exemplo de Jeosafá?"
    ]
  },
  "47": {
    titulo: "COMO RESPONDERIA?",
    perguntas: [
      "Quem o “judeu” e os “dez homens” da profecia de Zacarias 8:23 representam?",
      "O que torna possível que pessoas de todo o mundo aprendam sobre Jeová?",
      "Por que é importante conhecer e usar o nome de Jeová?"
    ]
  }
};

const fullPath = 'cache/todas_semanas_full.json';
const simplePath = 'cache/todas_semanas.json';

const fullData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
const simpleData = fs.existsSync(simplePath) ? JSON.parse(fs.readFileSync(simplePath, 'utf8')) : null;

for (const [w, rev] of Object.entries(revisaoData)) {
  if (fullData[w] && fullData[w].fimSemana) {
    fullData[w].fimSemana.revisao = rev;
    fullData[w].fimSemana.perguntasRevisao = rev.perguntas;
  }
  if (simpleData && simpleData[w] && simpleData[w].fimSemana) {
    simpleData[w].fimSemana.revisao = rev;
    simpleData[w].fimSemana.perguntasRevisao = rev.perguntas;
  }

  // Atualiza arquivos individuais
  const indFiles = [`cache/semana_2026_${w}.json`, `cache/semana_2026_${w}_full.json`, `cache/semana_2026_${w}_completa.json`];
  for (const f of indFiles) {
    if (fs.existsSync(f)) {
      try {
        const indData = JSON.parse(fs.readFileSync(f, 'utf8'));
        if (indData.fimSemana) {
          indData.fimSemana.revisao = rev;
          indData.fimSemana.perguntasRevisao = rev.perguntas;
          fs.writeFileSync(f, JSON.stringify(indData, null, 2), 'utf8');
        }
      } catch (e) {
        console.error(`Erro ao atualizar ${f}:`, e.message);
      }
    }
  }
}

fs.writeFileSync(fullPath, JSON.stringify(fullData, null, 2), 'utf8');
console.log(`✅ ${fullPath} atualizado com as perguntas de revisão.`);

if (simpleData) {
  fs.writeFileSync(simplePath, JSON.stringify(simpleData, null, 2), 'utf8');
  console.log(`✅ ${simplePath} atualizado com as perguntas de revisão.`);
}

import fs from 'node:fs';

const rawData = JSON.parse(fs.readFileSync('cache/semana_2026_43.json', 'utf8'));

// Lê o arquivo html do protótipo
let html = fs.readFileSync('C:/Users/lafai/.gemini/antigravity/brain/d4fc619c-9d66-4a9c-b20b-705733b77051/reuniao_prototipo.html', 'utf8');

// Atualiza o bloco de dados reais dentro do HTML
const realDataInjection = `
    // DADOS REAIS EXTRAÍDOS DO JW.ORG PARA A SEMANA ATUAL (${rawData.meioSemana.titulo})
    const dadosReaisJW = ${JSON.stringify(rawData)};
`;

// Substitui ou injeta os dados reais no HTML
html = html.replace(/\/\/ DADOS REAIS EXTRAÍDOS DO JW\.ORG[\s\S]*?const dadosReaisJW = [^;]+;/, '');
html = html.replace('<script>', `<script>\n${realDataInjection}`);

fs.writeFileSync('C:/Users/lafai/.gemini/antigravity/brain/d4fc619c-9d66-4a9c-b20b-705733b77051/reuniao_prototipo.html', html, 'utf8');
console.log('Dados reais injetados no protótipo HTML!');

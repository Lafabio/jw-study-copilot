import fs from 'node:fs';

const html = fs.readFileSync('temp_wcg13.html', 'utf8');

// Find all questions with textarea or p followed by gen-field
const qMatches = html.matchAll(/<p id="p(\d+)"[^>]*>([\s\S]*?)<\/p>\s*<div class="gen-field"/gi);
const questions = [];
for (const m of qMatches) {
  const qClean = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  questions.push({ pid: m[1], question: qClean });
}

console.log('Total questions found:', questions.length);
questions.forEach((q, i) => {
  console.log(`${i + 1}. [p${q.pid}] ${q.question}`);
});

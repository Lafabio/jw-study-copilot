import fs from 'node:fs';

const html = fs.readFileSync('temp_wcg13.html', 'utf8');

// Let's inspect all headings (h1, h2, h3, h4) and sections
const headings = [];
const hRegex = /<(h[1-4]|header|div class="bodyTxt")[^>]*>([\s\S]*?)<\/\1>/gi;
// Or let's see how WOL marks questions and paragraphs
console.log('--- BodyTxt snippet ---');
const bodyStart = html.indexOf('class="bodyTxt"');
console.log(html.substring(bodyStart, bodyStart + 4000));

import fs from 'node:fs';

const html = fs.readFileSync('temp_wcg13.html', 'utf8');

const p11Index = html.indexOf('data-pid="11"');
console.log(html.substring(p11Index, p11Index + 6000));

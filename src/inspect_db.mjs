import { DatabaseSync } from 'node:sqlite';

const dbPath = 'cache/extracted/inner/mwb_T_202409.db';
const db = new DatabaseSync(dbPath);

console.log('--- BIBLE CITATION TABLE ---');
const citations = db.prepare("SELECT * FROM BibleCitation LIMIT 10").all();
console.log(citations);

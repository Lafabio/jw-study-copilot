import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { DatabaseSync } from 'node:sqlite';

const MAGIC_XOR = Buffer.from('11cbb5587e32846d4c26790c633da289f66fe5842a3a585ce1bc3a294af5ada7', 'hex');

/**
 * Deriva a chave AES-128 e o IV a partir dos metadados da publicação
 */
export function deriveKeyAndIv(pubString) {
  const hash = crypto.createHash('sha256').update(pubString, 'utf8').digest();
  const material = Buffer.alloc(32);
  for (let i = 0; i < 32; i++) {
    material[i] = hash[i] ^ MAGIC_XOR[i];
  }
  return {
    key: material.subarray(0, 16),
    iv: material.subarray(16, 32)
  };
}

/**
 * Descriptografa e descomprime um blob MEPS do SQLite (Document.Content ou Extract.Content)
 */
export function decryptContent(cipherBlob, key, iv) {
  if (!cipherBlob || cipherBlob.length === 0) return '';
  const cipherBuffer = Buffer.isBuffer(cipherBlob) ? cipherBlob : Buffer.from(cipherBlob);
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    decipher.setAutoPadding(true);
    const decrypted = Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
    try {
      return zlib.inflateSync(decrypted).toString('utf8');
    } catch {
      return zlib.inflateRawSync(decrypted).toString('utf8');
    }
  } catch (err) {
    return null;
  }
}

/**
 * Consulta a API do jw.org para obter a URL direta de download do arquivo .jwpub
 */
export async function obterLinkDownloadJWPUB(pubSymbol, issue = null, lang = 'T') {
  let url = `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?pub=${encodeURIComponent(pubSymbol)}&fileformat=JWPUB&alllangs=0&langwritten=${lang}`;
  if (issue) {
    url += `&issue=${encodeURIComponent(issue)}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro na API do JW: status ${res.status}`);
  const data = await res.json();

  if (data.files && data.files[lang] && data.files[lang].JWPUB) {
    const item = data.files[lang].JWPUB[0];
    return {
      url: item.file.url,
      filesize: item.filesize,
      title: item.title,
      fileName: item.file.url.split('/').pop()
    };
  }
  return null;
}

/**
 * Lê uma publicação de um banco de dados .db já extraído de um .jwpub
 */
export function abrirPublicacaoDB(dbPath) {
  const db = new DatabaseSync(dbPath);
  const pub = db.prepare('SELECT * FROM Publication LIMIT 1').get();
  if (!pub) throw new Error('Tabela Publication não encontrada no banco.');

  // Constrói a pub_string oficial para derivar a chave
  const issue = (pub.IssueTagNumber && pub.IssueTagNumber !== '0') ? pub.IssueTagNumber : (pub.IssueNumber || null);
  const candidatePubStrings = [
    issue ? `${pub.MepsLanguageIndex}_${pub.Symbol}_${pub.Year}_${issue}` : null,
    `${pub.MepsLanguageIndex}_${pub.Symbol}_${pub.Year}`,
    pub.RootSymbol ? `${pub.MepsLanguageIndex}_${pub.RootSymbol}_${pub.RootYear || pub.Year}` : null
  ].filter(Boolean);

  let keyInfo = null;
  let testDoc = db.prepare('SELECT DocumentId, Content FROM Document WHERE Content IS NOT NULL LIMIT 1').get();

  for (const str of candidatePubStrings) {
    const k = deriveKeyAndIv(str);
    if (testDoc && testDoc.Content) {
      const testHtml = decryptContent(testDoc.Content, k.key, k.iv);
      if (testHtml) {
        keyInfo = { ...k, pubString: str };
        break;
      }
    }
  }

  if (!keyInfo) {
    // Tenta fallback com o primeiro candidato
    keyInfo = { ...deriveKeyAndIv(candidatePubStrings[0]), pubString: candidatePubStrings[0] };
  }

  return {
    publication: pub,
    pubString: keyInfo.pubString,
    listarDocumentos: () => {
      return db.prepare('SELECT DocumentId, Title, Subtitle, MepsDocumentId, ParagraphCount FROM Document ORDER BY DocumentId ASC').all();
    },
    obterDocumento: (docId) => {
      const doc = db.prepare('SELECT * FROM Document WHERE DocumentId = ?').get(docId);
      if (!doc) return null;
      const html = decryptContent(doc.Content, keyInfo.key, keyInfo.iv);
      return {
        ...doc,
        html: html
      };
    },
    fechar: () => {
      db.close();
    }
  };
}

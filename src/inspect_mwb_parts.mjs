async function inspectParts() {
  const res = await fetch('https://wol.jw.org/pt/wol/d/r5/lp-t/202024321');
  const html = await res.text();

  // Procurar por h3 ou textos com min
  const h3s = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('H3s encontrados:', h3s);

  // Procurar trechos com minutos: (X min)
  const itensComMinutos = [...html.matchAll(/<p[^>]*>(.*?\(.*?\d+\s*min.*?\).*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('\nItens com minutos encontrados:');
  for (const item of itensComMinutos) {
    console.log('-', item.substring(0, 120));
  }
}
inspectParts();

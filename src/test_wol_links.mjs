async function checkHrefs() {
  const res = await fetch('https://wol.jw.org/pt/wol/meetings/r5/lp-t/2024/36');
  const html = await res.text();
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  console.log('Total hrefs found:', hrefs.length);
  console.log('Filtered hrefs with wol:');
  for (const h of hrefs.filter(h => h.includes('wol') || h.includes('bin')).slice(0, 20)) {
    console.log(h);
  }
}
checkHrefs();

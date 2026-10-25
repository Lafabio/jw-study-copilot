async function checkAllWeeks() {
  const weeks = [
    { num: 43, year: 2026 },
    { num: 44, year: 2026 },
    { num: 45, year: 2026 },
    { num: 46, year: 2026 },
    { num: 47, year: 2026 }
  ];

  for (const w of weeks) {
    const hubUrl = `https://wol.jw.org/pt/wol/meetings/r5/lp-t/${w.year}/${w.num}`;
    const hubRes = await fetch(hubUrl);
    const hubHtml = await hubRes.text();
    const re = /href="(\/[a-z]{2}\/wol\/d\/r5\/lp-t\/[0-9]+)"/g;
    const hrefs = [];
    let m;
    while ((m = re.exec(hubHtml)) !== null) {
      if (!hrefs.includes(m[1])) hrefs.push(m[1]);
    }
    const sentUrl = 'https://wol.jw.org' + hrefs[1];
    const sentRes = await fetch(sentUrl);
    const sentHtml = await sentRes.text();

    console.log(`\n================= SEMANA ${w.num} =================`);
    console.log('URL:', sentUrl);

    // Let's find blockTeach or aside or review box
    const asideMatch = sentHtml.match(/<aside[\s\S]*?<\/aside>/i);
    if (asideMatch) {
      console.log('--- ASIDE FOUND ---');
      console.log(asideMatch[0]);
    } else {
      console.log('No aside found. Searching for blockTeach or boxTtl...');
      const bt = sentHtml.match(/<div[^>]*class="[^"]*blockTeach[^"]*"[\s\S]*?<\/div>\s*<\/div>/i);
      console.log(bt ? bt[0] : 'None');
    }
  }
}

checkAllWeeks();

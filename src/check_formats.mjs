async function checkPub(pub, issue) {
  const url = `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?pub=${pub}&issue=${issue}&fileformat=EPUB,JWPUB,PDF,RTF&alllangs=0&langwritten=T`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(`Pub: ${pub} | Issue: ${issue}`);
  if (data.files && data.files.T) {
    console.log('Available formats:', Object.keys(data.files.T));
    if (data.files.T.EPUB) {
      console.log('EPUB URL:', data.files.T.EPUB[0].file.url);
    }
    if (data.files.T.JWPUB) {
      console.log('JWPUB URL:', data.files.T.JWPUB[0].file.url);
    }
  } else {
    console.log('None found.');
  }
}

async function run() {
  await checkPub('w', '202409'); // A Sentinela Edição de Estudo
  await checkPub('mwb', '202411'); // Apostila Novembro
}
run();

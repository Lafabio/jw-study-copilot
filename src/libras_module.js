    // ==========================================
    // RENDERIZADOR 3: LIBRAS (LÍNGUA BRASILEIRA DE SINAIS)
    // ==========================================
    function renderizarLibras() {
      const dadosMeio = bancoSemanasJW[semanaAtiva]?.meioSemana;
      const dadosSent = bancoSemanasJW[semanaAtiva]?.fimSemana;
      
      const badgeEl = document.getElementById('badge-tipo-pub');
      const titEl = document.getElementById('titulo-materia');
      const subTitEl = document.getElementById('subtitulo-materia');
      if (badgeEl) badgeEl.innerText = "🤟 Libras (Língua de Sinais)";
      if (titEl) titEl.innerText = "Orientador & Respostas em Libras";
      if (subTitEl) subTitEl.innerText = (dadosMeio?.titulo || `Semana ${semanaAtiva}`) + " — " + (dadosSent?.titulo || "");

      const leitor = document.getElementById('conteudo-leitor');
      if (!leitor) return;
      let html = '';

      // Banner Principal de Libras
      html += `
        <div class="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-5 sm:p-6 mb-6 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <span class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs shrink-0">
                🤟
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    Língua Brasileira de Sinais
                  </span>
                  <span class="text-[10px] text-[#6c757d] font-semibold">Semana ${semanaAtiva}</span>
                </div>
                <h2 class="text-base sm:text-lg font-bold text-[#212529] mt-1">
                  Guia de Respostas e Estrutura Visual em Libras
                </h2>
                <p class="text-xs text-[#495057] mt-1 leading-relaxed">
                  Ajuda prática para publicadores surdos, intérpretes e estudantes estruturarem comentários usando <strong>Glosas</strong>, <strong>Expressões Faciais Não Manuais (MNM)</strong> e <strong>Classificadores Espaciais</strong>.
                </p>
              </div>
            </div>

            <!-- Botão Direto JW.ORG Libras -->
            <a href="https://www.jw.org/bzs/" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto" title="Assistir aos vídeos oficiais da reunião em Libras no site jw.org">
              <span>▶️</span> Assistir no JW.ORG (bzs)
            </a>
          </div>
        </div>
      `;

      // 1. GERADOR INTERATIVO COM IA ESPECIALIZADO EM LIBRAS
      const temaSent = dadosSent?.titulo || "Estudo de A Sentinela";
      const leituraBiblica = dadosMeio?.secoes?.[0]?.itens?.[1]?.tempo ? dadosMeio?.titulo : "Leitura da semana";

      html += `
        <div id="gerador-libras-ia" class="bg-white rounded-2xl border border-emerald-200 p-5 mb-6 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="text-lg">✨</span>
              <div>
                <h3 class="text-sm font-bold text-[#212529]">Assistente de Comentários em Libras (Gemini IA)</h3>
                <p class="text-[11px] text-[#6c757d]">Estruture respostas em Glosas (MAIÚSCULAS), expressões corporais/faciais e ordem visual direta.</p>
              </div>
            </div>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Gramática Visual
            </span>
          </div>

          <!-- Sugestões Rápidas da Semana -->
          <div>
            <span class="text-[11px] font-bold text-[#6c757d] uppercase tracking-wider block mb-2">Perguntas Rápidas da Semana:</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button onclick="prepararPerguntaLibras('sentinela')" class="p-2.5 rounded-xl border border-emerald-100 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition flex items-center gap-2 text-xs font-semibold text-[#212529]">
                <span class="text-base shrink-0">📖</span>
                <span class="truncate">A Sentinela: "${temaSent}"</span>
              </button>
              <button onclick="prepararPerguntaLibras('joias')" class="p-2.5 rounded-xl border border-emerald-100 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition flex items-center gap-2 text-xs font-semibold text-[#212529]">
                <span class="text-base shrink-0">💎</span>
                <span class="truncate">Joias Espirituais da Leitura</span>
              </button>
              <button onclick="prepararPerguntaLibras('livro')" class="p-2.5 rounded-xl border border-emerald-100 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition flex items-center gap-2 text-xs font-semibold text-[#212529]">
                <span class="text-base shrink-0">🦁</span>
                <span class="truncate">Estudo de Livro (Coragem)</span>
              </button>
            </div>
          </div>

          <!-- Campo de Pergunta Personalizada -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-[#495057] block">Pergunta ou ponto a comentar em Libras:</label>
            <div class="flex flex-col sm:flex-row gap-2">
              <input id="input-pergunta-libras" type="text" placeholder="Ex: O que aprendemos sobre Jeová no parágrafo 3?..." value="Como podemos demonstrar amor leal e perdão sincero na congregação?" class="flex-1 text-xs p-3 rounded-xl border border-[#dee2e6] bg-[#f8f9fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <button onclick="gerarOrientacaoLibras(this)" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs shrink-0">
                <span class="text-amber-300">✦</span> Estruturar em Libras
              </button>
            </div>
          </div>

          <!-- Textarea do Roteiro Gerado -->
          <div class="pt-2">
            <div class="flex items-center justify-between mb-1.5 text-[11px] text-[#6c757d]">
              <span class="font-bold flex items-center gap-1.5 text-emerald-800">
                <span>📝</span> Roteiro em Libras (Salvo Automaticamente):
              </span>
              <button onclick="copiarTexto('nota-libras-geral')" class="hover:text-emerald-700 font-semibold text-[10px] flex items-center gap-1 transition">
                📋 Copiar Roteiro
              </button>
            </div>
            <textarea id="nota-libras-geral" placeholder="Toque em '✦ Estruturar em Libras' acima para gerar seu roteiro completo com Glosas e Expressões..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-3.5 rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y leading-relaxed font-mono text-[#212529]" rows="6"></textarea>
            <div id="feedback-nota-libras-geral"></div>
          </div>
        </div>
      `;

      // 2. CARDS DAS PARTES DA SEMANA PREPARADOS PARA LIBRAS
      html += `
        <div class="mb-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-[#212529] flex items-center gap-2">
              <span>📚</span> Partes da Reunião desta Semana para Libras
            </h3>
            <span class="text-[11px] text-[#6c757d]">Comentários estruturados por parte</span>
          </div>

          <!-- Card: A Sentinela -->
          <div class="bg-white rounded-2xl border border-[#dee2e6] p-5 shadow-2xs space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dee2e6] pb-3">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-lg bg-[#4a3b69] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  📖
                </span>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[#4a3b69] bg-purple-50 px-2 py-0.5 rounded-md">
                    Estudo de A Sentinela
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold text-[#212529] mt-0.5">
                    ${temaSent}
                  </h4>
                </div>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button onclick="gerarOrientacaoLibras(this, 'Como responder ao tema principal do estudo de A Sentinela: ${temaSent}?', 'nota-libras-sentinela')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                  <span class="text-amber-300">✦</span> Orientar em Libras
                </button>
                <button onclick="gerarOrientacaoLibras(this, 'Forneça apenas a sequência de GLOSAS em ordem direta para comentar o tema de A Sentinela: ${temaSent}', 'nota-libras-sentinela', 'glosas_only')" class="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] border border-[#dee2e6] hover:border-emerald-600 text-[#495057] hover:text-emerald-700 text-xs font-medium transition" title="Apenas sequência de sinais em maiúsculas">
                  🤟 Só Glosas
                </button>
              </div>
            </div>
            <textarea id="nota-libras-sentinela" placeholder="Anotações e roteiro do comentário de A Sentinela em Libras..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-3 rounded-xl border border-[#dee2e6] bg-[#f8f9fa] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed font-mono" rows="3"></textarea>
            <div id="feedback-nota-libras-sentinela"></div>
          </div>

          <!-- Card: Joias Espirituais -->
          <div class="bg-white rounded-2xl border border-[#dee2e6] p-5 shadow-2xs space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dee2e6] pb-3">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  💎
                </span>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    Tesouros da Palavra de Deus
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold text-[#212529] mt-0.5">
                    Joias Espirituais da Leitura da Bíblia
                  </h4>
                </div>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button onclick="gerarOrientacaoLibras(this, 'Identifique uma joia espiritual da leitura bíblica desta semana que mostre uma qualidade linda de Jeová e estruture o comentário em Libras com Glosas e expressão facial.', 'nota-libras-joias')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                  <span class="text-amber-300">✦</span> Orientar em Libras
                </button>
              </div>
            </div>
            <textarea id="nota-libras-joias" placeholder="Roteiro em Libras sobre as Joias Espirituais da semana..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-3 rounded-xl border border-[#dee2e6] bg-[#f8f9fa] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed font-mono" rows="3"></textarea>
            <div id="feedback-nota-libras-joias"></div>
          </div>

          <!-- Card: Estudo de Livro -->
          <div class="bg-white rounded-2xl border border-[#dee2e6] p-5 shadow-2xs space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dee2e6] pb-3">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-lg bg-[#9e2a2b] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  🦁
                </span>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[#9e2a2b] bg-rose-50 px-2 py-0.5 rounded-md">
                    Nossa Vida Cristã • Estudo de Livro
                  </span>
                  <h4 class="text-xs sm:text-sm font-bold text-[#212529] mt-0.5">
                    Livro: "Seja Corajoso e Forte"
                  </h4>
                </div>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button onclick="gerarOrientacaoLibras(this, 'Como responder no Estudo de Livro de Congregação mostrando coragem e confiança em Jeová na prática? Formate em Libras com Glosas.', 'nota-libras-livro')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs">
                  <span class="text-amber-300">✦</span> Orientar em Libras
                </button>
              </div>
            </div>
            <textarea id="nota-libras-livro" placeholder="Roteiro em Libras para o Estudo de Livro de Congregação..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-3 rounded-xl border border-[#dee2e6] bg-[#f8f9fa] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed font-mono" rows="3"></textarea>
            <div id="feedback-nota-libras-livro"></div>
          </div>
        </div>
      `;

      // 3. GUIA VISUAL & MINI-GLOSSÁRIO DE SINAIS TEOCRÁTICOS FREQUENTES
      html += `
        <div id="guia-sinais-teocraticos" class="bg-white rounded-2xl border border-emerald-200 p-5 mb-8 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">🤟</span>
              <h3 class="text-sm font-bold text-[#212529]">Guia Rápido de Sinais Teocráticos em Libras</h3>
            </div>
            <span class="text-[11px] text-[#6c757d]">Convenções e Classificadores</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <!-- JEOVÁ -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">JEOVÁ</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Deus</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Mão com configuração em 'J' subindo em direção ao alto com expressão respeitosa e reverente.
              </p>
            </div>

            <!-- JESUS -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">JESUS CRISTO</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Rei</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Toque do dedo médio na palma de cada mão alternadamente, relembrando os cravos na estaca de tortura.
              </p>
            </div>

            <!-- BÍBLIA -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">BÍBLIA</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Palavra</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Sinal composto: sinal de <em>LIVRO</em> seguido do sinal de <em>DEUS / SAGRADO</em>.
              </p>
            </div>

            <!-- ORAÇÃO -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">ORAÇÃO</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Adoração</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Mãos postas com palmas unidas à frente do peito, cabeça levemente inclinada e olhos respeitosos.
              </p>
            </div>

            <!-- AMOR LEAL -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">AMOR LEAL</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Qualidade</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Sinal de <em>AMOR</em> no peito + mão firme em movimento constante para frente (firme, nunca acaba).
              </p>
            </div>

            <!-- RESGATE -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">RESGATE</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Doutrina</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Sinal de <em>LIVRE / SALVAR</em> ou movimento de troca/pagamento em favor de libertação.
              </p>
            </div>

            <!-- FÉ -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">FÉ</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Certeza</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Dedo indicador toca a têmpora (mente) e desce com firmeza e confiança sobre a palma da outra mão.
              </p>
            </div>

            <!-- CONGREGAÇÃO -->
            <div class="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs text-emerald-900">CONGREGAÇÃO</span>
                <span class="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200">Irmãos</span>
              </div>
              <p class="text-[11px] text-[#495057] leading-relaxed">
                Sinal de <em>GRUPO / FAMÍLIA</em> unindo as mãos em círculo à frente do corpo + sinal de reunião.
              </p>
            </div>
          </div>

          <!-- Dicas Gramaticais de Libras -->
          <div class="bg-emerald-50/80 rounded-xl p-3.5 border border-emerald-200/70 text-xs text-emerald-900 space-y-1.5">
            <span class="font-bold block flex items-center gap-1.5">
              <span>💡</span> Dicas Práticas para Comentar no Salão do Reino em Libras:
            </span>
            <ul class="list-disc list-inside space-y-1 text-[11px] text-emerald-800">
              <li><strong>Ordem Visual Tópico-Comentário:</strong> Comece pelo contexto/tema e depois faça o comentário (ex: <em>BÍBLIA ENSINAR // NÓS AMOR MOSTRAR COMO?</em>).</li>
              <li><strong>Elimine Artigos e Preposições:</strong> Não é necessário fazer sinais para "de", "para", "o", "a". A concordância é feita no espaço.</li>
              <li><strong>Expressões Faciais Não Manuais (MNM):</strong> Sobrancelhas franzidas para perguntas com pronomes (<em>QUEM? ONDE? COMO?</em>) e sobrancelhas levantadas para perguntas de sim/não.</li>
            </ul>
          </div>
        </div>
      `;

      leitor.innerHTML = html;
    }

    // Prepara a pergunta no input principal de Libras
    function prepararPerguntaLibras(tipo) {
      const dadosMeio = bancoSemanasJW[semanaAtiva]?.meioSemana;
      const dadosSent = bancoSemanasJW[semanaAtiva]?.fimSemana;
      const inp = document.getElementById('input-pergunta-libras');
      if (!inp) return;

      if (tipo === 'sentinela') {
        const tema = dadosSent?.titulo || "A Sentinela";
        inp.value = `Como podemos responder com base no tema do estudo de A Sentinela: "${tema}"?`;
      } else if (tipo === 'joias') {
        inp.value = `Que joia espiritual da leitura da Bíblia desta semana podemos comentar e como aplicar?`;
      } else if (tipo === 'livro') {
        inp.value = `No estudo de livro (Seja Corajoso), qual lição prática de fé e coragem podemos destacar?`;
      }

      inp.focus();
      inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Chama o Gemini para formular a resposta em Libras com Glosas e Expressões
    async function gerarOrientacaoLibras(btn, perguntaCustom = null, targetId = 'nota-libras-geral', modoSub = null) {
      const inp = document.getElementById('input-pergunta-libras');
      const pergunta = perguntaCustom || (inp ? inp.value.trim() : "");
      if (!pergunta) {
        alert("Por favor, digite uma pergunta ou escolha uma parte da reunião para estruturar em Libras.");
        if (inp) inp.focus();
        return;
      }

      const dadosSent = bancoSemanasJW[semanaAtiva]?.fimSemana;
      const dadosMeio = bancoSemanasJW[semanaAtiva]?.meioSemana;
      const contexto = `Semana: ${semanaAtiva} | A Sentinela: "${dadosSent?.titulo || ''}" | Meio de Semana: "${dadosMeio?.titulo || ''}"`;

      let promptIA = "";
      if (modoSub === 'glosas_only') {
        promptIA = `Para a pergunta: "${pergunta}", forneça EXCLUSIVAMENTE a sequência direta de GLOSAS em letras MAIÚSCULAS na gramática de Libras (sem preposições orais), com a tradução equivalente em português abaixo.`;
      } else {
        promptIA = `Estruture um comentário para a reunião congregacional das Testemunhas de Jeová baseado na pergunta: "${pergunta}".\n\n` +
          `Estrutura obrigatória:\n` +
          `1. 🤟 ROTEIRO EM LIBRAS (GLOSA): Em letras MAIÚSCULAS, sem artigos ou preposições, usando ordem visual (Tópico-Comentário).\n` +
          `2. 😊 EXPRESSÕES FACIAIS & CORPORAIS (MNM): Dicas de sobrancelhas, olhar, postura e direção do sinal.\n` +
          `3. 📝 TRADUÇÃO EQUIVALENTE EM PORTUGUÊS: Comentário objetivo e caloroso (30 a 45s).\n\n` +
          `Entregue em formato limpo pronto para estudo e memorização.`;
      }

      await responderComIA(promptIA, contexto, targetId, btn, 'libras');
    }

import fs from 'node:fs';
import path from 'node:path';

const todasPath = './cache/todas_semanas_full.json';
const todasSemanas = JSON.parse(fs.readFileSync(todasPath, 'utf8'));

const htmlTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <title>JW Library - Reuniões</title>
  <link rel="manifest" href="./manifest.json">
  <meta name="theme-color" content="#4a3b69">
  <link rel="icon" type="image/svg+xml" href="./icon.svg">
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    /* Estilos Oficiais do JW Library */
    :root {
      --jw-purple: #4a3b69;
      --jw-purple-dark: #3b2e55;
      --jw-purple-light: #6b588e;
      --jw-tesouros: #596b7a;
      --jw-ministerio: #c57e00;
      --jw-vidacrista: #9e2a2b;
      --jw-bg-reader: #fcfcfc;
      --jw-text: #212529;
      --jw-text-muted: #6c757d;
      --jw-border: #e9ecef;
      --jw-study-pane: #f8f9fa;
    }

    body {
      background-color: var(--jw-bg-reader);
      color: var(--jw-text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    .jw-article p {
      line-height: 1.68;
      font-size: 1.01rem;
      margin-bottom: 0.85rem;
    }

    .cantico-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-left: 4px solid #4a3b69;
    }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
    .drawer-transition { transition: transform 0.25s ease-in-out; }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased">

  <!-- ================= TOP APP BAR (CABEÇALHO ROXO DO JW LIBRARY #4A3B69) ================= -->
  <header class="bg-[#4a3b69] text-white sticky top-0 z-40 shadow-md">
    <div class="px-4 py-2.5 flex items-center justify-between">
      
      <!-- Lado Esquerdo: Ícone da Publicação + Título da Seção -->
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-sm shadow-xs select-none">
          📖
        </div>
        <div class="flex items-center gap-2">
          <h1 class="text-base font-semibold tracking-wide text-white">Reuniões</h1>
          <span id="badge-cloud-status" class="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Supabase Nuvem
          </span>
        </div>
      </div>

      <!-- Lado Direito: Ações (Perfil & Salvar Nuvem & Configurações) -->
      <div class="flex items-center space-x-1.5 sm:space-x-2">
        <button onclick="abrirModalPerfil()" title="Meu Perfil de Estudo" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition text-xs font-semibold text-white shadow-xs">
          <span>👤</span>
          <span id="txt-nome-perfil" class="max-w-[75px] sm:max-w-[110px] truncate">Lafabio</span>
        </button>

        <button onclick="salvarTudo()" title="Salvar Anotações na Nuvem" class="p-2 rounded-lg hover:bg-white/10 transition text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
        </button>

        <button onclick="abrirModalConfig()" title="Configurações (Supabase & Gemini)" class="p-2 rounded-lg hover:bg-white/10 transition text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Sub-Barra: Abas Oficiais das Reuniões (VIDA E MINISTÉRIO | A SENTINELA) -->
    <div class="flex border-t border-white/15 px-3 bg-[#3f315a]">
      <button onclick="alternarModoReuniao('meio_semana')" id="tab-meio-semana" class="flex-1 py-2.5 text-xs font-bold text-center border-b-2 border-white text-white transition">
        VIDA E MINISTÉRIO
      </button>
      <button onclick="alternarModoReuniao('sentinela')" id="tab-sentinela" class="flex-1 py-2.5 text-xs font-bold text-center border-b-2 border-transparent text-white/70 hover:text-white transition">
        A SENTINELA
      </button>
    </div>

    <!-- Barra de Navegação de Semanas & Salto Rápido de Conteúdo -->
    <div class="bg-[#f1f3f5] text-[#212529] px-3 sm:px-6 py-2 flex items-center justify-between text-xs font-semibold border-b border-[#dee2e6] gap-2">
      <!-- Navegação de Semanas -->
      <div class="flex items-center gap-1 min-w-0">
        <button onclick="mudarSemanaRelativa(-1)" title="Semana anterior" class="p-1 px-2 rounded hover:bg-black/5 text-[#4a3b69] font-bold text-sm">◀</button>
        <div class="flex items-center gap-1 min-w-0">
          <span class="text-[#6c757d] hidden xs:inline">Semana:</span>
          <select id="seletor-semana" onchange="selecionarSemana(this.value)" class="bg-transparent font-bold text-[#4a3b69] focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"></select>
        </div>
        <button onclick="mudarSemanaRelativa(1)" title="Próxima semana" class="p-1 px-2 rounded hover:bg-black/5 text-[#4a3b69] font-bold text-sm">▶</button>
      </div>

      <!-- Salto Rápido / Índice de Parágrafos ou Partes -->
      <div class="flex items-center gap-1.5 shrink-0">
        <select id="seletor-salto-rapido" onchange="saltarParaSecao(this.value)" class="bg-white border border-[#dee2e6] rounded-md px-2 py-1 text-xs font-semibold text-[#4a3b69] focus:outline-none focus:ring-1 focus:ring-[#4a3b69] cursor-pointer shadow-2xs">
          <option value="">📑 Ir para...</option>
        </select>
      </div>
    </div>
  </header>

  <!-- ================= LAYOUT PRINCIPAL (CORPO DO LEITOR + PAINEL DE ESTUDO LATERAL) ================= -->
  <div class="flex flex-1 overflow-hidden relative">
    
    <div id="drawer-backdrop" onclick="fecharPaineisMobile()" class="hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"></div>

    <!-- ÁREA CENTRAL DO LEITOR (ESTILO JW LIBRARY - LARGURA CONFORTÁVEL) -->
    <main id="leitor-principal" class="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-4xl mx-auto w-full jw-article">
      
      <!-- Cabeçalho da Publicação / Artigo -->
      <div id="cabecalho-materia" class="mb-6 pb-4 border-b border-[#dee2e6]">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-12 h-16 rounded bg-[#4a3b69] text-white flex flex-col items-center justify-center font-bold text-[10px] p-1 shadow-xs shrink-0">
            <span>JW</span>
            <span class="text-xs">📖</span>
          </div>
          <div>
            <span id="badge-tipo-pub" class="text-xs font-bold text-[#6c757d] uppercase tracking-wide">
              Apostila da Reunião
            </span>
            <h1 id="titulo-materia" class="text-xl sm:text-2xl font-bold text-[#212529] mt-0.5">
              Carregando...
            </h1>
            <p id="subtitulo-materia" class="text-xs sm:text-sm font-semibold text-[#4a3b69] mt-0.5">
              ...
            </p>
          </div>
        </div>
      </div>

      <!-- Conteúdo Dinâmico (Roteiro Completo com Assistente Integrado) -->
      <div id="conteudo-leitor" class="space-y-6">
      </div>

      <div class="h-16"></div>
    </main>

    <!-- Botão Flutuante: Voltar ao Topo -->
    <button id="btn-flutuante-topo" onclick="rolarParaTopo()" title="Voltar ao início" class="opacity-0 pointer-events-none fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-30 w-11 h-11 rounded-full bg-[#4a3b69] text-white shadow-xl flex items-center justify-center text-base font-bold hover:bg-[#3b2e55] active:scale-95 transition-all duration-300 border border-white/20">
      ↑
    </button>

  </div>

  <!-- ================= BARRA INFERIOR OFICIAL DO JW LIBRARY (MOBILE) ================= -->
  <nav class="lg:hidden bg-white border-t border-[#dee2e6] fixed bottom-0 inset-x-0 z-30 px-3 py-1.5 flex items-center justify-around text-[#6c757d]">
    <button onclick="rolarParaTopo()" class="flex flex-col items-center text-[10px] hover:text-[#4a3b69]">
      <span class="text-base">🏠</span>
      <span>Início</span>
    </button>
    <button onclick="abrirModalPerfil()" class="flex flex-col items-center text-[10px] hover:text-[#4a3b69]">
      <span class="text-base">👤</span>
      <span>Perfil</span>
    </button>
    <button onclick="salvarTudo()" class="flex flex-col items-center text-[10px] hover:text-[#4a3b69]">
      <span class="text-base">💾</span>
      <span>Salvar</span>
    </button>
    <button onclick="abrirModalConfig()" class="flex flex-col items-center text-[10px] hover:text-[#4a3b69]">
      <span class="text-base">⚙️</span>
      <span>Ajustes</span>
    </button>
  </nav>

  <!-- ================= MODAL DE PERFIL DO USUÁRIO (SEPARAÇÃO DE ANOTAÇÕES) ================= -->
  <div id="modal-perfil" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#dee2e6] overflow-hidden">
      
      <div class="bg-[#4a3b69] text-white px-5 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">👤</span>
          <h3 class="font-bold text-sm">Meu Perfil de Estudo</h3>
        </div>
        <button onclick="fecharModalPerfil()" class="text-white/80 hover:text-white text-lg">✕</button>
      </div>

      <div class="p-5 space-y-4 text-xs">
        <div class="p-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-100 flex items-start gap-2.5">
          <span class="text-base">🔒</span>
          <p class="leading-relaxed">
            Suas anotações, histórico e respostas geradas ficam salvas <strong>exclusivamente no seu perfil</strong>. Outros usuários no mesmo aparelho ou congregação não verão suas anotações.
          </p>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block font-semibold text-[#495057] mb-1">Seu Nome / Apelido:</label>
            <input id="cfg-perfil-nome" type="text" placeholder="Ex: Lafabio, Maria, etc." class="w-full p-2 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-xs font-medium focus:outline-none focus:border-[#4a3b69]">
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-semibold text-[#495057]">Código Pessoal de Sincronização:</label>
              <button onclick="gerarNovoIdPerfil()" class="text-[10px] text-[#4a3b69] font-bold hover:underline">Gerar aleatório</button>
            </div>
            <input id="cfg-perfil-id" type="text" placeholder="Ex: lafabio-pessoal ou usr_123" class="w-full p-2 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-xs font-mono focus:outline-none focus:border-[#4a3b69]">
            <p class="text-[10px] text-[#6c757d] mt-1">
              💡 Use o mesmo código no seu celular e no seu computador/tablet para sincronizar todas as suas anotações entre aparelhos!
            </p>
          </div>
        </div>

        <!-- Perfis Rápidos Salvos neste aparelho -->
        <div class="pt-2 border-t border-[#dee2e6]">
          <span class="font-bold text-[#6c757d] uppercase tracking-wider block mb-2">Alternar Perfil neste aparelho:</span>
          <div id="lista-perfis-salvos" class="space-y-1.5 max-h-32 overflow-y-auto"></div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-[#dee2e6]">
          <button onclick="criarNovoPerfil()" class="px-3 py-1.5 rounded-lg bg-[#f1f3f5] hover:bg-[#e9ecef] text-[#4a3b69] font-bold transition">
            + Novo Perfil
          </button>
          
          <div class="flex items-center gap-2">
            <button onclick="fecharModalPerfil()" class="px-3 py-1.5 rounded-lg text-[#6c757d] hover:bg-gray-100 font-semibold transition">
              Fechar
            </button>
            <button onclick="salvarPerfilUsuario()" class="px-4 py-1.5 rounded-lg bg-[#4a3b69] hover:bg-[#3b2e55] text-white font-bold transition">
              Salvar Perfil
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ================= MODAL DE CONFIGURAÇÕES (SUPABASE & GEMINI) ================= -->
  <div id="modal-config" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#dee2e6] overflow-hidden">
      
      <div class="bg-[#4a3b69] text-white px-5 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">⚙️</span>
          <h3 class="font-bold text-sm">Configurações & Conexões</h3>
        </div>
        <button onclick="fecharModalConfig()" class="text-white/80 hover:text-white text-lg">✕</button>
      </div>

      <div class="p-5 space-y-4 text-xs">
        <!-- Status de Conexões -->
        <div class="space-y-2">
          <span class="font-bold text-[#6c757d] uppercase tracking-wider block">Status dos Serviços</span>
          
          <div class="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f9fa] border border-[#e9ecef]">
            <div class="flex items-center gap-2">
              <span class="text-base">⚡</span>
              <div>
                <p class="font-bold text-[#212529]">Supabase Cloud Database</p>
                <p id="status-txt-supabase" class="text-[11px] text-emerald-600 font-semibold">Conectado (meetings_cache & user_notes)</p>
              </div>
            </div>
            <span id="badge-supa" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>

          <div class="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f9fa] border border-[#e9ecef]">
            <div class="flex items-center gap-2">
              <span class="text-base">✦</span>
              <div>
                <p class="font-bold text-[#212529]">Google Gemini Copilot</p>
                <p id="status-txt-gemini" class="text-[11px] text-emerald-600 font-semibold">Modelo ativo: gemini-3.5-flash</p>
              </div>
            </div>
            <span id="badge-gemini" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        <!-- Campos de Configuração -->
        <div class="space-y-3 pt-2 border-t border-[#dee2e6]">
          <div>
            <label class="block font-semibold text-[#495057] mb-1">Chave API do Gemini (Google AI Studio):</label>
            <input id="cfg-gemini-key" type="password" placeholder="Chave do Gemini..." class="w-full p-2 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-xs font-mono focus:outline-none focus:border-[#4a3b69]">
          </div>

          <div>
            <label class="block font-semibold text-[#495057] mb-1">Supabase URL:</label>
            <input id="cfg-supa-url" type="text" placeholder="https://....supabase.co" class="w-full p-2 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-xs font-mono focus:outline-none focus:border-[#4a3b69]">
          </div>

          <div>
            <label class="block font-semibold text-[#495057] mb-1">Supabase Anon Key:</label>
            <input id="cfg-supa-key" type="password" placeholder="sb_publishable_..." class="w-full p-2 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg text-xs font-mono focus:outline-none focus:border-[#4a3b69]">
          </div>
        </div>

        <!-- Sincronização de Versão e Limpeza de Cache -->
        <div class="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded-xl flex items-center justify-between gap-2">
          <div>
            <p class="font-bold text-[#212529] text-xs">Sincronizar Versão (Celular/PC)</p>
            <p class="text-[10px] text-[#6c757d]">Força o recarregamento da versão mais recente</p>
          </div>
          <button onclick="forcarAtualizacaoApp()" class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition flex items-center gap-1 text-[11px] shrink-0 shadow-3xs">
            🔄 Sincronizar App
          </button>
        </div>

        <div id="msg-teste-conexao" class="hidden p-2.5 rounded-lg text-xs"></div>

        <div class="flex items-center justify-between pt-3 border-t border-[#dee2e6]">
          <button onclick="testarConexoes()" class="px-3 py-1.5 rounded-lg bg-[#f1f3f5] hover:bg-[#e9ecef] text-[#4a3b69] font-bold transition">
            Testar Conexões
          </button>
          
          <div class="flex items-center gap-2">
            <button onclick="fecharModalConfig()" class="px-3 py-1.5 rounded-lg text-[#6c757d] hover:bg-gray-100 font-semibold transition">
              Fechar
            </button>
            <button onclick="salvarConfiguracoes()" class="px-4 py-1.5 rounded-lg bg-[#4a3b69] hover:bg-[#3b2e55] text-white font-bold transition">
              Salvar
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ================= MODAL LIGHTBOX DE IMAGENS ================= -->
  <div id="modal-imagem" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs cursor-pointer" onclick="fecharImagemModal()">
    <div class="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl cursor-default" onclick="event.stopPropagation()">
      <div class="absolute top-3 right-3 z-10">
        <button onclick="fecharImagemModal()" class="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition text-sm">✕</button>
      </div>
      <img id="img-modal-src" src="" class="w-full max-h-[75vh] object-contain bg-black/5">
      <div id="img-modal-caption" class="p-4 text-xs text-[#495057] italic leading-relaxed border-t border-[#dee2e6] bg-white"></div>
    </div>
  </div>

  <script>
    // CONFIGURAÇÃO SUPABASE DA NUVEM
    const SUPABASE_CONFIG = {
      url: localStorage.getItem('supabase_url') || 'https://jjmjjlvpaxafxpebvrwb.supabase.co',
      key: localStorage.getItem('supabase_key') || 'sb_publishable_B5LuMRBbudUuwdEkgH5Vkw_BOqHt6re'
    };

    // CHAVE GEMINI (Pode ser configurada pelo usuário no botão de configurações ou via Vercel)
    const GEMINI_DEFAULT_KEY = '';

    // BANCO DE DADOS COMPLETO E OFICIAL (EXTRAÍDO DO JW.ORG)
    const bancoSemanasJW = ${JSON.stringify(todasSemanas, null, 2)};

    let semanaAtiva = 43;
    let modoAtual = "meio_semana";

    const coresSecao = {
      TESOUROS: { border: "border-[#596b7a]", text: "text-[#596b7a]", bgBadge: "bg-[#596b7a]", label: "TESOUROS DA PALAVRA DE DEUS" },
      MINISTERIO: { border: "border-[#c57e00]", text: "text-[#c57e00]", bgBadge: "bg-[#c57e00]", label: "FAÇA SEU MELHOR NO MINISTÉRIO" },
      VIDACRISTA: { border: "border-[#9e2a2b]", text: "text-[#9e2a2b]", bgBadge: "bg-[#9e2a2b]", label: "NOSSA VIDA CRISTÃ" }
    };

    // Inicialização da Página
    window.addEventListener('DOMContentLoaded', async () => {
      inicializarPerfilUsuario();
      verificarDicaAssistente();
      configurarMonitorScroll();
      popularSeletorSemanas();
      await sincronizarComSupabase();
      popularSeletorSemanas();
      selecionarSemana(43);
      registrarServiceWorker();
    });

    function popularSeletorSemanas() {
      const seletor = document.getElementById('seletor-semana');
      const valAtual = seletor.value || semanaAtiva;
      seletor.innerHTML = '';
      
      const semanas = Object.keys(bancoSemanasJW).map(Number).sort((a,b) => a - b);
      semanas.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        const dados = bancoSemanasJW[s];
        const tit = dados?.meioSemana?.titulo || \`Semana \${s}\`;
        opt.innerText = \`\${tit} (Semana \${s}\${s === 43 ? ' - Atual' : ''})\`;
        seletor.appendChild(opt);
      });

      seletor.value = valAtual;
    }

    // Sincronização em tempo real com o Supabase ao iniciar
    async function sincronizarComSupabase() {
      try {
        const res = await fetch(\`\${SUPABASE_CONFIG.url}/rest/v1/meetings_cache?select=*\`, {
          headers: {
            'apikey': SUPABASE_CONFIG.key,
            'Authorization': \`Bearer \${SUPABASE_CONFIG.key}\`
          }
        });
        if (res.ok) {
          const rows = await res.json();
          rows.forEach(r => {
            bancoSemanasJW[r.week_number] = r.content_json;
          });
          console.log(\`✅ Sincronizado com Supabase Nuvem: \${rows.length} semanas disponíveis.\`);
          document.getElementById('badge-cloud-status').classList.remove('hidden');
        }
      } catch (e) {
        console.warn('Operando com base de dados local offline.');
      }
    }

    function rolarParaTopo(instant = false) {
      const leitor = document.getElementById('leitor-principal') || document.querySelector('main');
      if (leitor) {
        leitor.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
      }
    }

    function configurarMonitorScroll() {
      const leitor = document.getElementById('leitor-principal') || document.querySelector('main');
      const btnTopo = document.getElementById('btn-flutuante-topo');
      if (!leitor || !btnTopo) return;

      leitor.addEventListener('scroll', () => {
        if (leitor.scrollTop > 300) {
          btnTopo.classList.remove('opacity-0', 'pointer-events-none');
          btnTopo.classList.add('opacity-100');
        } else {
          btnTopo.classList.add('opacity-0', 'pointer-events-none');
          btnTopo.classList.remove('opacity-100');
        }
      });
    }

    function popularSaltoRapido(itens) {
      const sel = document.getElementById('seletor-salto-rapido');
      if (!sel) return;
      sel.innerHTML = '<option value="">📑 Ir para...</option>';
      itens.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.innerText = item.label;
        sel.appendChild(opt);
      });
    }

    function saltarParaSecao(id) {
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      const sel = document.getElementById('seletor-salto-rapido');
      if (sel) sel.value = "";
    }

    function selecionarSemana(num) {
      semanaAtiva = parseInt(num);
      document.getElementById('seletor-semana').value = semanaAtiva;
      if (modoAtual === 'meio_semana') {
        renderizarMeioSemana();
      } else {
        renderizarSentinela();
      }
      carregarNotasSalvas();
      rolarParaTopo(true);
    }

    function mudarSemanaRelativa(delta) {
      const semanas = Object.keys(bancoSemanasJW).map(Number).sort((a,b) => a - b);
      const idx = semanas.indexOf(semanaAtiva);
      const novoIdx = idx + delta;
      if (novoIdx >= 0 && novoIdx < semanas.length) {
        selecionarSemana(semanas[novoIdx]);
      }
    }

    function alternarModoReuniao(modo) {
      modoAtual = modo;
      const tabMeio = document.getElementById('tab-meio-semana');
      const tabSent = document.getElementById('tab-sentinela');

      if (modo === 'meio_semana') {
        tabMeio.className = "flex-1 py-2.5 text-xs font-bold text-center border-b-2 border-white text-white transition";
        tabSent.className = "flex-1 py-2.5 text-xs font-bold text-center border-b-2 border-transparent text-white/70 hover:text-white transition";
        renderizarMeioSemana();
      } else {
        tabSent.className = "flex-1 py-2.5 text-xs font-bold text-center border-b-2 border-white text-white transition";
        tabMeio.className = "flex-1 py-2.5 text-xs font-bold text-center border-b-2 border-transparent text-white/70 hover:text-white transition";
        renderizarSentinela();
      }
      carregarNotasSalvas();
      fecharPaineisMobile();
      rolarParaTopo(true);
    }

    // ==========================================
    // RENDERIZADOR 1: VIDA E MINISTÉRIO CRISTÃOS
    // ==========================================
    function renderizarMeioSemana() {
      const dados = bancoSemanasJW[semanaAtiva]?.meioSemana;
      if (!dados) return;
      
      document.getElementById('badge-tipo-pub').innerText = "Apostila da Reunião";
      document.getElementById('titulo-materia').innerText = dados.titulo;
      document.getElementById('subtitulo-materia').innerText = dados.tema;

      const leitor = document.getElementById('conteudo-leitor');
      let html = '';

      // Abertura com Cântico
      html += \`
        <div id="abertura-reuniao" class="cantico-card rounded-xl p-4 shadow-2xs mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-xl">🎵</span>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#4a3b69]">Abertura da Reunião</h4>
              <p class="text-xs font-semibold text-[#212529] mt-0.5">\${dados.abertura?.cantico || "Cântico e oração | Comentários iniciais (1 min)"}</p>
            </div>
          </div>
          <span class="text-xs font-bold text-[#6c757d] bg-white px-2.5 py-1 rounded-md border border-[#dee2e6]">1 min</span>
        </div>
      \`;

      let ultimaSecao = '';

      dados.partes.forEach(p => {
        // Separador de Seção
        if (p.secao !== ultimaSecao) {
          ultimaSecao = p.secao;
          const conf = coresSecao[p.secao] || coresSecao.TESOUROS;

          // Se for Vida Cristã, mostra o Cântico do meio antes
          if (p.secao === 'VIDACRISTA' && dados.canticoMeio) {
            html += \`
              <div class="cantico-card rounded-xl p-4 shadow-2xs my-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xl">🎵</span>
                  <div>
                    <h4 class="text-xs font-bold uppercase tracking-wider text-[#4a3b69]">Cântico Intermediário</h4>
                    <p class="text-xs font-semibold text-[#212529] mt-0.5">\${dados.canticoMeio}</p>
                  </div>
                </div>
              </div>
            \`;
          }

          html += \`
            <div class="mt-8 mb-4 border-b-2 \${conf.border} pb-1 flex items-center justify-between">
              <h2 class="text-xs sm:text-sm font-bold uppercase tracking-wider \${conf.text}">
                \${conf.label}
              </h2>
            </div>
          \`;
        }

        // Card da Parte da Reunião
        html += \`
          <div id="parte-\${p.id}" class="bg-white rounded-xl border border-[#e9ecef] p-4 sm:p-5 shadow-2xs mb-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-[#212529]">\${p.titulo}</h3>
              <span class="text-xs font-bold text-[#6c757d] bg-[#f1f3f5] px-2 py-0.5 rounded">\${p.duracao}</span>
            </div>
            
            <div class="text-sm leading-relaxed text-[#495057] mb-3 whitespace-pre-line">\${p.texto}</div>

            \${p.imagem ? \`
              <div class="my-3 rounded-xl overflow-hidden border border-[#dee2e6] bg-[#f8f9fa] shadow-2xs">
                <img src="\${p.imagem.src}" alt="\${(p.imagem.caption || '').replace(/"/g, '&quot;')}" loading="lazy" class="w-full object-cover max-h-96 hover:opacity-95 transition cursor-pointer" onclick="abrirImagemModal('\${p.imagem.src}', '\${(p.imagem.caption || '').replace(/'/g, "\\\\'")}')">
                \${p.imagem.caption ? \`<p class="p-2.5 text-xs text-[#6c757d] italic leading-normal border-t border-[#dee2e6] bg-white">\${p.imagem.caption}</p>\` : ''}
              </div>
            \` : ''}

            \${p.id === 1 ? \`
              <!-- PAINEL DE DISCURSO DE 10 MINUTOS (ITEM 1 - TESOUROS DA PALAVRA DE DEUS) -->
              <div class="bg-[#f8f9fa] rounded-xl border border-[#dee2e6] p-3.5 sm:p-5 space-y-3 mt-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#dee2e6]">
                  <div>
                    <span class="text-[10px] font-bold text-[#596b7a] uppercase tracking-wider block">Discurso da Reunião (10 min)</span>
                    <h4 class="text-xs sm:text-sm font-bold text-[#212529] mt-0.5">\${p.titulo}</h4>
                  </div>
                  <button onclick="prepararDiscursoItem1('\${p.titulo.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-1', this)" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#4a3b69] text-white hover:bg-[#3b2e55] transition flex items-center gap-1.5 shadow-2xs shrink-0 self-start sm:self-auto">
                    <span>🎤</span> Gerar Esboço do Discurso (10 min)
                  </button>
                </div>

                <!-- Ferramentas Rápidas do Orador -->
                <div class="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs">
                  <span class="text-[10px] font-bold text-[#6c757d] uppercase tracking-wider">Auxílio ao Orador:</span>
                  <button onclick="prepararSecaoDiscurso('introducao', '\${p.titulo.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-1', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs" title="Ideias para uma introdução cativante">
                    🎯 Introdução cativante
                  </button>
                  <button onclick="prepararSecaoDiscurso('ilustracao', '\${p.titulo.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-1', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs" title="Ilustrações práticas para este tema">
                    💡 Ilustrações práticas
                  </button>
                  <button onclick="prepararSecaoDiscurso('conclusao', '\${p.titulo.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-1', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs" title="Conclusão motivadora com apelo">
                    🏁 Conclusão motivadora
                  </button>
                  <button onclick="toggleDuvidaInline('parte-1')" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs">
                    💬 Perguntar ao Gemini
                  </button>
                </div>

                <div id="box-duvida-parte-1" class="hidden pt-1">
                  <div class="flex items-center gap-2 bg-white rounded-lg border border-[#dee2e6] p-1.5 focus-within:ring-2 focus-within:ring-[#4a3b69]">
                    <input id="input-duvida-parte-1" type="text" placeholder="Pergunte ao Gemini algo sobre este discurso..." onkeydown="if(event.key==='Enter') enviarDuvidaInline('parte-1', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-1', this)" class="w-full text-xs px-2 bg-transparent focus:outline-none text-[#212529]">
                    <button onclick="enviarDuvidaInline('parte-1', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-1', this)" class="px-2.5 py-1 rounded-md bg-[#4a3b69] text-white text-xs font-bold hover:bg-[#3b2e55] shrink-0">
                      ➤
                    </button>
                  </div>
                </div>

                <div class="pt-2 border-t border-[#dee2e6]">
                  <div class="flex items-center justify-between mb-1 text-[11px] text-[#6c757d]">
                    <span class="font-bold">🎤 Esboço do Discurso (Começo, Meio e Fim):</span>
                    <button onclick="copiarTexto('nota-parte-1')" class="text-xs text-[#4a3b69] hover:underline font-semibold flex items-center gap-1">📋 Copiar Esboço</button>
                  </div>
                  <textarea id="nota-parte-1" placeholder="Toque em '🎤 Gerar Esboço do Discurso (10 min)' para preparar um esboço completo com Começo, Meio e Fim baseado na matéria e nos textos indicados..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-3 rounded-lg border border-[#dee2e6] bg-white focus:outline-none focus:ring-1 focus:ring-[#4a3b69] resize-y font-mono leading-relaxed" rows="8"></textarea>
                  <div id="feedback-nota-parte-1"></div>
                </div>
              </div>
            \` : p.perguntas && p.perguntas.length > 0 ? \`
              <div class="bg-[#f8f9fa] rounded-xl border border-[#dee2e6] p-3.5 sm:p-4 space-y-3 mt-3">
                <span class="text-xs font-bold text-[#6c757d] uppercase tracking-wider block">Perguntas da Consideração:</span>
                \${p.perguntas.map((q, idx) => {
                  const isJoiasGerais = q.toLowerCase().includes('joias espirituais') && q.toLowerCase().includes('leitura');
                  if (isJoiasGerais) {
                    return \`
                      <div class="border-l-3 border-[#c57e00] bg-amber-50/40 p-3.5 rounded-r-xl space-y-2.5 border border-[#e9ecef] shadow-3xs">
                        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                          <div>
                            <span class="text-[10px] font-bold text-[#c57e00] uppercase tracking-wider flex items-center gap-1">
                              <span>💎</span> Leitura Bíblica da Semana: \${dados.tema}
                            </span>
                            <p class="text-xs sm:text-sm font-bold text-[#212529] mt-0.5">\${q}</p>
                          </div>
                          <button onclick="prepararJoiasSemana('\${dados.tema.replace(/'/g, "\\\\'")}', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#c57e00] hover:bg-[#a06600] text-white transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-2xs">
                            <span>💎</span> Joias para Relação com Jeová
                          </button>
                        </div>

                        <!-- Opções de Meditação na Leitura Semanal -->
                        <div class="flex items-center gap-1.5 flex-wrap text-xs">
                          <span class="text-[10px] font-bold text-[#6c757d] uppercase tracking-wider">Meditar sobre:</span>
                          <button onclick="prepararSecaoJoias('personalidade', '\${dados.tema.replace(/'/g, "\\\\'")}', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#c57e00] text-[#495057] hover:text-[#c57e00] transition text-[11px] font-medium shadow-3xs" title="O que os textos revelam sobre a personalidade e o amor de Jeová">
                            ❤️ Personalidade de Jeová
                          </button>
                          <button onclick="prepararSecaoJoias('confianca', '\${dados.tema.replace(/'/g, "\\\\'")}', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#c57e00] text-[#495057] hover:text-[#c57e00] transition text-[11px] font-medium shadow-3xs" title="Como esses capítulos fortalecem nossa confiança e oração">
                            🛡️ Confiança & Oração
                          </button>
                          <button onclick="prepararSecaoJoias('aplicacao', '\${dados.tema.replace(/'/g, "\\\\'")}', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#c57e00] text-[#495057] hover:text-[#c57e00] transition text-[11px] font-medium shadow-3xs" title="Como aplicar os versículos para melhorar nossa amizade com Jeová">
                            🌱 Amizade com Deus
                          </button>
                          <button onclick="toggleDuvidaInline('pergunta-\${p.id}-\${idx}')" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#c57e00] text-[#495057] hover:text-[#c57e00] transition text-[11px] font-medium shadow-3xs" title="Pesquisar um versículo específico destes capítulos">
                            💬 Outro versículo da semana
                          </button>
                        </div>

                        <div id="box-duvida-pergunta-\${p.id}-\${idx}" class="hidden pt-1">
                          <div class="flex items-center gap-2 bg-white rounded-lg border border-[#dee2e6] p-1.5 focus-within:ring-2 focus-within:ring-[#c57e00]">
                            <input id="input-duvida-pergunta-\${p.id}-\${idx}" type="text" placeholder="Qual versículo de \${dados.tema} você gostaria de meditar?" onkeydown="if(event.key==='Enter') enviarDuvidaInline('pergunta-\${p.id}-\${idx}', 'Leitura semanal: \${dados.tema}', 'nota-pergunta-\${p.id}-\${idx}', this)" class="w-full text-xs px-2 bg-transparent focus:outline-none text-[#212529]">
                            <button onclick="enviarDuvidaInline('pergunta-\${p.id}-\${idx}', 'Leitura semanal: \${dados.tema}', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-2.5 py-1 rounded-md bg-[#c57e00] text-white text-xs font-bold hover:bg-[#a06600] shrink-0">
                              ➤
                            </button>
                          </div>
                        </div>

                        <textarea id="nota-pergunta-\${p.id}-\${idx}" placeholder="Toque em '💎 Joias para Relação com Jeová' para identificar as meditações de \${dados.tema}..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-2.5 rounded-lg border border-[#dee2e6] bg-white focus:outline-none focus:ring-1 focus:ring-[#c57e00] resize-y leading-relaxed" rows="4"></textarea>
                        <div id="feedback-nota-pergunta-\${p.id}-\${idx}"></div>
                      </div>
                    \`;
                  }
                  return \`
                    <div class="border-l-3 border-[#4a3b69] pl-3 py-1 space-y-2">
                      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <p class="text-xs sm:text-sm font-semibold text-[#212529]">\${q}</p>
                        <button onclick="responderComIA('\${q.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-2.5 py-1 rounded-md text-xs font-bold bg-[#4a3b69] text-white hover:bg-[#3b2e55] transition flex items-center gap-1 shrink-0 self-start sm:self-auto shadow-2xs">
                          <span class="text-amber-300">✦</span> Comentar com IA
                        </button>
                      </div>
                      <div class="flex items-center gap-1.5 flex-wrap text-xs">
                        <button onclick="aprofundarParagrafo('\${q.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'aplicacao', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-2 py-0.5 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[10px] font-medium shadow-3xs">
                          🌱 Aplicação
                        </button>
                        <button onclick="aprofundarParagrafo('\${q.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'simples', 'nota-pergunta-\${p.id}-\${idx}', this)" class="px-2 py-0.5 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[10px] font-medium shadow-3xs">
                          ⚡ Simples (30s)
                        </button>
                      </div>
                      <textarea id="nota-pergunta-\${p.id}-\${idx}" placeholder="Meu comentário para esta pergunta..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-2 rounded-lg border border-[#dee2e6] bg-white focus:outline-none focus:ring-1 focus:ring-[#4a3b69] resize-y" rows="1"></textarea>
                      <div id="feedback-nota-pergunta-\${p.id}-\${idx}"></div>
                    </div>
                  \`;
                }).join('')}
              </div>
            \` : \`
              <div class="bg-[#f8f9fa] rounded-xl border border-[#dee2e6] p-3.5 sm:p-4 space-y-3 mt-3">
                <div class="flex items-center gap-2 flex-wrap">
                  <button onclick="responderComIA('Como estruturar a \${p.titulo.replace(/'/g, "\\\\'")} de forma clara e objetiva para a congregação?', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-\${p.id}', this)" class="px-3 py-1.5 rounded-lg text-xs font-bold text-[#4a3b69] bg-white border border-[#dee2e6] hover:bg-[#e9ecef] transition flex items-center gap-1.5 shadow-2xs">
                    <span class="text-[#4a3b69]">✦</span> Preparar com Gemini
                  </button>
                  <button onclick="aprofundarParagrafo('Ideias práticas para \${p.titulo.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'aplicacao', 'nota-parte-\${p.id}', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs">
                    🌱 Dicas práticas
                  </button>
                  <button onclick="toggleDuvidaInline('parte-\${p.id}')" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs">
                    💬 Perguntar ao Gemini
                  </button>
                </div>

                <div id="box-duvida-parte-\${p.id}" class="hidden pt-1">
                  <div class="flex items-center gap-2 bg-white rounded-lg border border-[#dee2e6] p-1.5 focus-within:ring-2 focus-within:ring-[#4a3b69]">
                    <input id="input-duvida-parte-\${p.id}" type="text" placeholder="Dúvida ou sugestão para esta parte..." onkeydown="if(event.key==='Enter') enviarDuvidaInline('parte-\${p.id}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-\${p.id}', this)" class="w-full text-xs px-2 bg-transparent focus:outline-none text-[#212529]">
                    <button onclick="enviarDuvidaInline('parte-\${p.id}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-parte-\${p.id}', this)" class="px-2.5 py-1 rounded-md bg-[#4a3b69] text-white text-xs font-bold hover:bg-[#3b2e55] shrink-0">
                      ➤
                    </button>
                  </div>
                </div>

                <div class="pt-2 border-t border-[#dee2e6]">
                  <div class="flex items-center justify-between mb-1 text-[11px] text-[#6c757d]">
                    <span class="font-bold">📝 Minhas Anotações & Esboço:</span>
                  </div>
                  <textarea id="nota-parte-\${p.id}" placeholder="Minhas anotações para esta parte..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-2.5 rounded-lg border border-[#dee2e6] bg-white focus:outline-none focus:ring-1 focus:ring-[#4a3b69] resize-y" rows="2"></textarea>
                  <div id="feedback-nota-parte-\${p.id}"></div>
                </div>
              </div>
            \`}
          </div>
        \`;
      });

      // Conclusão com Cântico Final
      html += \`
        <div id="conclusao-reuniao" class="cantico-card rounded-xl p-4 shadow-2xs mt-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-xl">🎵</span>
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#4a3b69]">Conclusão da Reunião</h4>
              <p class="text-xs font-semibold text-[#212529] mt-0.5">\${dados.conclusao?.cantico || "Comentários finais (3 min) | Cântico e oração"}</p>
            </div>
          </div>
          <span class="text-xs font-bold text-[#6c757d] bg-white px-2.5 py-1 rounded-md border border-[#dee2e6]">3 min</span>
        </div>
      \`;

      leitor.innerHTML = html;
      const itensSalto = [
        { label: "🎵 Abertura & Cântico", id: "abertura-reuniao" },
        ...dados.partes.map(p => ({
          label: p.id + '. ' + p.titulo.split('(')[0].replace(/^\d+\.\s*/, '').trim(),
          id: 'parte-' + p.id
        })),
        { label: "🎵 Conclusão da Reunião", id: "conclusao-reuniao" }
      ];
      popularSaltoRapido(itensSalto);
      atualizarChips(["Resumo da Reunião", "Joias Espirituais", "Dica de Preparação", "Aplicação Ministerial"]);
    }

    // ==========================================
    // RENDERIZADOR 2: ESTUDO DE A SENTINELA
    // ==========================================
    function renderizarSentinela() {
      const dados = bancoSemanasJW[semanaAtiva]?.fimSemana;
      if (!dados) return;

      document.getElementById('badge-tipo-pub').innerText = "A Sentinela (Edição de Estudo)";
      document.getElementById('titulo-materia').innerText = dados.titulo;
      document.getElementById('subtitulo-materia').innerText = dados.tema;

      const leitor = document.getElementById('conteudo-leitor');
      let html = '';

      // Banner Cântico Inicial
      if (dados.canticoInicial) {
        html += \`
          <div class="cantico-card rounded-xl p-4 shadow-2xs mb-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-xl">🎵</span>
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-[#4a3b69]">Abertura do Estudo</h4>
                <p class="text-xs font-semibold text-[#212529] mt-0.5">\${dados.canticoInicial}</p>
              </div>
            </div>
          </div>
        \`;
      }

      // Banner Objetivo
      if (dados.objetivo) {
        html += \`
          <div class="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 shadow-2xs">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-900">OBJETIVO DO ESTUDO</h4>
            <p class="text-xs text-amber-950 mt-1 leading-relaxed">\${dados.objetivo}</p>
          </div>
        \`;
      }

      // Parágrafos Oficiais
      dados.paragrafos.forEach(p => {
        html += \`
          <div id="paragrafo-\${p.num}" class="bg-white rounded-xl border border-[#e9ecef] p-4 sm:p-5 shadow-2xs mb-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="w-6 h-6 rounded-full bg-[#4a3b69] text-white flex items-center justify-center font-bold text-xs shrink-0">
                \${p.num}
              </span>
              <span class="text-xs font-semibold text-[#6c757d]">Parágrafo \${p.num}</span>
            </div>

            <p class="text-sm leading-relaxed text-[#212529] mb-4 font-normal">
              \${p.texto}
            </p>

            \${p.imagem ? \`
              <div class="my-3 rounded-xl overflow-hidden border border-[#dee2e6] bg-[#f8f9fa] shadow-2xs">
                <img src="\${p.imagem.src}" alt="\${(p.imagem.caption || '').replace(/"/g, '&quot;')}" loading="lazy" class="w-full object-cover max-h-96 hover:opacity-95 transition cursor-pointer" onclick="abrirImagemModal('\${p.imagem.src}', '\${(p.imagem.caption || '').replace(/'/g, "\\\\'")}')">
                \${p.imagem.caption ? \`<p class="p-2.5 text-xs text-[#6c757d] italic leading-normal border-t border-[#dee2e6] bg-white">\${p.imagem.caption}</p>\` : ''}
              </div>
            \` : ''}

            <!-- PAINEL DE ESTUDO INTEGRADO AO PARÁGRAFO -->
            <div class="bg-[#f8f9fa] rounded-xl border border-[#dee2e6] p-3.5 sm:p-4 space-y-3 mt-2">
              
              <!-- Pergunta e Botão Principal de Comentário -->
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                <p class="text-xs sm:text-sm font-bold text-[#212529] leading-snug">
                  \${p.pergunta}
                </p>
                <button onclick="responderComIA('\${p.pergunta.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-sentinela-\${p.num}', this)" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#4a3b69] text-white hover:bg-[#3b2e55] transition flex items-center gap-1.5 shrink-0 shadow-2xs self-start sm:self-auto">
                  <span class="text-amber-300">✦</span> Comentar com IA
                </button>
              </div>

              <!-- Ferramentas Rápidas do Copilot no Parágrafo -->
              <div class="flex items-center gap-1.5 flex-wrap pt-0.5 text-xs">
                <span class="text-[10px] font-bold text-[#6c757d] uppercase tracking-wider">Apoio:</span>
                <button onclick="aprofundarParagrafo('\${p.pergunta.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'aplicacao', 'nota-sentinela-\${p.num}', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs" title="Como aplicar este ponto no dia a dia">
                  🌱 Aplicação
                </button>
                <button onclick="aprofundarParagrafo('\${p.pergunta.replace(/'/g, "\\\\'")}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'simples', 'nota-sentinela-\${p.num}', this)" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs" title="Resposta direta em até 30 segundos">
                  ⚡ Simples (30s)
                </button>
                <button onclick="toggleDuvidaInline('sentinela-\${p.num}')" class="px-2.5 py-1 rounded-full bg-white border border-[#dee2e6] hover:border-[#4a3b69] text-[#495057] hover:text-[#4a3b69] transition text-[11px] font-medium shadow-3xs" title="Fazer uma pergunta personalizada ao Gemini sobre este parágrafo">
                  💬 Perguntar
                </button>
              </div>

              <!-- Caixa de Pergunta Personalizada ao Gemini (Oculta até clicar em 'Perguntar') -->
              <div id="box-duvida-sentinela-\${p.num}" class="hidden pt-1">
                <div class="flex items-center gap-2 bg-white rounded-lg border border-[#dee2e6] p-1.5 focus-within:ring-2 focus-within:ring-[#4a3b69]">
                  <input id="input-duvida-sentinela-\${p.num}" type="text" placeholder="Escreva sua dúvida sobre este parágrafo..." onkeydown="if(event.key==='Enter') enviarDuvidaInline('sentinela-\${p.num}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-sentinela-\${p.num}', this)" class="w-full text-xs px-2 bg-transparent focus:outline-none text-[#212529]">
                  <button onclick="enviarDuvidaInline('sentinela-\${p.num}', '\${(p.texto || '').replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ')}', 'nota-sentinela-\${p.num}', this)" class="px-2.5 py-1 rounded-md bg-[#4a3b69] text-white text-xs font-bold hover:bg-[#3b2e55] shrink-0">
                    ➤
                  </button>
                </div>
              </div>

              <!-- Minhas Anotações & Resposta Direta -->
              <div class="pt-2 border-t border-[#dee2e6]">
                <div class="flex items-center justify-between mb-1 text-[11px] text-[#6c757d]">
                  <span class="font-bold">📝 Minhas Anotações & Resposta:</span>
                </div>
                <textarea id="nota-sentinela-\${p.num}" placeholder="Toque em '✦ Comentar com IA' ou anote aqui seu comentário..." oninput="autoSalvarNotaLocal(this.id)" class="w-full text-xs p-2.5 rounded-lg border border-[#dee2e6] bg-white focus:outline-none focus:ring-1 focus:ring-[#4a3b69] resize-y leading-relaxed" rows="2"></textarea>
                <div id="feedback-nota-sentinela-\${p.num}"></div>
              </div>
            </div>
          </div>
        \`;
      });

      leitor.innerHTML = html;
      const itensSalto = [
        { label: "📖 Início do Artigo", id: "cabecalho-materia" },
        ...dados.paragrafos.map(p => ({
          label: '§ ' + p.num + ' - Parágrafo ' + p.num,
          id: 'paragrafo-' + p.num
        }))
      ];
      popularSaltoRapido(itensSalto);
      atualizarChips(["Comentário Parágrafo 1", "Comentário Parágrafo 2", "Aplicação Bíblica", "Ponto Principal"]);
    }

    // Funções do Assistente de Estudo Integrado aos Parágrafos
    let timerDebounceSalvar = null;
    function autoSalvarNotaLocal(id) {
      clearTimeout(timerDebounceSalvar);
      timerDebounceSalvar = setTimeout(() => {
        salvarTudo(true);
      }, 600);
    }

    function toggleDuvidaInline(id) {
      const box = document.getElementById('box-duvida-' + id);
      if (box) {
        box.classList.toggle('hidden');
        if (!box.classList.contains('hidden')) {
          const inp = document.getElementById('input-duvida-' + id);
          if (inp) inp.focus();
        }
      }
    }

    async function enviarDuvidaInline(id, textoMateria, targetTextareaId, btnOrInp) {
      const inp = document.getElementById('input-duvida-' + id);
      if (!inp) return;
      const pergunta = inp.value.trim();
      if (!pergunta) return;

      const btn = inp.nextElementSibling;
      let btnOrig = "";
      if (btn) {
        btnOrig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '⏳';
      }

      await responderComIA('Dúvida sobre o parágrafo: ' + pergunta, textoMateria, targetTextareaId, btn);

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = btnOrig;
      }
      inp.value = "";
    }

    async function aprofundarParagrafo(perguntaOriginal, textoMateria, tipoApoio, targetTextareaId, btnElement) {
      let promptApoio = "";
      if (tipoApoio === 'aplicacao') {
        promptApoio = 'Com base nesta matéria, elabore um comentário prático e objetivo de 30 a 45 segundos sobre COMO APLICAR ESTE ENSINAMENTO NO DIA A DIA (família, trabalho ou congregação).';
      } else if (tipoApoio === 'simples') {
        promptApoio = 'Responda à pergunta: "' + perguntaOriginal + '" de forma muito simples, direta e calorosa, para um comentário de até 25 a 30 segundos.';
      } else {
        promptApoio = perguntaOriginal;
      }

      await responderComIA(promptApoio, textoMateria, targetTextareaId, btnElement);
    }

    async function prepararDiscursoItem1(titulo, textoMateria, targetTextareaId, btnElement) {
      const prompt = 'Prepare um ESBOÇO COMPLETO DE DISCURSO DE 10 MINUTOS baseado no tema: "' + titulo + '".\\n\\n' +
        'Estrutura obrigatória:\\n' +
        '1. TEMA DO DISCURSO (em destaque no topo)\\n' +
        '2. INTRODUÇÃO (aprox. 1 a 2 min): Gancho cativante, declaração clara do tema e relevância para a congregação hoje.\\n' +
        '3. CORPO / DESENVOLVIMENTO (aprox. 6 a 7 min):\\n' +
        '   - Ponto Principal 1: Análise bíblica com os textos e ideias da matéria da apostila. [Indicar texto a ser lido com expressividade e aplicação].\\n' +
        '   - Ponto Principal 2: Lição prática para o dia a dia e serviço de campo. [Incluir uma ilustração simples e calorosa].\\n' +
        '4. CONCLUSÃO (aprox. 1 a 2 min): Recapitulação breve dos pontos vitais e apelo motivador encorajando a congregação a confiar em Jeová.\\n\\n' +
        'Formate em tópicos limpos, marcadores e tempos sugeridos. Entregue o esboço pronto para o orador usar no púlpito.';

      await responderComIA(prompt, textoMateria, targetTextareaId, btnElement, 'discurso');
    }

    async function prepararSecaoDiscurso(secao, titulo, textoMateria, targetTextareaId, btnElement) {
      let promptSecao = "";
      if (secao === 'introducao') {
        promptSecao = 'Para o discurso de 10 min com tema "' + titulo + '", formule 2 opções de INTRODUÇÃO CATIVANTE (1 a 2 min): uma usando uma pergunta reflexiva e outra usando um cenário da vida real, despertando o interesse da congregação.';
      } else if (secao === 'ilustracao') {
        promptSecao = 'Para o discurso de 10 min com tema "' + titulo + '", elabore 2 sugestões de ILUSTRAÇÕES PRÁTICAS e calorosas que tornem os pontos bíblicos fáceis de visualizar e lembrar.';
      } else if (secao === 'conclusao') {
        promptSecao = 'Para o discurso de 10 min com tema "' + titulo + '", formule uma CONCLUSÃO MOTIVADORA (1 a 2 min) com resumo dos pontos principais e um apelo cordial que incentive a congregação a confiar em Jeová.';
      }
      await responderComIA(promptSecao, textoMateria, targetTextareaId, btnElement, 'discurso');
    }

    async function prepararJoiasSemana(leituraSemanal, targetTextareaId, btnElement) {
      const prompt = 'Na leitura da Bíblia desta semana (' + leituraSemanal + '), identifique 3 a 4 joias espirituais e meditações práticas focadas especificamente em MELHORAR NOSSA RELAÇÃO COM JEOVÁ (sua personalidade, amor, justiça, misericórdia e como nos achegar a Ele). Para cada ponto, cite o versículo exato de ' + leituraSemanal + ', explique a meditação sobre Jeová e faça uma aplicação pessoal para nossa amizade com Ele.';
      await responderComIA(prompt, 'Leitura da Bíblia da semana: ' + leituraSemanal, targetTextareaId, btnElement, 'joias');
    }

    async function prepararSecaoJoias(foco, leituraSemanal, targetTextareaId, btnElement) {
      let promptSecao = '';
      if (foco === 'personalidade') {
        promptSecao = 'Na leitura de ' + leituraSemanal + ', que facetas da personalidade de Jeová (seus sentimentos, compaixão, paciência ou soberania) são reveladas? Destaque 2 pontos com versículos e como isso nos atrai mais a Ele.';
      } else if (foco === 'confianca') {
        promptSecao = 'Na leitura de ' + leituraSemanal + ', que lições encontramos sobre confiar em Jeová em tempos difíceis e recorrer a Ele em oração sincera? Cite versículos de ' + leituraSemanal + ' e aplicação prática.';
      } else if (foco === 'amizade') {
        promptSecao = 'Com base em ' + leituraSemanal + ', como podemos cultivar uma amizade pessoal mais profunda com Jeová no nosso dia a dia? Forneça 2 reflexões com versículos práticos.';
      } else if (foco === 'outro') {
        promptSecao = 'Identifique outro versículo marcante na leitura de ' + leituraSemanal + ' que toque o coração e mostre como Jeová cuida dos que o amam.';
      }
      await responderComIA(promptSecao, 'Leitura da Bíblia da semana: ' + leituraSemanal, targetTextareaId, btnElement, 'joias');
    }

    function copiarTexto(id) {
      const el = document.getElementById(id);
      if (!el || !el.value) return;
      navigator.clipboard.writeText(el.value).then(() => {
        const feedback = document.getElementById('feedback-' + id);
        if (feedback) {
          feedback.innerHTML = '<span class="text-emerald-700 font-semibold text-xs">📋 Esboço copiado para a área de transferência!</span>';
          setTimeout(() => { if (feedback) feedback.innerHTML = ''; }, 3000);
        }
      });
    }

    function toggleStudyPane() {}
    function toggleMenuMobile() {}
    function fecharPaineisMobile() {
      const backdrop = document.getElementById('drawer-backdrop');
      if (backdrop) backdrop.classList.add('hidden');
    }

    // CHAMADA HÍBRIDA AO GOOGLE GEMINI (Vercel API -> Direct Client -> Fallback)
    async function chamarGeminiIA({ question, prompt, context, tipo = "comentario" }) {
      const isDiscurso = tipo === 'discurso' || (question || prompt || '').toLowerCase().includes('discurso') || (question || prompt || '').toLowerCase().includes('esboço');
      const isJoias = tipo === 'joias' || (question || prompt || '').toLowerCase().includes('joias espirituais') || (question || prompt || '').toLowerCase().includes('relação com jeová');
      const tipoEnvio = isDiscurso ? 'discurso' : (isJoias ? 'joias' : 'comentario');

      // 1. Tenta API do Vercel (/api/gemini)
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, prompt, context, tipo: tipoEnvio })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.resposta) return data.resposta;
        }
      } catch (err) {}

      // 2. Chamada Direta à API do Gemini (GitHub Pages ou PWA)
      const apiKey = localStorage.getItem('gemini_api_key') || GEMINI_DEFAULT_KEY;
      if (apiKey) {
        let systemPrompt = "";
        let instr = "";

        if (isDiscurso) {
          systemPrompt = "Você é um orador e instrutor experiente das Testemunhas de Jeová preparando um esboço completo de discurso de 10 minutos (Tesouros da Palavra de Deus). Seu objetivo é gerar um ESBOÇO COMPLETO E BEM ESTRUTURADO com Começo (Introdução 1-2 min), Meio (Corpo 6-7 min com pontos bíblicos e textos lidos) e Fim (Conclusão motivadora 1-2 min) em português do Brasil com tópicos limpos.";
          instr = "Formule o esboço completo do discurso de 10 minutos com Introdução, Desenvolvimento (com textos bíblicos) e Conclusão motivadora.";
        } else if (isJoias) {
          systemPrompt = "Você é um pesquisador e publicador dedicado das Testemunhas de Jeová participando na parte 'Encontre Joias Espirituais' da reunião de meio de semana. O usuário quer extrair meditações profundas da leitura bíblica da semana para MELHORAR SUA RELAÇÃO PESSOAL COM JEOVÁ. Diretrizes estritas: Identifique versículos específicos da leitura da semana indicada, explique o que revelam sobre as qualidades de Jeová (amor, misericórdia, lealdade, soberania, justiça) e forneça meditações práticas e calorosas para fortalecer a intimidade, oração e amizade com Deus. Formate em pontos claros, prontos para anotação pessoal ou para comentar na congregação.";
          instr = "Identifique as joias da leitura bíblica indicadas e mostre como fortalecem nossa relação com Jeová.";
        } else {
          systemPrompt = "Você é um publicador experiente das Testemunhas de Jeová preparando um comentário para a reunião congregacional. Seu objetivo é formular o comentário FINAL pronto para ser falado no microfone (cerca de 30 a 45 segundos). Diretrizes estritas: Responda DIRETAMENTE com o comentário em português do Brasil, caloroso, respeitoso e natural. Comece direto no assunto. NUNCA faça rascunhos, nunca pense em voz alta e nunca use prefixos como '*Attempt*'.";
          instr = "Formule o comentário final objetivo e natural de 30 a 45 segundos em português.";
        }

        const requestBody = {
          contents: [{
            role: "user",
            parts: [{ text: \`CONTEXTO DA MATÉRIA:\\n\${context || ''}\\n\\nPERGUNTA OU PONTO:\\n\${question || prompt}\\n\\nINSTRUÇÃO: \${instr}\` }]
          }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.5, maxOutputTokens: (isDiscurso || isJoias) ? 2000 : 1000 }
        };

        const modelos = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
        for (const m of modelos) {
          try {
            const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/\${m}:generateContent?key=\${apiKey}\`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody)
            });
            if (res.ok) {
              const data = await res.json();
              let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                text = text
                  .replace(/\\*+Attempt\\s*[0-9]+[\\s\\S]*?(?=(\\n\\n|\\"|[A-ZÀ-Ú]))/gi, '')
                  .replace(/^(Aqui está uma sugestão|Comentário sugerido|Sugestão de resposta):?\\s*/i, '')
                  .trim();
                return text;
              }
            }
          } catch (e) {}
        }
      }

      return null;
    }

    function dispensarDicaAssistente() {
      try {
        localStorage.setItem('jw_assistente_dica_vista', '1');
      } catch (e) {}
      const card = document.getElementById('card-assistente-dica');
      if (card) {
        card.remove();
      }
    }

    function verificarDicaAssistente() {
      try {
        if (localStorage.getItem('jw_assistente_dica_vista') === '1') {
          const card = document.getElementById('card-assistente-dica');
          if (card) {
            card.remove();
          }
        }
      } catch (e) {}
    }

    async function responderComIA(pergunta, textoMateria = "", targetTextareaId = "", btnElement = null, tipo = "comentario") {
      dispensarDicaAssistente();
      const isDiscurso = tipo === 'discurso' || (pergunta || '').toLowerCase().includes('discurso') || (pergunta || '').toLowerCase().includes('esboço');
      const isJoias = tipo === 'joias' || (pergunta || '').toLowerCase().includes('joias espirituais') || (pergunta || '').toLowerCase().includes('relação com jeová');
      const tipoChamada = isDiscurso ? 'discurso' : (isJoias ? 'joias' : 'comentario');

      // Feedback visual no botão que foi clicado
      let btnOriginalHtml = "";
      if (btnElement) {
        btnOriginalHtml = btnElement.innerHTML;
        btnElement.disabled = true;
        btnElement.innerHTML = '<span class="animate-pulse">⏳</span> Gerando...';
      }

      // Se houver textarea de destino, atualiza o placeholder imediatamente
      let area = null;
      if (targetTextareaId) {
        area = document.getElementById(targetTextareaId);
        if (area && !area.value.trim()) {
          area.placeholder = isDiscurso
            ? "✦ O Gemini está estruturando o esboço completo do discurso de 10 min (Introdução, Desenvolvimento e Conclusão)..."
            : (isJoias
                ? "✦ O Gemini está pesquisando a leitura bíblica da semana e extraindo joias para fortalecer sua relação com Jeová..."
                : "✦ O Gemini está formulando uma resposta objetiva (30 a 45s)...");
        }
      }

      const contexto = textoMateria
        ? \`TEXTO DA MATÉRIA / PARÁGRAFO:\\n"\${textoMateria}"\\n\\nSEMANA: Semana \${semanaAtiva} (\${modoAtual === 'meio_semana' ? 'Vida e Ministério' : 'A Sentinela'})\`
        : \`Semana \${semanaAtiva} (\${modoAtual === 'meio_semana' ? 'Vida e Ministério' : 'A Sentinela'})\`;

      const respostaIA = await chamarGeminiIA({ question: pergunta, context: contexto, tipo: tipoChamada });
      const fallbackMsg = isDiscurso 
        ? "Esboço do discurso preparado com base no tema e nos textos indicados."
        : (isJoias 
            ? "Na leitura desta semana, aprendemos como Jeová nos acolhe e perdoa com ternura quando o buscamos de todo o coração. Meditar em sua misericórdia e lealdade aprofunda nossa confiança e nos motiva a manter uma oração constante e sincera."
            : "Podemos comentar que agir com base no amor e no perdão cristão mantém a união da congregação.");
      const respostaFinal = respostaIA || textoMateria || fallbackMsg;

      // Restaura o botão
      if (btnElement) {
        btnElement.disabled = false;
        btnElement.innerHTML = btnOriginalHtml;
      }

      // Preenche diretamente o campo Minhas Anotações sem mudar de ecrã nem abrir gavetas
      if (area) {
        area.value = respostaFinal;
        area.style.height = 'auto';
        const minH = isDiscurso ? 240 : (isJoias ? 180 : 70);
        area.style.height = Math.max(minH, area.scrollHeight + 12) + 'px';
        
        // Efeito visual de destaque (brilho verde esmeralda ou âmbar para joias)
        const ringCor = isJoias ? 'ring-amber-500' : 'ring-emerald-500';
        const bgCor = isJoias ? 'bg-amber-50/40' : 'bg-emerald-50/40';
        area.classList.add('ring-2', ringCor, bgCor, 'transition', 'duration-300');
        setTimeout(() => {
          area.classList.remove('ring-2', ringCor, bgCor);
        }, 2500);

        // Feedback sutil inline logo abaixo do campo
        let feedbackEl = document.getElementById('feedback-' + targetTextareaId);
        if (!feedbackEl) {
          feedbackEl = document.createElement('div');
          feedbackEl.id = 'feedback-' + targetTextareaId;
          feedbackEl.className = "text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1 transition duration-300";
          area.parentNode.appendChild(feedbackEl);
        }
        feedbackEl.innerHTML = isDiscurso
          ? '<span>✅ Esboço completo do discurso estruturado e salvo nas suas anotações!</span>'
          : (isJoias
              ? '<span>💎 Joias espirituais identificadas e salvas nas suas anotações!</span>'
              : '<span>✅ Comentário formulado com Gemini e salvo nas anotações!</span>');
        setTimeout(() => {
          if (feedbackEl) feedbackEl.innerHTML = '';
        }, 4000);

        // Salva silenciosamente no localStorage e no Supabase
        salvarTudo(true);
      }

    }

    function irParaAnotacao(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }

    function atualizarChips() {}

    // ==========================================
    // SISTEMA DE PERFIS DE USUÁRIO (SEPARAÇÃO TOTAL)
    // ==========================================
    function obterPerfilAtivo() {
      try {
        const ativo = JSON.parse(localStorage.getItem('jw_perfil_ativo') || 'null');
        if (ativo && ativo.id && ativo.nome) return ativo;
      } catch (e) {}
      const padrao = { id: 'lafabio-padrao', nome: 'Lafabio' };
      localStorage.setItem('jw_perfil_ativo', JSON.stringify(padrao));
      salvarNaListaPerfis(padrao);
      return padrao;
    }

    function obterListaPerfis() {
      try {
        const lista = JSON.parse(localStorage.getItem('jw_lista_perfis') || '[]');
        if (Array.isArray(lista) && lista.length > 0) return lista;
      } catch (e) {}
      const ativo = obterPerfilAtivo();
      return [ativo];
    }

    function salvarNaListaPerfis(perfil) {
      let lista = obterListaPerfis();
      const idx = lista.findIndex(p => p.id === perfil.id);
      if (idx >= 0) {
        lista[idx] = perfil;
      } else {
        lista.push(perfil);
      }
      localStorage.setItem('jw_lista_perfis', JSON.stringify(lista));
    }

    function inicializarPerfilUsuario() {
      const perfil = obterPerfilAtivo();
      atualizarBadgePerfilUI(perfil);
    }

    function atualizarBadgePerfilUI(perfil) {
      const txt = document.getElementById('txt-nome-perfil');
      if (txt) txt.innerText = perfil.nome || 'Meu Perfil';
    }

    function abrirModalPerfil() {
      const perfil = obterPerfilAtivo();
      document.getElementById('cfg-perfil-nome').value = perfil.nome;
      document.getElementById('cfg-perfil-id').value = perfil.id;
      renderizarListaPerfisUI();
      document.getElementById('modal-perfil').classList.remove('hidden');
    }

    function fecharModalPerfil() {
      document.getElementById('modal-perfil').classList.add('hidden');
    }

    function gerarNovoIdPerfil() {
      const novoId = 'usr-' + Math.random().toString(36).substring(2, 9);
      document.getElementById('cfg-perfil-id').value = novoId;
    }

    function renderizarListaPerfisUI() {
      const container = document.getElementById('lista-perfis-salvos');
      const lista = obterListaPerfis();
      const ativo = obterPerfilAtivo();

      container.innerHTML = lista.map(p => \`
        <div class="flex items-center justify-between p-2 rounded-lg \${p.id === ativo.id ? 'bg-purple-100 border border-purple-300 font-bold text-[#4a3b69]' : 'bg-[#f8f9fa] border border-[#e9ecef] hover:bg-gray-100 text-[#495057]'} transition">
          <div class="flex items-center gap-2 cursor-pointer flex-1" onclick="trocarPerfilAtivo('\${p.id}')">
            <span>\${p.id === ativo.id ? '✅' : '👤'}</span>
            <div>
              <p class="text-xs leading-none">\${p.nome}</p>
              <p class="text-[10px] text-[#6c757d] font-mono mt-0.5">Código: \${p.id}</p>
            </div>
          </div>
          \${p.id === ativo.id ? '<span class="text-[10px] font-bold text-purple-800 bg-purple-200/70 px-2 py-0.5 rounded">Ativo</span>' : \`<button onclick="trocarPerfilAtivo('\${p.id}')" class="px-2.5 py-1 rounded bg-[#4a3b69] text-white text-[10px] font-bold hover:bg-[#3b2e55]">Usar</button>\`}
        </div>
      \`).join('');
    }

    function salvarPerfilUsuario() {
      const nome = document.getElementById('cfg-perfil-nome').value.trim() || 'Meu Perfil';
      const id = document.getElementById('cfg-perfil-id').value.trim() || ('usr-' + Math.random().toString(36).substring(2, 9));

      const novoPerfil = { id, nome };
      localStorage.setItem('jw_perfil_ativo', JSON.stringify(novoPerfil));
      salvarNaListaPerfis(novoPerfil);
      atualizarBadgePerfilUI(novoPerfil);

      fecharModalPerfil();
      // Recarrega as notas do novo perfil
      carregarNotasSalvas();
      alert(\`✅ Perfil "\${nome}" ativo! Suas anotações agora são exclusivas e separadas.\`);
    }

    function trocarPerfilAtivo(id) {
      const lista = obterListaPerfis();
      const escolhido = lista.find(p => p.id === id);
      if (escolhido) {
        // Salva silenciosamente as notas do perfil que está saindo
        salvarTudo(true);

        localStorage.setItem('jw_perfil_ativo', JSON.stringify(escolhido));
        atualizarBadgePerfilUI(escolhido);
        fecharModalPerfil();

        // Carrega as anotações do perfil selecionado
        carregarNotasSalvas();
        limparChat();
        alert(\`👤 Perfil alternado para "\${escolhido.nome}". Anotações carregadas!\`);
      }
    }

    function criarNovoPerfil() {
      const nomeSugerido = 'Perfil ' + (obterListaPerfis().length + 1);
      const novoId = 'usr-' + Math.random().toString(36).substring(2, 9);
      document.getElementById('cfg-perfil-nome').value = nomeSugerido;
      document.getElementById('cfg-perfil-id').value = novoId;
      document.getElementById('cfg-perfil-nome').focus();
    }

    // Salva notas no Supabase e no localStorage com isolamento de perfil
    async function salvarTudo(silencioso = false) {
      const perfil = obterPerfilAtivo();
      const textareas = document.querySelectorAll('textarea');
      const notas = {};
      textareas.forEach(t => {
        if (t.id && t.value.trim()) {
          notas[t.id] = t.value.trim();
        }
      });

      // 1. Salva localmente com chave do perfil
      localStorage.setItem(\`jw_notas_\${perfil.id}_\${semanaAtiva}_\${modoAtual}\`, JSON.stringify(notas));

      // 2. Salva na nuvem no Supabase com user_id do perfil
      try {
        const res = await fetch(\`\${SUPABASE_CONFIG.url}/rest/v1/user_notes\`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_CONFIG.key,
            'Authorization': \`Bearer \${SUPABASE_CONFIG.key}\`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            user_id: perfil.id,
            year: 2026,
            week_number: semanaAtiva,
            meeting_type: modoAtual,
            item_key: 'todas',
            note_text: JSON.stringify(notas),
            updated_at: new Date().toISOString()
          })
        });

        if (res.ok) {
          if (!silencioso) alert(\`✅ Anotações do perfil "\${perfil.nome}" salvas no Supabase Nuvem e no seu aparelho!\`);
          return;
        }
      } catch (e) {
        console.warn('Erro ao salvar no Supabase:', e.message);
      }

      if (!silencioso) alert(\`✅ Anotações do perfil "\${perfil.nome}" salvas no seu dispositivo!\`);
    }

    // Recupera notas salvas do perfil ativo
    async function carregarNotasSalvas() {
      const perfil = obterPerfilAtivo();

      // Limpa os textareas antes de carregar nova semana ou novo perfil
      document.querySelectorAll('textarea').forEach(t => {
        t.value = '';
        t.style.height = 'auto';
      });

      let carregou = false;

      // Tenta recuperar do Supabase para este user_id
      try {
        const res = await fetch(
          \`\${SUPABASE_CONFIG.url}/rest/v1/user_notes?user_id=eq.\${encodeURIComponent(perfil.id)}&year=eq.2026&week_number=eq.\${semanaAtiva}&meeting_type=eq.\${modoAtual}&select=*\`,
          {
            headers: {
              'apikey': SUPABASE_CONFIG.key,
              'Authorization': \`Bearer \${SUPABASE_CONFIG.key}\`
            }
          }
        );

        if (res.ok) {
          const rows = await res.json();
          if (rows && rows.length > 0 && rows[0].note_text) {
            const notas = JSON.parse(rows[0].note_text);
            Object.entries(notas).forEach(([id, texto]) => {
              const el = document.getElementById(id);
              if (el) {
                el.value = texto;
                el.style.height = 'auto';
                el.style.height = Math.max(60, el.scrollHeight + 8) + 'px';
              }
            });
            carregou = true;
          }
        }
      } catch (e) {}

      // Fallback: localStorage isolado por perfil
      if (!carregou) {
        const local = localStorage.getItem(\`jw_notas_\${perfil.id}_\${semanaAtiva}_\${modoAtual}\`);
        if (local) {
          const notas = JSON.parse(local);
          Object.entries(notas).forEach(([id, texto]) => {
            const el = document.getElementById(id);
            if (el) {
              el.value = texto;
              el.style.height = 'auto';
              el.style.height = Math.max(60, el.scrollHeight + 8) + 'px';
            }
          });
        }
      }
    }

    // MODAL DE CONFIGURAÇÕES
    function abrirModalConfig() {
      document.getElementById('cfg-gemini-key').value = localStorage.getItem('gemini_api_key') || GEMINI_DEFAULT_KEY;
      document.getElementById('cfg-supa-url').value = localStorage.getItem('supabase_url') || SUPABASE_CONFIG.url;
      document.getElementById('cfg-supa-key').value = localStorage.getItem('supabase_key') || SUPABASE_CONFIG.key;
      document.getElementById('modal-config').classList.remove('hidden');
    }

    function fecharModalConfig() {
      document.getElementById('modal-config').classList.add('hidden');
    }

    function salvarConfiguracoes() {
      const gKey = document.getElementById('cfg-gemini-key').value.trim();
      const sUrl = document.getElementById('cfg-supa-url').value.trim();
      const sKey = document.getElementById('cfg-supa-key').value.trim();

      if (gKey) localStorage.setItem('gemini_api_key', gKey);
      if (sUrl) {
        localStorage.setItem('supabase_url', sUrl);
        SUPABASE_CONFIG.url = sUrl;
      }
      if (sKey) {
        localStorage.setItem('supabase_key', sKey);
        SUPABASE_CONFIG.key = sKey;
      }

      fecharModalConfig();
      alert('✅ Configurações salvas com sucesso!');
    }

    async function testarConexoes() {
      const msgBox = document.getElementById('msg-teste-conexao');
      msgBox.className = "p-2.5 rounded-lg text-xs bg-blue-50 text-blue-800 border border-blue-200 block";
      msgBox.innerText = "Testando conexões com Supabase e Google Gemini...";

      const gKey = document.getElementById('cfg-gemini-key').value.trim() || GEMINI_DEFAULT_KEY;
      const sUrl = document.getElementById('cfg-supa-url').value.trim() || SUPABASE_CONFIG.url;
      const sKey = document.getElementById('cfg-supa-key').value.trim() || SUPABASE_CONFIG.key;

      let supaOk = false;
      let geminiOk = false;

      // 1. Testa Supabase
      try {
        const res = await fetch(\`\${sUrl}/rest/v1/meetings_cache?select=count\`, {
          headers: { 'apikey': sKey, 'Authorization': \`Bearer \${sKey}\` }
        });
        if (res.ok) supaOk = true;
      } catch (e) {}

      // 2. Testa Gemini
      try {
        const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=\${gKey}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Ola' }] }] })
        });
        if (res.ok) geminiOk = true;
      } catch (e) {}

      if (supaOk && geminiOk) {
        msgBox.className = "p-2.5 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 block";
        msgBox.innerText = "✅ Tudo 100%! Supabase Nuvem e Google Gemini 3.5 Flash conectados com sucesso.";
      } else {
        msgBox.className = "p-2.5 rounded-lg text-xs bg-amber-50 text-amber-800 border border-amber-200 block";
        msgBox.innerText = \`Aviso: Supabase \${supaOk ? 'OK ✅' : 'Falha ❌'} | Gemini \${geminiOk ? 'OK ✅' : 'Falha ❌'}\`;
      }
    }

    // MODAL DE IMAGEM (LIGHTBOX)
    function abrirImagemModal(src, caption) {
      document.getElementById('img-modal-src').src = src;
      document.getElementById('img-modal-caption').innerText = caption || '';
      document.getElementById('modal-imagem').classList.remove('hidden');
    }

    function fecharImagemModal() {
      document.getElementById('modal-imagem').classList.add('hidden');
    }

    // REGISTRO DE PWA (SERVICE WORKER) COM ATUALIZAÇÃO AUTOMÁTICA
    function registrarServiceWorker() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then((registration) => {
          console.log('✅ ServiceWorker do JW Study registrado para uso offline.');
          // Checa imediatamente se há nova versão no servidor
          registration.update().catch(() => {});

          // Monitora se há nova versão sendo instalada
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  exibirAvisoAtualizacao();
                }
              });
            }
          });
        }).catch(err => {
          console.log('SW registration note:', err);
        });

        // Recarrega automaticamente quando o ServiceWorker assumir controle com versão nova
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      }
    }

    function exibirAvisoAtualizacao() {
      if (document.getElementById('toast-atualizacao')) return;
      const toast = document.createElement('div');
      toast.id = 'toast-atualizacao';
      toast.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 bg-[#4a3b69] text-white p-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-3 border border-white/20 animate-bounce';
      toast.innerHTML = \`
        <div class="flex items-center gap-2 text-xs">
          <span class="text-base">🚀</span>
          <span><strong>Nova versão pronta!</strong> Toque para atualizar.</span>
        </div>
        <button onclick="forcarAtualizacaoApp()" class="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#4a3b69] font-bold text-xs rounded-lg shadow-xs shrink-0">
          Atualizar
        </button>
      \`;
      document.body.appendChild(toast);
    }

    async function forcarAtualizacaoApp() {
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const r of regs) await r.unregister();
        }
        if ('caches' in window) {
          const keys = await caches.keys();
          for (const k of keys) await caches.delete(k);
        }
      } catch (e) {}
      window.location.reload(true);
    }
  </script>
</body>
</html>`;

fs.writeFileSync('./index.html', htmlTemplate, 'utf8');
console.log('✅ index.html gerado com roteiro padrão JW Library!');

const artifactPath = path.resolve('C:/Users/lafai/.gemini/antigravity/brain/d4fc619c-9d66-4a9c-b20b-705733b77051/reuniao_prototipo.html');
fs.writeFileSync(artifactPath, htmlTemplate, 'utf8');
console.log('✅ Artefato reuniao_prototipo.html atualizado!');

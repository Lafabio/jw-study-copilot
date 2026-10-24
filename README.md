# JW Study Copilot 📖✨

Um aplicativo moderno e inteligente para assistência no estudo pessoal e na preparação das reuniões congregacionais (**Vida e Ministério Cristãos** e **Estudo de A Sentinela**), integrado com recursos do Google Gemini AI.

---

## 🚀 Principais Recursos

- **Dados Oficiais Diretos do JW.ORG:**
  - Extrai dinamicamente as partes da **Apostila da Reunião (Meio de Semana)**.
  - Extrai os parágrafos, perguntas oficiais e textos "Leia" de **A Sentinela (Fim de Semana)**.
- **Seletor de Semanas Futuras:**
  - Permite navegar entre a semana atual e semanas futuras para preparação antecipada de designações e comentários.
- **Estrutura 100% Adaptável:**
  - Suporta semanas com 7, 8, 9 ou mais partes sem quebrar o layout.
- **Gemini Copilot Integrado:**
  - Botão **`⚡ Responder com Gemini`** em cada pergunta para gerar sugestões de respostas objetivas (30 a 45 segundos).
  - Sugestões para comentar textos lidos e ilustrações práticas do cotidiano.
  - Painel de chat contextual que se adapta à parte ou artigo em estudo.
- **Design Totalmente Responsivo:**
  - Otimizado para **smartphones, tablets e computadores**.
  - Gavetas deslizantes e barra inferior em telas móveis.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, Tailwind CSS, JavaScript Vanilla (sem dependências pesadas, compatível com PWA e GitHub Pages).
- **Backend / Coletor:** Node.js (v24+) com `fetch` nativo e manipulação de dados estruturados.
- **IA:** Integração contextual com a API do Google Gemini.

---

## 💻 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Lafabio/jw-study-copilot.git
   cd jw-study-copilot
   ```

2. Abra o arquivo `index.html` em qualquer navegador moderno.

3. Para atualizar os dados com as últimas semanas do JW.ORG:
   ```bash
   node src/fetch_future_weeks.mjs
   ```

---

## 📱 Acesso Online (GitHub Pages)

Acesse a versão interativa diretamente pelo seu celular, tablet ou computador através do link do GitHub Pages configurado neste repositório.

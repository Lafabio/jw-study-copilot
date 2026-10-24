-- ============================================================
-- SCHEMA DO SUPABASE: JW STUDY COPILOT
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Tabela de Cache das Reuniões (Semanas da Apostila e Sentinela)
CREATE TABLE IF NOT EXISTS public.meetings_cache (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year INT NOT NULL,
    week_number INT NOT NULL,
    content_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_year_week UNIQUE (year, week_number)
);

-- Habilitar leitura pública para as reuniões cacheadas
ALTER TABLE public.meetings_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura pública das reuniões"
    ON public.meetings_cache FOR SELECT
    USING (true);

-- 2. Tabela de Anotações e Comentários dos Usuários
CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- UUID de autenticação ou ID do dispositivo
    year INT NOT NULL,
    week_number INT NOT NULL,
    meeting_type TEXT NOT NULL, -- 'meio_semana' ou 'sentinela'
    item_key TEXT NOT NULL, -- ex: 'parte_1', 'paragrafo_2'
    note_text TEXT,
    ai_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_item UNIQUE (user_id, year, week_number, meeting_type, item_key)
);

ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir que usuários leiam suas próprias notas"
    ON public.user_notes FOR SELECT
    USING (true);

CREATE POLICY "Permitir que usuários criem e atualizem suas notas"
    ON public.user_notes FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir atualização de notas"
    ON public.user_notes FOR UPDATE
    USING (true);

-- 3. Tabela de Histórico de Conversas do Copilot
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    year INT NOT NULL,
    week_number INT NOT NULL,
    meeting_type TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user' ou 'assistant'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acesso ao histórico de chat"
    ON public.chat_history FOR ALL
    USING (true);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_meetings_year_week ON public.meetings_cache (year, week_number);
CREATE INDEX IF NOT EXISTS idx_notes_user_week ON public.user_notes (user_id, year, week_number);

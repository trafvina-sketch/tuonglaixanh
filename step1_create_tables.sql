-- =======================================================
-- BƯỚC 1: TẠO BẢNG & PHÂN QUYỀN (NGẮN GỌN - CHUẨN XÁC 100%)
-- Copy toàn bộ đoạn này dán vào Supabase SQL Editor và bấm RUN
-- =======================================================

CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    proclamation_text TEXT,
    content_html TEXT NOT NULL,
    thumbnail_webp_url TEXT,
    seal_type VARCHAR(50) DEFAULT 'canhbao',
    views_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(500) NOT NULL,
    youtube_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) DEFAULT 'phim_ngan',
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.narcotics_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    street_names VARCHAR(255),
    disguise_type VARCHAR(100),
    harm_description TEXT NOT NULL,
    image_webp_url TEXT,
    danger_level VARCHAR(20) DEFAULT 'extreme',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.anonymous_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_text TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_image_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_title VARCHAR(255) NOT NULL,
    scenario_story TEXT NOT NULL,
    image_webp_url TEXT,
    options JSONB NOT NULL,
    tip_trang_ti TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'refusal',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT BẢO MẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.narcotics_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- CẤP QUYỀN TRUY VẤN
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read Articles" ON public.articles;
    CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public All Articles" ON public.articles;
    CREATE POLICY "Public All Articles" ON public.articles FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Read Videos" ON public.videos;
    CREATE POLICY "Public Read Videos" ON public.videos FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public All Videos" ON public.videos;
    CREATE POLICY "Public All Videos" ON public.videos FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Read Catalog" ON public.narcotics_catalog;
    CREATE POLICY "Public Read Catalog" ON public.narcotics_catalog FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public All Catalog" ON public.narcotics_catalog;
    CREATE POLICY "Public All Catalog" ON public.narcotics_catalog FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Insert Reports" ON public.anonymous_reports;
    CREATE POLICY "Public Insert Reports" ON public.anonymous_reports FOR INSERT WITH CHECK (true);
    DROP POLICY IF EXISTS "Public All Reports" ON public.anonymous_reports;
    CREATE POLICY "Public All Reports" ON public.anonymous_reports FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Read Quiz" ON public.quiz_questions;
    CREATE POLICY "Public Read Quiz" ON public.quiz_questions FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public All Quiz" ON public.quiz_questions;
    CREATE POLICY "Public All Quiz" ON public.quiz_questions FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
    CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public All Settings" ON public.site_settings;
    CREATE POLICY "Public All Settings" ON public.site_settings FOR ALL USING (true);
END $$;

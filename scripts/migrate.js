const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pjegwrjxooaemxlpkwxy.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZWd3cmp4b29hZW14bHBrd3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDA1NzcyMywiZXhwIjoyMTA1NjMzNzIzfQ.R4DQFTMirVyW1LJUNbMFEnbUN6KheWCUIw2sJLxEhHg';
const DB_PASS = process.env.SUPABASE_DB_PASSWORD || '94AIpEfUxHtRgQdU';

const DDL_QUERY = `
-- 1. BẢNG BÀI VIẾT TUYÊN TRUYỀN & GIÁO DỤC (HERITAGE ARTICLES)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    proclamation_text TEXT,               -- Lời hịch tuyên truyền ngắn
    content_html TEXT NOT NULL,          -- Nội dung rich text có kèm ảnh .webp
    thumbnail_webp_url TEXT,            -- URL ảnh bìa đã tối ưu WebP
    seal_type VARCHAR(50) DEFAULT 'canhbao', -- 'canhbao', 'kienthuc', 'phongve'
    views_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG CHIẾU THƯ VIDEO YOUTUBE TUYÊN TRUYỀN
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(500) NOT NULL,
    youtube_id VARCHAR(50) NOT NULL,     -- ID video: dQw4w9WgXcQ
    category VARCHAR(50) DEFAULT 'phim_ngan', -- 'phim_ngan', 'canh_bao', 'ky_nang'
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG BÁCH THẢO TRẤN MA (DANH MỤC NHẬN DIỆN MA TÚY NGỤY TRANG)
CREATE TABLE IF NOT EXISTS public.narcotics_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,         -- Tên: Tinh dầu Pod Chill, Nước vui, Tem giấy
    street_names VARCHAR(255),          -- Tên đường phố / tiếng lóng
    disguise_type VARCHAR(100),         -- Đội lốt: Bánh kẹo, son môi, nước giải khát
    harm_description TEXT NOT NULL,     -- Tác hại thực tế lên não bộ, tim mạch
    image_webp_url TEXT,                -- Ảnh minh họa dạng .webp
    danger_level VARCHAR(20) DEFAULT 'extreme', -- 'warning', 'danger', 'extreme'
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG HỘP THƯ CỨU VIỆN & TỐ GIÁC ẨN DANH (HỌC SINH THCS)
CREATE TABLE IF NOT EXISTS public.anonymous_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_text TEXT NOT NULL,         -- Địa điểm phát hiện: Cổng trường, quán net, ngõ vắng
    description TEXT NOT NULL,           -- Nội dung sự vụ
    evidence_image_url TEXT,            -- Ảnh bằng chứng (nếu có, dạng .webp)
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.narcotics_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_reports ENABLE ROW LEVEL SECURITY;

-- CẤP QUYỀN ĐỌC CÔNG KHAI
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public Read Articles') THEN
        CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Public Read Videos') THEN
        CREATE POLICY "Public Read Videos" ON public.videos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'narcotics_catalog' AND policyname = 'Public Read Catalog') THEN
        CREATE POLICY "Public Read Catalog" ON public.narcotics_catalog FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'anonymous_reports' AND policyname = 'Public Insert Reports') THEN
        CREATE POLICY "Public Insert Reports" ON public.anonymous_reports FOR INSERT WITH CHECK (true);
    END IF;
END $$;
`;

async function main() {
  console.log('🚀 Bắt đầu khởi tạo Supabase Storage Bucket và Database Schema...');

  // 1. Khởi tạo Supabase Storage Bucket cho ảnh WebP
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.warn('⚠️ Lỗi kiểm tra buckets:', listError.message);
    } else {
      const exists = buckets.some(b => b.name === 'app-assets');
      if (!exists) {
        const { error: createError } = await supabase.storage.createBucket('app-assets', {
          public: true,
          fileSizeLimit: 2097152, // 2MB limit (ảnh WebP chỉ khoảng 100KB)
          allowedMimeTypes: ['image/webp', 'image/png', 'image/jpeg']
        });
        if (createError) {
          console.warn('⚠️ Không thể tạo bucket app-assets tự động:', createError.message);
        } else {
          console.log('✅ Đã tạo thành công Storage Bucket "app-assets" (Public 100% Free)!');
        }
      } else {
        console.log('✅ Bucket "app-assets" đã tồn tại.');
      }
    }
  } catch (err) {
    console.error('Lỗi khi thiết lập storage:', err.message);
  }

  // 2. Kết nối Database PostgreSQL qua Connection Pooler (ap-northeast-2)
  const poolerHost = 'aws-0-ap-northeast-2.pooler.supabase.com';
  const client = new Client({
    host: poolerHost,
    port: 6543,
    user: 'postgres.pjegwrjxooaemxlpkwxy',
    password: DB_PASS,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log(`🔌 Đang kết nối tới Supabase PostgreSQL qua pooler: ${poolerHost}...`);
    await client.connect();
    console.log('✅ Kết nối PostgreSQL thành công!');
    await client.query(DDL_QUERY);
    console.log('🎉 Đã khởi tạo hoàn tất toàn bộ Bảng và Policies trên Supabase Database!');
    await client.end();
  } catch (err) {
    console.warn('⚠️ Không thể kết nối trực tiếp cổng 6543 qua pooler:', err.message);
    console.log('👉 Em sẽ sử dụng Supabase REST API & Storage hoặc cung cấp SQL DDL để Thầy chạy 1 cú click trên Supabase Dashboard.');
    try { await client.end(); } catch (e) {}
  }
}

main();

const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 6543,
  user: 'postgres.pjegwrjxooaemxlpkwxy',
  password: process.env.SUPABASE_DB_PASSWORD || '94AIpEfUxHtRgQdU',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const SQL = `
-- 1. BẢNG CẤU HÌNH BANNER & NỘI DUNG TOÀN TRANG (SITE SETTINGS)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CẤP QUYỀN RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public Read Settings') THEN
        CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public All Settings') THEN
        CREATE POLICY "Public All Settings" ON public.site_settings FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'narcotics_catalog' AND policyname = 'Public All Catalog') THEN
        CREATE POLICY "Public All Catalog" ON public.narcotics_catalog FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public All Articles') THEN
        CREATE POLICY "Public All Articles" ON public.articles FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Public All Videos') THEN
        CREATE POLICY "Public All Videos" ON public.videos FOR ALL USING (true);
    END IF;
END $$;

-- NẠP GIÁ TRỊ CẤU HÌNH BANNER MẶC ĐỊNH NẾU CHƯA CÓ
INSERT INTO public.site_settings (key, value)
VALUES 
  ('hero_banner_image', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'),
  ('hero_title', 'Cảnh giác giặc vô hình: Đừng để khói ảo ma quái hủy hoại tuổi thanh xuân!'),
  ('hero_subtitle', 'Ma túy thế hệ mới đang đội lốt tinh vi dưới dạng pod chill thơm ngọt, nước vui, kẹo sô-cô-la, tem giấy bùa lưỡi nhằm tấn công cổng trường THCS. Nhận diện sớm là chiếc khiên vững chắc nhất để tự bảo vệ bản thân và bè bạn.'),
  ('hero_proclamation', 'Chiếu Thư Cảnh Báo Khẩn')
ON CONFLICT (key) DO NOTHING;

-- CẬP NHẬT THÊM ẢNH THUMBNAIL TRỰC QUAN MẪU CHO CÁC THẺ BÁCH THẢO TRẤN MA
UPDATE public.narcotics_catalog 
SET image_webp_url = 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80'
WHERE name = 'Tinh Dầu Pod Chill' AND (image_webp_url IS NULL OR image_webp_url = '');

UPDATE public.narcotics_catalog 
SET image_webp_url = 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
WHERE name = 'Nước Vui (Chali / Trà Sữa)' AND (image_webp_url IS NULL OR image_webp_url = '');

UPDATE public.narcotics_catalog 
SET image_webp_url = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'
WHERE name = 'Tem Giấy (Bùa Lưỡi)' AND (image_webp_url IS NULL OR image_webp_url = '');

UPDATE public.narcotics_catalog 
SET image_webp_url = 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80'
WHERE name = 'Sô-cô-la Chill (Chocochill)' AND (image_webp_url IS NULL OR image_webp_url = '');

UPDATE public.narcotics_catalog 
SET image_webp_url = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80'
WHERE name = 'Bóng Cười (Khí N2O)' AND (image_webp_url IS NULL OR image_webp_url = '');
`;

async function main() {
  await client.connect();
  console.log('🔌 Kết nối PostgreSQL thành công...');
  await client.query(SQL);
  console.log('🎉 Đã tạo bảng site_settings và cập nhật ảnh thumbnail mẫu cho Bách Thảo Trấn Ma!');
  await client.end();
}

main().catch(err => {
  console.error('Lỗi migration:', err);
  process.exit(1);
});

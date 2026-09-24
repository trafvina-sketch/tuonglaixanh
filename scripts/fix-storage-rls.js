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
DO $$
BEGIN
  -- 1. Cho phép upload (INSERT) vào bucket app-assets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Insert app-assets') THEN
    CREATE POLICY "Public Insert app-assets" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'app-assets');
  END IF;

  -- 2. Cho phép đọc (SELECT) từ bucket app-assets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Select app-assets') THEN
    CREATE POLICY "Public Select app-assets" ON storage.objects FOR SELECT TO public USING (bucket_id = 'app-assets');
  END IF;

  -- 3. Cho phép cập nhật (UPDATE) trong bucket app-assets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Update app-assets') THEN
    CREATE POLICY "Public Update app-assets" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'app-assets');
  END IF;

  -- 4. Cho phép xóa (DELETE) trong bucket app-assets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Delete app-assets') THEN
    CREATE POLICY "Public Delete app-assets" ON storage.objects FOR DELETE TO public USING (bucket_id = 'app-assets');
  END IF;
END $$;
`;

async function main() {
  await client.connect();
  console.log('🔌 Kết nối PostgreSQL để sửa Storage RLS...');
  await client.query(SQL);
  console.log('✅ Đã cấp toàn quyền RLS cho bucket "app-assets" thành công!');
  await client.end();
}

main().catch(err => {
  console.error('Lỗi sửa storage RLS:', err);
  process.exit(1);
});

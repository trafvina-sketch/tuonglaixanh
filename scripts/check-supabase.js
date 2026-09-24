const SUPABASE_URL = 'https://drdjcilnebzqwybhwdvi.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZGpjaWxuZWJ6cXd5Ymh3ZHZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDIzMjg4OCwiZXhwIjoyMTA1ODA4ODg4fQ.sAvAsCW4PqqGK85TOFdprGpEufj_73M-PGynF9XRmR4';

async function testConnection() {
  console.log('🔄 Đang kiểm tra kết nối tới Supabase:', SUPABASE_URL);

  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json'
  };

  // 1. Kiểm tra Storage Buckets
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { headers });
    if (!res.ok) {
      console.log('❌ Lỗi list buckets:', res.status, await res.text());
    } else {
      const buckets = await res.json();
      console.log('📦 Danh sách Storage Buckets hiện tại:', buckets.map(b => b.name));
      const hasAssets = buckets.some(b => b.name === 'app-assets');
      if (!hasAssets) {
        console.log('⚡ Đang tự động tạo bucket "app-assets" (Public)...');
        const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            id: 'app-assets',
            name: 'app-assets',
            public: true,
            file_size_limit: 5242880,
            allowed_mime_types: ['image/webp', 'image/png', 'image/jpeg', 'image/gif']
          })
        });
        if (createRes.ok) {
          console.log('✅ ĐÃ TỰ ĐỘNG TẠO THÀNH CÔNG BUCKET "app-assets" (PUBLIC)!');
        } else {
          console.log('⚠️ Không tạo được bucket tự động:', await createRes.text());
        }
      } else {
        console.log('✅ Bucket "app-assets" ĐÃ TỒN TẠI SẴN.');
      }
    }
  } catch (err) {
    console.log('⚠️ Lỗi kiểm tra Storage:', err.message);
  }

  // 2. Kiểm tra các bảng trong database qua PostgREST
  const tables = ['articles', 'videos', 'narcotics_catalog', 'anonymous_reports', 'quiz_questions', 'site_settings'];
  console.log('\n📊 Đang kiểm tra tình trạng các bảng CSDL:');
  
  let allTablesExist = true;
  for (const tbl of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${tbl}?select=count`, {
        headers: {
          ...headers,
          'Range': '0-0',
          'Prefer': 'count=exact'
        }
      });

      if (!res.ok) {
        allTablesExist = false;
        console.log(`❌ Bảng [${tbl}]: CHƯA TỒN TẠI trên Supabase.`);
      } else {
        const countHeader = res.headers.get('content-range');
        const count = countHeader ? countHeader.split('/')[1] : '0';
        console.log(`✅ Bảng [${tbl}]: ĐÃ TỒN TẠI (Số dòng hiện có: ${count})`);
      }
    } catch (e) {
      allTablesExist = false;
      console.log(`❌ Bảng [${tbl}]: Lỗi: ${e.message}`);
    }
  }

  console.log('\n--------------------------------------------------');
  if (allTablesExist) {
    console.log('🎉 TUYỆT VỜI! Tất cả các bảng đã tồn tại đầy đủ trên Supabase.');
  } else {
    console.log('👉 HƯỚNG DẪN: Dự án của bạn trên Supabase là mới tinh.');
    console.log('👉 Bạn chỉ cần vào mục SQL Editor trên Supabase Dashboard, copy file "supabase_setup.sql" và nhấn RUN là xong ngay!');
  }
  console.log('--------------------------------------------------');
}

testConnection();

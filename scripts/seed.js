const { Client } = require('pg');

const DB_PASS = process.env.SUPABASE_DB_PASSWORD || '94AIpEfUxHtRgQdU';
const poolerHost = 'aws-0-ap-northeast-2.pooler.supabase.com';

const SEED_DATA = `
-- 1. SEED DANH MỤC BÁCH THẢO TRẤN MA (NHẬN DIỆN MA TÚY HỌC ĐƯỜNG)
INSERT INTO public.narcotics_catalog (name, street_names, disguise_type, harm_description, danger_level, order_index)
VALUES 
(
  'Tinh Dầu Pod Chill', 
  'Pod chill, Pod dầu, Vape chill, Khói thơm', 
  'Ống hút điện tử nhiều màu sắc, tỏa hương thơm ngát vị dâu, xoài, việt quất', 
  'Bản chất chứa chất cần sa tổng hợp nguy hiểm (ADB-BUTINACA). Làm loạn nhịp tim, co giật, suy hô hấp, hôn mê sâu và ảo giác mạnh ngay từ lần đầu tiên sử dụng.', 
  'extreme',
  1
),
(
  'Nước Vui (Chali / Trà Sữa)', 
  'Nước vui, Nước dâu, Nước xoài Chali, Nước sướng', 
  'Gói bột hòa tan in hình trái cây bắt mắt hoặc giả dạng gói trà túi lọc, bột collagen', 
  'Hỗn hợp cực độc trộn lẫn Ketamine, Ecstasy (thuốc lắc) và thuốc an thần Diazepam. Gây co giật toàn thân, xuất huyết não, hoại tử nội tạng và tử vong nhanh chóng.', 
  'extreme',
  2
),
(
  'Tem Giấy (Bùa Lưỡi)', 
  'Bùa lưỡi, Tem giấy, Bùa ảo giác, LSD', 
  'Miếng giấy nhỏ bằng móng tay in hình các nhân vật hoạt hình ngộ nghĩnh, ngậm dưới lưỡi', 
  'Chứa chất ma túy bán tổng hợp cực mạnh LSD. Gây ảo giác dị thường về không gian và thời gian, hoang tưởng bị truy sát, dẫn đến hành vi nhảy lầu tự sát.', 
  'extreme',
  3
),
(
  'Sô-cô-la Chill (Chocochill)', 
  'Kẹo chill, Bánh lười (Lazy Cakes), Bánh cần', 
  'Thanh sô-cô-la hoặc bánh quy ăn vặt đóng gói như hàng nhập khẩu cao cấp', 
  'Tẩm tinh dầu cần sa và chất kích thích thần kinh. Làm tê liệt vùng nhận thức của não bộ tuổi dậy thì, mất trí nhớ, ảo thanh và nghiện lệ thuộc.', 
  'danger',
  4
),
(
  'Bóng Cười (Khí N2O)', 
  'Bóng cười, Khí cười, Dinitrogen monoxide', 
  'Quả bóng cao su bơm đầy khí để hít trực tiếp bằng miệng', 
  'Khí N2O gây ức chế hệ thần kinh trung ương, phá hủy tế bào tủy sống, gây tê liệt vận động 2 chân và tổn thương vĩnh viễn hệ thần kinh não bộ.', 
  'danger',
  5
)
ON CONFLICT DO NOTHING;

-- 2. SEED CHIẾU THƯ VIDEO YOUTUBE TUYÊN TRUYỀN
INSERT INTO public.videos (title, youtube_url, youtube_id, category, description, order_index)
VALUES
(
  'Ma túy núp bóng thuốc lá điện tử tấn công giới trẻ',
  'https://www.youtube.com/watch?v=0h7vN0oJ0zM',
  '0h7vN0oJ0zM',
  'canh_bao',
  'Phóng sự điều tra đặc biệt từ VTV24 về thủ đoạn tẩm ướp cần sa tổng hợp vào tinh dầu vape lừa học sinh sử dụng.',
  1
),
(
  'Hiểm họa nước vui và ma túy ngụy trang đồ uống học đường',
  'https://www.youtube.com/watch?v=kYJqD9bV6X8',
  'kYJqD9bV6X8',
  'canh_bao',
  'Cảnh báo từ Đội Cảnh sát Điều tra tội phạm về Ma túy (ANTV) về các gói bột pha nước giải khát độc hại.',
  2
),
(
  'Kỹ năng từ chối khi bị bạn bè rủ rê chất kích thích',
  'https://www.youtube.com/watch?v=eBGIQ7ZuuiU',
  'eBGIQ7ZuuiU',
  'ky_nang',
  'Chuyên gia tâm lý học đường hướng dẫn 4 bước vàng thoát hiểm khi bị ép buộc trong trường học.',
  3
)
ON CONFLICT DO NOTHING;

-- 3. SEED BÀI VIẾT TUYÊN TRUYỀN MẪU
INSERT INTO public.articles (title, slug, proclamation_text, content_html, seal_type, is_published)
VALUES
(
  'Tứ Bộ Khẩu Quyết: 4 bước vàng thoát hiểm khi bị bạn bè ép dùng Pod Chill',
  'tu-bo-khau-quyet-thoat-hiem',
  'Bí kíp bảo toàn danh dự và thân thể trước những lời dụ dỗ ngon ngọt của kẻ xấu chốn học đường.',
  '<p>Tuổi học trò là lứa tuổi tươi đẹp nhất của đời người. Thế nhưng, không ít bạn học sinh đã trót đánh mất tương lai chỉ vì một lời thách đố: <em>"Hút thử một hơi đi, sành điệu lắm, không nghiện đâu!"</em>.</p><h3>1. Nhìn thẳng đối phương, lắc đầu dứt khoát</h3><p>Kẻ xấu thường nhắm vào các bạn học sinh có vẻ rụt rè, e ngại. Khi bạn dứt khoát nói to: <strong>"Tớ KHÔNG dùng!"</strong>, kẻ xấu sẽ mất thế chủ động.</p><h3>2. Đưa ra lý do sức khỏe bất khả kháng</h3><p>Hãy nói: <em>"Tớ bị viêm xoang/dị ứng khói nặng, ngửi là lên cơn hen khó thở ngất ngay!"</em>. Không ai có thể ép một người đang có nguy cơ sốc phản vệ.</p><h3>3. Đánh trống lảng và rời khỏi nơi nguy hiểm</h3><p>Chủ động chuyển sang chuyện học hành hoặc rủ cả nhóm vào chỗ đông người. Bước ngay về phía Thầy Cô hoặc Bác Bảo Vệ.</p>',
  'phongve',
  true
),
(
  'Vạch trần bộ mặt thật của "Nước Vui" và các loại kẹo ngậm ma quái',
  'vach-tran-bo-mat-that-nuoc-vui',
  'Cảnh báo khẩn cấp từ cơ quan chức năng về các chất kích thích đội lốt thực phẩm ăn vặt.',
  '<p>Gần đây, các bệnh viện lớn liên tục tiếp nhận những ca cấp cứu học sinh cấp 2 trong tình trạng co giật, hôn mê sâu sau khi uống chung một chai nước lạ tại các buổi liên hoan sinh nhật.</p><p>Qua giám định, cơ quan công an phát hiện trong các gói "nước vui" này chứa hỗn hợp ma túy tổng hợp cực độc. Các chất này khi đi vào cơ thể sẽ tàn phá hệ thần kinh chỉ sau vài phút.</p><p><strong>Khẩu quyết ghi nhớ:</strong> Tuyệt đối không nhận đồ uống, bánh kẹo từ người lạ hoặc đồ uống đã bị mở nắp rời khỏi tầm mắt!</p>',
  'canhbao',
  true
)
ON CONFLICT (slug) DO NOTHING;
`;

async function main() {
  const client = new Client({
    host: poolerHost,
    port: 6543,
    user: 'postgres.pjegwrjxooaemxlpkwxy',
    password: DB_PASS,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🌱 Đang nạp dữ liệu mẫu Di Sản Đại Việt vào Supabase Database...');
    await client.connect();
    await client.query(SEED_DATA);
    console.log('🎉 Nạp dữ liệu mẫu thành công 100%!');
    await client.end();
  } catch (err) {
    console.error('Lỗi khi nạp seed data:', err.message);
    try { await client.end(); } catch (e) {}
  }
}

main();

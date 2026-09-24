-- ====================================================================
-- DỰ ÁN: LÁ CHẮN HỌC ĐƯỜNG (TRƯỜNG HỌC KHÔNG MA TÚY)
-- BƯỚC 1: TẠO TOÀN BỘ BẢNG VÀ CẤP QUYỀN BẢO MẬT (RLS POLICIES)
-- ====================================================================

-- 1. BẢNG BÀI VIẾT TUYÊN TRUYỀN & GIÁO DỤC
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

-- 2. BẢNG VIDEO TUYÊN TRUYỀN HỌC ĐƯỜNG
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

-- 3. BẢNG BÁCH THẢO TRẤN MA (NHẬN DIỆN MA TÚY NGỤY TRANG)
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

-- 4. BẢNG HỘP THƯ BÁO CÁO & TỐ GIÁC ẨN DANH HỌC ĐƯỜNG
CREATE TABLE IF NOT EXISTS public.anonymous_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_text TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_image_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG CÂU HỎI TRẮC NGHIỆM TÌNH HUỐNG (ĐẤU TRÍ 60S)
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

-- 6. BẢNG CẤU HÌNH BANNER & NỘI DUNG TOÀN TRANG (SITE SETTINGS)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT BẢO MẬT RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.narcotics_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- CẤP QUYỀN ĐỌC & GHI TOÀN DIỆN
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

-- ====================================================================
-- BƯỚC 2: NẠP DỮ LIỆU BAN ĐẦU (SỬ DỤNG DOLLAR-QUOTING CHỐNG LỖI CÚ PHÁP)
-- ====================================================================

-- 1. Cấu hình banner và SEO
INSERT INTO public.site_settings (key, value)
VALUES 
  ('hero_title', $$Cảnh giác giặc vô hình: Đừng để khói ảo ma quái hủy hoại tuổi thanh xuân!$$),
  ('hero_subtitle', $$Ma túy thế hệ mới đang đội lốt tinh vi dưới dạng pod chill thơm ngọt, nước vui, kẹo sô-cô-la, tem giấy bùa lưỡi nhằm tấn công cổng trường THCS. Nhận diện sớm là chiếc khiên vững chắc nhất để tự bảo vệ bản thân và bè bạn.$$),
  ('hero_proclamation', $$Chiếu Thư Cảnh Báo Khẩn$$),
  ('hero_banner_image', $$https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80$$),
  ('seo_title', $$Lá Chắn Học Đường - Phòng Chống Ma Túy Học Đường THCS$$),
  ('seo_description', $$Cổng thông tin và Trợ lý Cố Vấn AI phòng chống ma túy học đường, nhận diện ma túy ngụy trang thế hệ mới dành cho học sinh, phụ huynh và nhà trường.$$)
ON CONFLICT (key) DO NOTHING;

-- 2. Nhận diện ma túy học đường
INSERT INTO public.narcotics_catalog (name, street_names, disguise_type, harm_description, image_webp_url, danger_level, order_index)
VALUES 
(
  $$Tinh Dầu Pod Chill$$, 
  $$Pod chill, Pod dầu, Vape chill, Khói thơm$$, 
  $$Ống hút điện tử nhiều màu sắc, tỏa hương thơm ngát vị dâu, xoài, việt quất$$, 
  $$Bản chất chứa chất cần sa tổng hợp nguy hiểm (ADB-BUTINACA). Làm loạn nhịp tim, co giật, suy hô hấp, hôn mê sâu và ảo giác mạnh ngay từ lần đầu tiên sử dụng.$$, 
  $$https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80$$,
  'extreme',
  1
),
(
  $$Nước Vui (Chali / Trà Sữa)$$, 
  $$Nước vui, Nước dâu, Nước xoài Chali, Nước sướng$$, 
  $$Gói bột hòa tan in hình trái cây bắt mắt hoặc giả dạng gói trà túi lọc, bột collagen$$, 
  $$Hỗn hợp cực độc trộn lẫn Ketamine, Ecstasy (thuốc lắc) và thuốc an thần Diazepam. Gây co giật toàn thân, xuất huyết não, hoại tử nội tạng và tử vong nhanh chóng.$$, 
  $$https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80$$,
  'extreme',
  2
),
(
  $$Tem Giấy (Bùa Lưỡi)$$, 
  $$Bùa lưỡi, Tem giấy, Bùa ảo giác, LSD$$, 
  $$Miếng giấy nhỏ bằng móng tay in hình các nhân vật hoạt hình ngộ nghĩnh, ngậm dưới lưỡi$$, 
  $$Chứa chất ma túy bán tổng hợp cực mạnh LSD. Gây ảo giác dị thường về không gian và thời gian, hoang tưởng bị truy sát, dẫn đến hành vi nhảy lầu tự sát.$$, 
  $$https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80$$,
  'extreme',
  3
),
(
  $$Sô-cô-la Chill (Chocochill)$$, 
  $$Kẹo chill, Bánh lười (Lazy Cakes), Bánh cần$$, 
  $$Thanh sô-cô-la hoặc bánh quy ăn vặt đóng gói như hàng nhập khẩu cao cấp$$, 
  $$Tẩm tinh dầu cần sa và chất kích thích thần kinh. Làm tê liệt vùng nhận thức của não bộ tuổi dậy thì, mất trí nhớ, ảo thanh và nghiện lệ thuộc.$$, 
  $$https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80$$,
  'danger',
  4
),
(
  $$Bóng Cười (Khí N2O)$$, 
  $$Bóng cười, Khí cười, Dinitrogen monoxide$$, 
  $$Quả bóng cao su bơm đầy khí để hít trực tiếp bằng miệng$$, 
  $$Khí N2O gây ức chế hệ thần kinh trung ương, phá hủy tế bào tủy sống, gây tê liệt vận động 2 chân và tổn thương vĩnh viễn hệ thần kinh não bộ.$$, 
  $$https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80$$,
  'danger',
  5
)
ON CONFLICT DO NOTHING;

-- 3. Video tuyên truyền
INSERT INTO public.videos (title, youtube_url, youtube_id, category, description, order_index)
VALUES
(
  $$Ma túy núp bóng thuốc lá điện tử tấn công giới trẻ$$,
  $$https://www.youtube.com/watch?v=0h7vN0oJ0zM$$,
  '0h7vN0oJ0zM',
  'canh_bao',
  $$Phóng sự điều tra đặc biệt từ VTV24 về thủ đoạn tẩm ướp cần sa tổng hợp vào tinh dầu vape lừa học sinh sử dụng.$$,
  1
),
(
  $$Hiểm họa nước vui và ma túy ngụy trang đồ uống học đường$$,
  $$https://www.youtube.com/watch?v=kYJqD9bV6X8$$,
  'kYJqD9bV6X8',
  'canh_bao',
  $$Cảnh báo từ Đội Cảnh sát Điều tra tội phạm về Ma túy (ANTV) về các gói bột pha nước giải khát độc hại.$$,
  2
),
(
  $$Kỹ năng từ chối khi bị bạn bè rủ rê chất kích thích$$,
  $$https://www.youtube.com/watch?v=eBGIQ7ZuuiU$$,
  'eBGIQ7ZuuiU',
  'ky_nang',
  $$Chuyên gia tâm lý học đường hướng dẫn 4 bước vàng thoát hiểm khi bị ép buộc trong trường học.$$,
  3
)
ON CONFLICT DO NOTHING;

-- 4. Bài viết tuyên truyền học đường
INSERT INTO public.articles (title, slug, proclamation_text, content_html, seal_type, is_published)
VALUES
(
  $$Tứ Bộ Khẩu Quyết: 4 bước vàng thoát hiểm khi bị bạn bè ép dùng Pod Chill$$,
  'tu-bo-khau-quyet-thoat-hiem',
  $$Bí kíp bảo toàn danh dự và thân thể trước những lời dụ dỗ ngon ngọt của kẻ xấu chốn học đường.$$,
  $$<p>Tuổi học trò là lứa tuổi tươi đẹp nhất của đời người. Thế nhưng, không ít bạn học sinh đã trót đánh mất tương lai chỉ vì một lời thách đố: <em>"Hút thử một hơi đi, sành điệu lắm, không nghiện đâu!"</em>.</p><h3>1. Nhìn thẳng đối phương, lắc đầu dứt khoát</h3><p>Kẻ xấu thường nhắm vào các bạn học sinh có vẻ rụt rè, e ngại. Khi bạn dứt khoát nói to: <strong>"Tớ KHÔNG dùng!"</strong>, kẻ xấu sẽ mất thế chủ động.</p><h3>2. Đưa ra lý do sức khỏe bất khả kháng</h3><p>Hãy nói: <em>"Tớ bị viêm xoang/dị ứng khói nặng, ngửi là lên cơn hen khó thở ngất ngay!"</em>. Không ai có thể ép một người đang có nguy cơ sốc phản vệ.</p><h3>3. Đánh trống lảng và rời khỏi nơi nguy hiểm</h3><p>Chủ động chuyển sang chuyện học hành hoặc rủ cả nhóm vào chỗ đông người. Bước ngay về phía Thầy Cô hoặc Bác Bảo Vệ.</p>$$,
  'phongve',
  true
),
(
  $$Vạch trần bộ mặt thật của "Nước Vui" và các loại kẹo ngậm ma quái$$,
  'vach-tran-bo-mat-that-nuoc-vui',
  $$Cảnh báo khẩn cấp từ cơ quan chức năng về các chất kích thích đội lốt thực phẩm ăn vặt.$$,
  $$<p>Gần đây, các bệnh viện lớn liên tục tiếp nhận những ca cấp cứu học sinh cấp 2 trong tình trạng co giật, hôn mê sâu sau khi uống chung một chai nước lạ tại các buổi liên hoan sinh nhật.</p><p>Qua giám định, cơ quan công an phát hiện trong các gói "nước vui" này chứa hỗn hợp ma túy tổng hợp cực độc. Các chất này khi đi vào cơ thể sẽ tàn phá hệ thần kinh chỉ sau vài phút.</p><p><strong>Khẩu quyết ghi nhớ:</strong> Tuyệt đối không nhận đồ uống, bánh kẹo từ người lạ hoặc đồ uống đã bị mở nắp rời khỏi tầm mắt!</p>$$,
  'canhbao',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Bộ câu hỏi trắc nghiệm tình huống
INSERT INTO public.quiz_questions (scenario_title, scenario_story, image_webp_url, options, tip_trang_ti, category, order_index)
VALUES
(
  $$Bẫy ngọt ngào ở quán trà sữa$$,
  $$Trong buổi liên hoan sinh nhật tại quán trà sữa gần trường, anh khóa trên đưa cho em một chiếc Pod sặc sỡ mùi kẹo đào bảo: "Hút một hơi cho thơm miệng và tỉnh táo học bài, người lớn ai cũng hút, sợ gì như con nít thế?". Cả nhóm đang nhìn em cười. Em sẽ làm gì?$$,
  $$https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80$$,
  $$[{"id":"A","text":"Hút thử 1 hơi thật nhẹ cho đỡ bị quê với bạn bè.","is_correct":false,"explanation":"Sai lầm nguy hiểm! Pod Chill chứa ma túy tổng hợp cực độc, chỉ 1 hơi có thể gây co giật, loạn thần và nghiện tức thì."},{"id":"B","text":"Quát to 'Đồ ma túy!' rồi hất đổ ly nước của anh ấy.","is_correct":false,"explanation":"Sai lầm! Hành vi kích động dễ dẫn tới ẩu đả, bị chặn đánh sau khi tan tiệc."},{"id":"C","text":"Áp dụng Kế Hoãn Binh: Ho sặc sụa 'Em bị hen suyễn nặng ngửi khói là ngất ngay!', rồi xin phép ra về và báo người lớn.","is_correct":true,"explanation":"Chính xác tuyệt đối! Kế hoãn binh vừa bảo toàn thân thể, vừa không khiêu khích đối phương, sau đó rút lui an toàn."}]]$$::jsonb,
  $$Hay lắm bạn nhỏ! Lấy cớ sức khỏe là chiếc khiên mềm dẻo nhưng vững chắc nhất để từ chối mọi lời ép uổng!$$,
  'refusal',
  1
),
(
  $$Cốc nước kỳ lạ màu hồng cam$$,
  $$Đi chơi nhà bạn, bạn của bạn mở một gói bột có chữ "Chali" pha vào cốc nước cam sủi bọt thơm lừng, bảo đây là "nước tăng lực nhập khẩu uống vào quẩy cực sung". Em thấy màu nước hơi đục và có mùi thơm hắc lạ. Em xử lý thế nào?$$,
  $$https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80$$,
  $$[{"id":"A","text":"Uống thử nửa cốc xem có sung thật không rồi tính tiếp.","is_correct":false,"explanation":"Cực kỳ nguy hiểm! 'Nước vui' chứa Ketamine và Ecstasy, làm tê liệt ý thức và trụy tim mạch."},{"id":"B","text":"Nhận lấy cốc, giả vờ nhấp môi không nuốt, chờ lúc không ai để ý đổ vào chậu cây rồi tìm cớ về sớm.","is_correct":true,"explanation":"Chuẩn xác! Giữ được hòa khí, không bị nghi ngờ ép uống, và nhanh chóng thoát hiểm."},{"id":"C","text":"Uống một ngụm rồi chia cho bạn thân uống cùng cho vui.","is_correct":false,"explanation":"Sai hoàn toàn! Vừa tự hại mình vừa lôi kéo bạn bè vào vòng nguy hiểm."}]]$$::jsonb,
  $$Nhớ kỹ khẩu quyết: Bất kỳ đồ uống nào đã mở nắp hoặc do người khác pha sẵn ở chỗ đông người, tuyệt đối không được đưa vào miệng!$$,
  'identify',
  2
),
(
  $$Món quà ăn vặt bí ẩn trước cổng trường$$,
  $$Giờ tan học, một người lạ mặt dừng xe máy mời chào: "Chú có loại kẹo dẻo hình gấu vị dâu Tây ngon lắm, phát miễn phí cho học sinh ngoan ăn thử để quảng cáo!". Em thấy trên bao bì có in hình chiếc lá gai nhọn 7 cánh và chữ nhỏ "THC". Em sẽ:$$,
  $$https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80$$,
  $$[{"id":"A","text":"Thấy phát miễn phí nên nhận ngay vài gói chia cho cả lớp ăn cùng.","is_correct":false,"explanation":"Rất nguy hại! Đây là kẹo tẩm cần sa (THC), kẻ xấu thường phát miễn phí để tạo con nghiện học đường."},{"id":"B","text":"Lắc đầu dứt khoát: 'Cháu không lấy!', bước nhanh vào trong trường và báo ngay cho bác bảo vệ.","is_correct":true,"explanation":"Xuất sắc! Lắc đầu dứt khoát, di chuyển vào nơi an toàn và báo ngay cho lực lượng chức năng của trường."},{"id":"C","text":"Cầm lấy rồi đem về giấu vào cặp sách xem sau.","is_correct":false,"explanation":"Không an toàn! Để đồ lạ trong cặp có nguy cơ lỡ miệng ăn phải hoặc bị kẻ xấu đổ tội."}]]$$::jsonb,
  $$Ghi nhớ: Miếng pho-mát miễn phí chỉ có trên bẫy chuột! Đồ ăn vặt không rõ nguồn gốc trước cổng trường là cạm bẫy chết người!$$,
  'identify',
  3
),
(
  $$Áp lực nhóm: "Không hút là không phải anh em"$$,
  $$Trong nhà vệ sinh trường, một nhóm bạn cùng khối chặn em lại, đưa điếu thuốc lá điện tử và dọa: "Mày phải làm một hơi thì mới được vào nhóm, nếu không từ mai cả khối sẽ tẩy chay và không ai chơi với mày!". Em chọn cách nào?$$,
  $$https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80$$,
  $$[{"id":"A","text":"Sợ bị tẩy chay nên đành nhắm mắt hút một hơi cho xong chuyện.","is_correct":false,"explanation":"Sai lầm! Nhượng bộ một lần sẽ bị ép buộc vô số lần sau, trở thành nạn nhân bị tống tiền và nghiện ngập."},{"id":"B","text":"Đánh lại cả nhóm để thể hiện mình không sợ ai.","is_correct":false,"explanation":"Nguy hiểm! Một mình đối đầu với đám đông dễ dẫn tới chấn thương nặng."},{"id":"C","text":"Bình tĩnh nhìn thẳng: 'Tớ không thích hút, việc chơi hay không là tùy các cậu!', lập tức đi ra ngoài chỗ đông người và báo kín cho thầy cô.","is_correct":true,"explanation":"Bản lĩnh đích thực! Bạn bè chân chính không bao giờ ép nhau hủy hoại tương lai. Tố giác kín giúp giải quyết tận gốc."}]]$$::jsonb,
  $$Kẻ ép con vào con đường nghiệt ngã không phải là bạn! Hãy dũng cảm quay lưng và tìm sự che chở của thầy cô!$$,
  'refusal',
  4
),
(
  $$Nhờ chuyển gói hàng kín với tiền công 500k$$,
  $$Một người quen trên mạng xã hội nhắn tin: "Em cầm giúp anh hộp trà bọc băng dính đen này giao cho một anh đứng ở cột đèn ngã tư, xong việc anh bắn cho 500k tiền nạp game! Cứ để trong balo, ai hỏi bảo đồ dùng học tập". Em xử lý sao?$$,
  $$https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80$$,
  $$[{"id":"A","text":"Thấy việc nhẹ lương cao kiếm 500k dễ dàng nên nhận lời đi giao ngay.","is_correct":false,"explanation":"Hậu quả khôn lường! Vận chuyển ma túy dù chỉ 'cầm hộ' vẫn bị truy cứu trách nhiệm hình sự rất nặng, có thể đi tù."},{"id":"B","text":"Mở gói hàng ra xem bên trong có gì, nếu là ma túy mới từ chối.","is_correct":false,"explanation":"Không nên! Chạm vào gói hàng có thể dính dấu vân tay, biến em thành đồng phạm."},{"id":"C","text":"Tuyệt đối từ chối: 'Em bận học không nhận ship hộ đồ!', chụp màn hình tin nhắn và báo cho cha mẹ/thầy cô.","is_correct":true,"explanation":"Sáng suốt phi thường! Kẻ buôn ma túy rất hay lợi dụng học sinh ngây thơ để làm người vận chuyển. Chặn đứng ngay từ đầu!"}]]$$::jsonb,
  $$Luật pháp rất nghiêm minh: Cầm hộ, giữ hộ hay mang hộ ma túy đều là phạm tội! Đừng vì vài đồng tiền tiêu vặt mà đánh đổi cả cuộc đời!$$,
  'law',
  5
)
ON CONFLICT DO NOTHING;

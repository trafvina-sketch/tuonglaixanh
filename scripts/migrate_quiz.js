const { Client } = require('pg');

const DB_PASS = process.env.SUPABASE_DB_PASSWORD || '94AIpEfUxHtRgQdU';

const client = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 6543,
  user: 'postgres.pjegwrjxooaemxlpkwxy',
  password: DB_PASS,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

const DDL_QUERY = `
-- 1. BẢNG CÂU HỎI TRẮC NGHIỆM TÌNH HUỐNG (QUIZ QUESTIONS)
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

-- BẬT RLS & CẤP QUYỀN TRUY VẤN CÔNG KHAI
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view quiz_questions" ON public.quiz_questions;
CREATE POLICY "Public can view quiz_questions" ON public.quiz_questions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can manage quiz_questions" ON public.quiz_questions;
CREATE POLICY "Service role can manage quiz_questions" ON public.quiz_questions
    FOR ALL USING (true);
`;

const SEED_QUESTIONS = [
  {
    scenario_title: "Bẫy ngọt ngào ở quán trà sữa",
    scenario_story: "Trong buổi liên hoan sinh nhật tại quán trà sữa gần trường, anh khóa trên đưa cho em một chiếc Pod sặc sỡ mùi kẹo đào bảo: 'Hút một hơi cho thơm miệng và tỉnh táo học bài, người lớn ai cũng hút, sợ gì như con nít thế?'. Cả nhóm đang nhìn em cười. Em sẽ làm gì?",
    image_webp_url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
    options: JSON.stringify([
      { id: "A", text: "Hút thử 1 hơi thật nhẹ cho đỡ bị quê với bạn bè.", is_correct: false, explanation: "Sai lầm nguy hiểm! Pod Chill chứa ma túy tổng hợp cực độc, chỉ 1 hơi có thể gây co giật, loạn thần và nghiện tức thì." },
      { id: "B", text: "Quát to 'Đồ ma túy!' rồi hất đổ ly nước của anh ấy.", is_correct: false, explanation: "Sai lầm! Hành vi kích động dễ dẫn tới ẩu đả, bị chặn đánh sau khi tan tiệc." },
      { id: "C", text: "Áp dụng Kế Hoãn Binh: Ho sặc sụa 'Em bị hen suyễn nặng ngửi khói là ngất ngay!', rồi xin phép ra về và báo người lớn.", is_correct: true, explanation: "Chính xác tuyệt đối! Kế hoãn binh vừa bảo toàn thân thể, vừa không khiêu khích đối phương, sau đó rút lui an toàn." }
    ]),
    tip_trang_ti: "Hay lắm bạn nhỏ! Lấy cớ sức khỏe là chiếc khiên mềm dẻo nhưng vững chắc nhất để từ chối mọi lời ép uổng!",
    category: "refusal",
    order_index: 1
  },
  {
    scenario_title: "Cốc nước kỳ lạ màu hồng cam",
    scenario_story: "Đi chơi nhà bạn, bạn của bạn mở một gói bột có chữ 'Chali' pha vào cốc nước cam sủi bọt thơm lừng, bảo đây là 'nước tăng lực nhập khẩu uống vào quẩy cực sung'. Em thấy màu nước hơi đục và có mùi thơm hắc lạ. Em xử lý thế nào?",
    image_webp_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    options: JSON.stringify([
      { id: "A", text: "Uống thử nửa cốc xem có sung thật không rồi tính tiếp.", is_correct: false, explanation: "Cực kỳ nguy hiểm! 'Nước vui' chứa Ketamine và Ecstasy, làm tê liệt ý thức và trụy tim mạch." },
      { id: "B", text: "Nhận lấy cốc, giả vờ nhấp môi không nuốt, chờ lúc không ai để ý đổ vào chậu cây rồi tìm cớ về sớm.", is_correct: true, explanation: "Chuẩn xác! Giữ được hòa khí, không bị nghi ngờ ép uống, và nhanh chóng thoát hiểm." },
      { id: "C", text: "Uống một ngụm rồi chia cho bạn thân uống cùng cho vui.", is_correct: false, explanation: "Sai hoàn toàn! Vừa tự hại mình vừa lôi kéo bạn bè vào vòng nguy hiểm." }
    ]),
    tip_trang_ti: "Nhớ kỹ khẩu quyết: Bất kỳ đồ uống nào đã mở nắp hoặc do người khác pha sẵn ở chỗ đông người, tuyệt đối không được đưa vào miệng!",
    category: "identify",
    order_index: 2
  },
  {
    scenario_title: "Món quà ăn vặt bí ẩn trước cổng trường",
    scenario_story: "Giờ tan học, một người lạ mặt dừng xe máy mời chào: 'Chú có loại kẹo dẻo hình gấu vị dâu Tây ngon lắm, phát miễn phí cho học sinh ngoan ăn thử để quảng cáo!'. Em thấy trên bao bì có in hình chiếc lá gai nhọn 7 cánh và chữ nhỏ 'THC'. Em sẽ:",
    image_webp_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    options: JSON.stringify([
      { id: "A", text: "Thấy phát miễn phí nên nhận ngay vài gói chia cho cả lớp ăn cùng.", is_correct: false, explanation: "Rất nguy hại! Đây là kẹo tẩm cần sa (THC), kẻ xấu thường phát miễn phí để tạo con nghiện học đường." },
      { id: "B", text: "Lắc đầu dứt khoát: 'Cháu không lấy!', bước nhanh vào trong trường và báo ngay cho bác bảo vệ.", is_correct: true, explanation: "Xuất sắc! Lắc đầu dứt khoát, di chuyển vào nơi an toàn và báo ngay cho lực lượng chức năng của trường." },
      { id: "C", text: "Cầm lấy rồi đem về giấu vào cặp sách xem sau.", is_correct: false, explanation: "Không an toàn! Để đồ lạ trong cặp có nguy cơ lỡ miệng ăn phải hoặc bị kẻ xấu đổ tội." }
    ]),
    tip_trang_ti: "Bách Thảo Trấn Ma ghi rõ: Miếng pho-mát miễn phí chỉ có trên bẫy chuột! Đồ ăn vặt không rõ nguồn gốc trước cổng trường là cạm bẫy chết người!",
    category: "identify",
    order_index: 3
  },
  {
    scenario_title: "Áp lực nhóm: 'Không hút là không phải anh em'",
    scenario_story: "Trong nhà vệ sinh trường, một nhóm bạn cùng khối chặn em lại, đưa điếu thuốc lá điện tử và dọa: 'Mày phải làm một hơi thì mới được vào nhóm, nếu không từ mai cả khối sẽ tẩy chay và không ai chơi với mày!'. Em chọn cách nào?",
    image_webp_url: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80",
    options: JSON.stringify([
      { id: "A", text: "Sợ bị tẩy chay nên đành nhắm mắt hút một hơi cho xong chuyện.", is_correct: false, explanation: "Sai lầm! Nhượng bộ một lần sẽ bị ép buộc vô số lần sau, trở thành nạn nhân bị tống tiền và nghiện ngập." },
      { id: "B", text: "Đánh lại cả nhóm để thể hiện mình không sợ ai.", is_correct: false, explanation: "Nguy hiểm! Một mình đối đầu với đám đông dễ dẫn tới chấn thương nặng." },
      { id: "C", text: "Bình tĩnh nhìn thẳng: 'Tớ không thích hút, việc chơi hay không là tùy các cậu!', lập tức đi ra ngoài chỗ đông người và báo kín cho thầy cô.", is_correct: true, explanation: "Bản lĩnh đích thực! Bạn bè chân chính không bao giờ ép nhau hủy hoại tương lai. Tố giác kín giúp giải quyết tận gốc." }
    ]),
    tip_trang_ti: "Kẻ ép con vào con đường nghiệt ngã không phải là bạn, mà là quỷ dữ đội lốt bạn bè! Hãy dũng cảm quay lưng và tìm sự che chở của thầy cô!",
    category: "refusal",
    order_index: 4
  },
  {
    scenario_title: "Nhờ chuyển gói hàng kín với tiền công 500k",
    scenario_story: "Một người quen trên mạng xã hội nhắn tin: 'Em cầm giúp anh hộp trà bọc băng dính đen này giao cho một anh đứng ở cột đèn ngã tư, xong việc anh bắn cho 500k tiền nạp game! Cứ để trong balo, ai hỏi bảo đồ dùng học tập'. Em xử lý sao?",
    image_webp_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    options: JSON.stringify([
      { id: "A", text: "Thấy việc nhẹ lương cao kiếm 500k dễ dàng nên nhận lời đi giao ngay.", is_correct: false, explanation: "Hậu quả khôn lường! Vận chuyển ma túy dù chỉ 'cầm hộ' vẫn bị truy cứu trách nhiệm hình sự rất nặng, có thể đi tù." },
      { id: "B", text: "Mở gói hàng ra xem bên trong có gì, nếu là ma túy mới từ chối.", is_correct: false, explanation: "Không nên! Chạm vào gói hàng có thể dính dấu vân tay, biến em thành đồng phạm." },
      { id: "C", text: "Tuyệt đối từ chối: 'Em bận học không nhận ship hộ đồ!', chụp màn hình tin nhắn và báo cho cha mẹ/thầy cô.", is_correct: true, explanation: "Sáng suốt phi thường! Kẻ buôn ma túy rất hay lợi dụng học sinh ngây thơ để làm người vận chuyển. Chặn đứng ngay từ đầu!" }
    ]),
    tip_trang_ti: "Luật pháp Đại Việt rất nghiêm minh: Cầm hộ, giữ hộ hay mang hộ ma túy đều là phạm tội! Đừng vì vài đồng tiền tiêu vặt mà đánh đổi cả cuộc đời!",
    category: "law",
    order_index: 5
  }
];

async function runMigration() {
  console.log("⚡ Bắt đầu kết nối Supabase và khởi tạo bảng quiz_questions...");
  await client.connect();
  console.log("✅ Kết nối DB thành công!");

  await client.query(DDL_QUERY);
  console.log("✅ Đã tạo bảng quiz_questions và cấp quyền RLS!");

  // Kiểm tra đã có dữ liệu chưa
  const countRes = await client.query("SELECT COUNT(*) FROM public.quiz_questions;");
  if (parseInt(countRes.rows[0].count, 10) === 0) {
    console.log("⚡ Đang nạp 5 câu hỏi tình huống mẫu cho học sinh THCS...");
    for (const q of SEED_QUESTIONS) {
      await client.query(
        `INSERT INTO public.quiz_questions (scenario_title, scenario_story, image_webp_url, options, tip_trang_ti, category, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [q.scenario_title, q.scenario_story, q.image_webp_url, q.options, q.tip_trang_ti, q.category, q.order_index]
      );
    }
    console.log("🎉 Nạp 5 câu hỏi tình huống thành công!");
  } else {
    console.log(`ℹ️ Đã có ${countRes.rows[0].count} câu hỏi trong bảng quiz_questions.`);
  }

  await client.end();
  console.log("🏁 Hoàn thành di chuyển dữ liệu!");
}

runMigration().catch(err => {
  console.error("❌ Lỗi migration:", err);
  process.exit(1);
});

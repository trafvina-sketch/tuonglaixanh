const SUPABASE_URL = 'https://drdjcilnebzqwybhwdvi.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZGpjaWxuZWJ6cXd5Ymh3ZHZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDIzMjg4OCwiZXhwIjoyMTA1ODA4ODg4fQ.sAvAsCW4PqqGK85TOFdprGpEufj_73M-PGynF9XRmR4';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

async function seedData() {
  console.log('🌱 Đang tự động nạp dữ liệu mẫu vào Supabase qua REST API...');

  // 1. Nạp site_settings
  const settings = [
    { key: 'hero_title', value: 'Cảnh giác giặc vô hình: Đừng để khói ảo ma quái hủy hoại tuổi thanh xuân!' },
    { key: 'hero_subtitle', 'value': 'Ma túy thế hệ mới đang đội lốt tinh vi dưới dạng pod chill thơm ngọt, nước vui, kẹo sô-cô-la, tem giấy bùa lưỡi nhằm tấn công cổng trường THCS. Nhận diện sớm là chiếc khiên vững chắc nhất để tự bảo vệ bản thân và bè bạn.' },
    { key: 'hero_proclamation', value: 'Chiếu Thư Cảnh Báo Khẩn' },
    { key: 'hero_banner_image', value: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80' },
    { key: 'seo_title', value: 'Lá Chắn Học Đường - Phòng Chống Ma Túy Học Đường THCS' },
    { key: 'seo_description', value: 'Cổng thông tin và Trợ lý Cố Vấn AI phòng chống ma túy học đường, nhận diện ma túy ngụy trang thế hệ mới dành cho học sinh, phụ huynh và nhà trường.' }
  ];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(settings)
    });
    console.log('1. Site Settings:', res.ok ? '✅ Thành công' : `⚠️ ${res.statusText}`);
  } catch (e) { console.error('Lỗi site_settings:', e.message); }

  // 2. Nạp narcotics_catalog
  const catalog = [
    {
      name: 'Tinh Dầu Pod Chill',
      street_names: 'Pod chill, Pod dầu, Vape chill, Khói thơm',
      disguise_type: 'Ống hút điện tử nhiều màu sắc, tỏa hương thơm ngát vị dâu, xoài, việt quất',
      harm_description: 'Bản chất chứa chất cần sa tổng hợp nguy hiểm (ADB-BUTINACA). Làm loạn nhịp tim, co giật, suy hô hấp, hôn mê sâu và ảo giác mạnh ngay từ lần đầu tiên sử dụng.',
      image_webp_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
      danger_level: 'extreme',
      order_index: 1
    },
    {
      name: 'Nước Vui (Chali / Trà Sữa)',
      street_names: 'Nước vui, Nước dâu, Nước xoài Chali, Nước sướng',
      disguise_type: 'Gói bột hòa tan in hình trái cây bắt mắt hoặc giả dạng gói trà túi lọc, bột collagen',
      harm_description: 'Hỗn hợp cực độc trộn lẫn Ketamine, Ecstasy (thuốc lắc) và thuốc an thần Diazepam. Gây co giật toàn thân, xuất huyết não, hoại tử nội tạng và tử vong nhanh chóng.',
      image_webp_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      danger_level: 'extreme',
      order_index: 2
    },
    {
      name: 'Tem Giấy (Bùa Lưỡi)',
      street_names: 'Bùa lưỡi, Tem giấy, Bùa ảo giác, LSD',
      disguise_type: 'Miếng giấy nhỏ bằng móng tay in hình các nhân vật hoạt hình ngộ nghĩnh, ngậm dưới lưỡi',
      harm_description: 'Chứa chất ma túy bán tổng hợp cực mạnh LSD. Gây ảo giác dị thường về không gian và thời gian, hoang tưởng bị truy sát, dẫn đến hành vi nhảy lầu tự sát.',
      image_webp_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
      danger_level: 'extreme',
      order_index: 3
    },
    {
      name: 'Sô-cô-la Chill (Chocochill)',
      street_names: 'Kẹo chill, Bánh lười (Lazy Cakes), Bánh cần',
      disguise_type: 'Thanh sô-cô-la hoặc bánh quy ăn vặt đóng gói như hàng nhập khẩu cao cấp',
      harm_description: 'Tẩm tinh dầu cần sa và chất kích thích thần kinh. Làm tê liệt vùng nhận thức của não bộ tuổi dậy thì, mất trí nhớ, ảo thanh và nghiện lệ thuộc.',
      image_webp_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
      danger_level: 'danger',
      order_index: 4
    },
    {
      name: 'Bóng Cười (Khí N2O)',
      street_names: 'Bóng cười, Khí cười, Dinitrogen monoxide',
      disguise_type: 'Quả bóng cao su bơm đầy khí để hít trực tiếp bằng miệng',
      harm_description: 'Khí N2O gây ức chế hệ thần kinh trung ương, phá hủy tế bào tủy sống, gây tê liệt vận động 2 chân và tổn thương vĩnh viễn hệ thần kinh não bộ.',
      image_webp_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
      danger_level: 'danger',
      order_index: 5
    }
  ];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/narcotics_catalog`, {
      method: 'POST',
      headers,
      body: JSON.stringify(catalog)
    });
    console.log('2. Narcotics Catalog:', res.ok ? '✅ Thành công' : `⚠️ ${res.statusText}`);
  } catch (e) { console.error('Lỗi catalog:', e.message); }

  // 3. Nạp videos
  const videos = [
    {
      title: 'Ma túy núp bóng thuốc lá điện tử tấn công giới trẻ',
      youtube_url: 'https://www.youtube.com/watch?v=0h7vN0oJ0zM',
      youtube_id: '0h7vN0oJ0zM',
      category: 'canh_bao',
      description: 'Phóng sự điều tra đặc biệt từ VTV24 về thủ đoạn tẩm ướp cần sa tổng hợp vào tinh dầu vape lừa học sinh sử dụng.',
      order_index: 1
    },
    {
      title: 'Hiểm họa nước vui và ma túy ngụy trang đồ uống học đường',
      youtube_url: 'https://www.youtube.com/watch?v=kYJqD9bV6X8',
      youtube_id: 'kYJqD9bV6X8',
      category: 'canh_bao',
      description: 'Cảnh báo từ Đội Cảnh sát Điều tra tội phạm về Ma túy (ANTV) về các gói bột pha nước giải khát độc hại.',
      order_index: 2
    },
    {
      title: 'Kỹ năng từ chối khi bị bạn bè rủ rê chất kích thích',
      youtube_url: 'https://www.youtube.com/watch?v=eBGIQ7ZuuiU',
      youtube_id: 'eBGIQ7ZuuiU',
      category: 'ky_nang',
      description: 'Chuyên gia tâm lý học đường hướng dẫn 4 bước vàng thoát hiểm khi bị ép buộc trong trường học.',
      order_index: 3
    }
  ];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/videos`, {
      method: 'POST',
      headers,
      body: JSON.stringify(videos)
    });
    console.log('3. Videos:', res.ok ? '✅ Thành công' : `⚠️ ${res.statusText}`);
  } catch (e) { console.error('Lỗi videos:', e.message); }

  // 4. Nạp articles
  const articles = [
    {
      title: 'Tứ Bộ Khẩu Quyết: 4 bước vàng thoát hiểm khi bị bạn bè ép dùng Pod Chill',
      slug: 'tu-bo-khau-quyet-thoat-hiem',
      proclamation_text: 'Bí kíp bảo toàn danh dự và thân thể trước những lời dụ dỗ ngon ngọt của kẻ xấu chốn học đường.',
      content_html: '<p>Tuổi học trò là lứa tuổi tươi đẹp nhất của đời người. Thế nhưng, không ít bạn học sinh đã trót đánh mất tương lai chỉ vì một lời thách đố: <em>"Hút thử một hơi đi, sành điệu lắm, không nghiện đâu!"</em>.</p><h3>1. Nhìn thẳng đối phương, lắc đầu dứt khoát</h3><p>Kẻ xấu thường nhắm vào các bạn học sinh có vẻ rụt rè, e ngại. Khi bạn dứt khoát nói to: <strong>"Tớ KHÔNG dùng!"</strong>, kẻ xấu sẽ mất thế chủ động.</p><h3>2. Đưa ra lý do sức khỏe bất khả kháng</h3><p>Hãy nói: <em>"Tớ bị viêm xoang/dị ứng khói nặng, ngửi là lên cơn hen khó thở ngất ngay!"</em>. Không ai có thể ép một người đang có nguy cơ sốc phản vệ.</p><h3>3. Đánh trống lảng và rời khỏi nơi nguy hiểm</h3><p>Chủ động chuyển sang chuyện học hành hoặc rủ cả nhóm vào chỗ đông người. Bước ngay về phía Thầy Cô hoặc Bác Bảo Vệ.</p>',
      seal_type: 'phongve',
      is_published: true
    },
    {
      title: 'Vạch trần bộ mặt thật của "Nước Vui" và các loại kẹo ngậm ma quái',
      slug: 'vach-tran-bo-mat-that-nuoc-vui',
      proclamation_text: 'Cảnh báo khẩn cấp từ cơ quan chức năng về các chất kích thích đội lốt thực phẩm ăn vặt.',
      content_html: '<p>Gần đây, các bệnh viện lớn liên tục tiếp nhận những ca cấp cứu học sinh cấp 2 trong tình trạng co giật, hôn mê sâu sau khi uống chung một chai nước lạ tại các buổi liên hoan sinh nhật.</p><p>Qua giám định, cơ quan công an phát hiện trong các gói "nước vui" này chứa hỗn hợp ma túy tổng hợp cực độc. Các chất này khi đi vào cơ thể sẽ tàn phá hệ thần kinh chỉ sau vài phút.</p><p><strong>Khẩu quyết ghi nhớ:</strong> Tuyệt đối không nhận đồ uống, bánh kẹo từ người lạ hoặc đồ uống đã bị mở nắp rời khỏi tầm mắt!</p>',
      seal_type: 'canhbao',
      is_published: true
    }
  ];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(articles)
    });
    console.log('4. Articles:', res.ok ? '✅ Thành công' : `⚠️ ${res.statusText}`);
  } catch (e) { console.error('Lỗi articles:', e.message); }

  // 5. Nạp quiz_questions
  const quiz = [
    {
      scenario_title: "Bẫy ngọt ngào ở quán trà sữa",
      scenario_story: "Trong buổi liên hoan sinh nhật tại quán trà sữa gần trường, anh khóa trên đưa cho em một chiếc Pod sặc sỡ mùi kẹo đào bảo: 'Hút một hơi cho thơm miệng và tỉnh táo học bài, người lớn ai cũng hút, sợ gì như con nít thế?'. Cả nhóm đang nhìn em cười. Em sẽ làm gì?",
      image_webp_url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
      options: [
        { id: "A", text: "Hút thử 1 hơi thật nhẹ cho đỡ bị quê với bạn bè.", is_correct: false, explanation: "Sai lầm nguy hiểm! Pod Chill chứa ma túy tổng hợp cực độc, chỉ 1 hơi có thể gây co giật, loạn thần và nghiện tức thì." },
        { id: "B", text: "Quát to 'Đồ ma túy!' rồi hất đổ ly nước của anh ấy.", is_correct: false, explanation: "Sai lầm! Hành vi kích động dễ dẫn tới ẩu đả, bị chặn đánh sau khi tan tiệc." },
        { id: "C", text: "Áp dụng Kế Hoãn Binh: Ho sặc sụa 'Em bị hen suyễn nặng ngửi khói là ngất ngay!', rồi xin phép ra về và báo người lớn.", is_correct: true, explanation: "Chính xác tuyệt đối! Kế hoãn binh vừa bảo toàn thân thể, vừa không khiêu khích đối phương, sau đó rút lui an toàn." }
      ],
      tip_trang_ti: "Hay lắm bạn nhỏ! Lấy cớ sức khỏe là chiếc khiên mềm dẻo nhưng vững chắc nhất để từ chối mọi lời ép uổng!",
      category: "refusal",
      order_index: 1
    },
    {
      scenario_title: "Cốc nước kỳ lạ màu hồng cam",
      scenario_story: "Đi chơi nhà bạn, bạn của bạn mở một gói bột có chữ 'Chali' pha vào cốc nước cam sủi bọt thơm lừng, bảo đây là 'nước tăng lực nhập khẩu uống vào quẩy cực sung'. Em thấy màu nước hơi đục và có mùi thơm hắc lạ. Em xử lý thế nào?",
      image_webp_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
      options: [
        { id: "A", text: "Uống thử nửa cốc xem có sung thật không rồi tính tiếp.", is_correct: false, explanation: "Cực kỳ nguy hiểm! 'Nước vui' chứa Ketamine và Ecstasy, làm tê liệt ý thức và trụy tim mạch." },
        { id: "B", text: "Nhận lấy cốc, giả vờ nhấp môi không nuốt, chờ lúc không ai để ý đổ vào chậu cây rồi tìm cớ về sớm.", is_correct: true, explanation: "Chuẩn xác! Giữ được hòa khí, không bị nghi ngờ ép uống, và nhanh chóng thoát hiểm." },
        { id: "C", text: "Uống một ngụm rồi chia cho bạn thân uống cùng cho vui.", is_correct: false, explanation: "Sai hoàn toàn! Vừa tự hại mình vừa lôi kéo bạn bè vào vòng nguy hiểm." }
      ],
      tip_trang_ti: "Nhớ kỹ khẩu quyết: Bất kỳ đồ uống nào đã mở nắp hoặc do người khác pha sẵn ở chỗ đông người, tuyệt đối không được đưa vào miệng!",
      category: "identify",
      order_index: 2
    },
    {
      scenario_title: "Món quà ăn vặt bí ẩn trước cổng trường",
      scenario_story: "Giờ tan học, một người lạ mặt dừng xe máy mời chào: 'Chú có loại kẹo dẻo hình gấu vị dâu Tây ngon lắm, phát miễn phí cho học sinh ngoan ăn thử để quảng cáo!'. Em thấy trên bao bì có in hình chiếc lá gai nhọn 7 cánh và chữ nhỏ 'THC'. Em sẽ:",
      image_webp_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      options: [
        { id: "A", text: "Thấy phát miễn phí nên nhận ngay vài gói chia cho cả lớp ăn cùng.", is_correct: false, explanation: "Rất nguy hại! Đây là kẹo tẩm cần sa (THC), kẻ xấu thường phát miễn phí để tạo con nghiện học đường." },
        { id: "B", text: "Lắc đầu dứt khoát: 'Cháu không lấy!', bước nhanh vào trong trường và báo ngay cho bác bảo vệ.", is_correct: true, explanation: "Xuất sắc! Lắc đầu dứt khoát, di chuyển vào nơi an toàn và báo ngay cho lực lượng chức năng của trường." },
        { id: "C", text: "Cầm lấy rồi đem về giấu vào cặp sách xem sau.", is_correct: false, explanation: "Không an toàn! Để đồ lạ trong cặp có nguy cơ lỡ miệng ăn phải hoặc bị kẻ xấu đổ tội." }
      ],
      tip_trang_ti: "Ghi nhớ: Miếng pho-mát miễn phí chỉ có trên bẫy chuột! Đồ ăn vặt không rõ nguồn gốc trước cổng trường là cạm bẫy chết người!",
      category: "identify",
      order_index: 3
    },
    {
      scenario_title: "Áp lực nhóm: 'Không hút là không phải anh em'",
      scenario_story: "Trong nhà vệ sinh trường, một nhóm bạn cùng khối chặn em lại, đưa điếu thuốc lá điện tử và dọa: 'Mày phải làm một hơi thì mới được vào nhóm, nếu không từ mai cả khối sẽ tẩy chay và không ai chơi với mày!'. Em chọn cách nào?",
      image_webp_url: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80",
      options: [
        { id: "A", text: "Sợ bị tẩy chay nên đành nhắm mắt hút một hơi cho xong chuyện.", is_correct: false, explanation: "Sai lầm! Nhượng bộ một lần sẽ bị ép buộc vô số lần sau, trở thành nạn nhân bị tống tiền và nghiện ngập." },
        { id: "B", text: "Đánh lại cả nhóm để thể hiện mình không sợ ai.", is_correct: false, explanation: "Nguy hiểm! Một mình đối đầu với đám đông dễ dẫn tới chấn thương nặng." },
        { id: "C", text: "Bình tĩnh nhìn thẳng: 'Tớ không thích hút, việc chơi hay không là tùy các cậu!', lập tức đi ra ngoài chỗ đông người và báo kín cho thầy cô.", is_correct: true, explanation: "Bản lĩnh đích thực! Bạn bè chân chính không bao giờ ép nhau hủy hoại tương lai. Tố giác kín giúp giải quyết tận gốc." }
      ],
      tip_trang_ti: "Kẻ ép con vào con đường nghiệt ngã không phải là bạn! Hãy dũng cảm quay lưng và tìm sự che chở của thầy cô!",
      category: "refusal",
      order_index: 4
    },
    {
      scenario_title: "Nhờ chuyển gói hàng kín với tiền công 500k",
      scenario_story: "Một người quen trên mạng xã hội nhắn tin: 'Em cầm giúp anh hộp trà bọc băng dính đen này giao cho một anh đứng ở cột đèn ngã tư, xong việc anh bắn cho 500k tiền nạp game! Cứ để trong balo, ai hỏi bảo đồ dùng học tập'. Em xử lý sao?",
      image_webp_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
      options: [
        { id: "A", text: "Thấy việc nhẹ lương cao kiếm 500k dễ dàng nên nhận lời đi giao ngay.", is_correct: false, explanation: "Hậu quả khôn lường! Vận chuyển ma túy dù chỉ 'cầm hộ' vẫn bị truy cứu trách nhiệm hình sự rất nặng, có thể đi tù." },
        { id: "B", text: "Mở gói hàng ra xem bên trong có gì, nếu là ma túy mới từ chối.", is_correct: false, explanation: "Không nên! Chạm vào gói hàng có thể dính dấu vân tay, biến em thành đồng phạm." },
        { id: "C", text: "Tuyệt đối từ chối: 'Em bận học không nhận ship hộ đồ!', chụp màn hình tin nhắn và báo cho cha mẹ/thầy cô.", is_correct: true, explanation: "Sáng suốt phi thường! Kẻ buôn ma túy rất hay lợi dụng học sinh ngây thơ để làm người vận chuyển. Chặn đứng ngay từ đầu!" }
      ],
      tip_trang_ti: "Luật pháp rất nghiêm minh: Cầm hộ, giữ hộ hay mang hộ ma túy đều là phạm tội! Đừng vì vài đồng tiền tiêu vặt mà đánh đổi cả cuộc đời!",
      category: "law",
      order_index: 5
    }
  ];

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/quiz_questions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(quiz)
    });
    console.log('5. Quiz Questions:', res.ok ? '✅ Thành công' : `⚠️ ${res.statusText}`);
  } catch (e) { console.error('Lỗi quiz:', e.message); }

  console.log('🎉 ĐÃ HOÀN TẤT NẠP DỮ LIỆU MẪU LÊN SUPABASE!');
}

seedData();

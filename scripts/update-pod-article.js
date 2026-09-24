const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

const formattedHtml = `
<p class="lead-text font-medium text-slate-700 text-base sm:text-lg mb-6 leading-relaxed">
Thời gian gần đây, thuốc lá điện tử thế hệ mới (thường được gọi là <strong>Pod, Vape, Pod Chill</strong>) đang len lỏi vào môi trường học đường với tốc độ báo động. Đằng sau lớp vỏ bọc đầy màu sắc thời thượng và những làn khói thơm ngọt ngào là những cạm bẫy nguy hiểm, trực tiếp đe dọa sức khỏe và tương lai của cả một thế hệ trẻ nếu không được cảnh báo và ngăn chặn kịp thời.
</p>

<div class="my-6 p-5 sm:p-6 bg-red-50/80 border-l-4 border-red-600 rounded-r-2xl shadow-xs">
  <h3 class="text-lg font-black text-red-700 mb-3 flex items-center gap-2">
    <span>⚠️ 1. Bẫy Nghiện Chất Độc Hại Từ Sớm</span>
  </h3>
  <ul class="space-y-2.5 text-slate-700 pl-1">
    <li class="flex items-start gap-2">
      <span class="text-red-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Hàm lượng Nicotine cực cao:</strong> Nhiều dòng pod dùng một lần (disposable pod) chứa lượng muối nicotine tương đương với 1 đến 2 bao thuốc lá truyền thống. Nicotine là chất gây nghiện cực mạnh, khiến não bộ học sinh rơi vào trạng thái phụ thuộc chỉ sau vài lần thử.
      </div>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-red-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Cửa ngõ bước sang ma túy tổng hợp:</strong> Nhiều nghiên cứu y khoa chỉ ra người hút pod có nguy cơ chuyển sang hút thuốc lá điếu cao gấp 3-4 lần, và nguy hiểm hơn là dễ dàng bị kẻ xấu dụ dỗ sử dụng các loại <em>Pod Chill</em> tẩm cần sa tổng hợp hoặc ma túy đá.
      </div>
    </li>
  </ul>
</div>

<div class="my-6 p-5 sm:p-6 bg-amber-50/80 border-l-4 border-amber-600 rounded-r-2xl shadow-xs">
  <h3 class="text-lg font-black text-amber-800 mb-3 flex items-center gap-2">
    <span>🧠 2. Tàn Phá Não Bộ Và Thể Chất Đang Phát Triển</span>
  </h3>
  <ul class="space-y-2.5 text-slate-700 pl-1">
    <li class="flex items-start gap-2">
      <span class="text-amber-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Tổn thương trí não vĩnh viễn:</strong> Não bộ của thanh thiếu niên tiếp tục hoàn thiện cho đến năm 25 tuổi. Nicotine làm gián đoạn sự phát triển các kết nối thần kinh, dẫn đến suy giảm trí nhớ, giảm khả năng tập trung tiếp thu bài học và mất khả năng kiểm soát cảm xúc.
      </div>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-amber-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Hủy hoại đường hô hấp (Hội chứng Phổi bỏng ngô):</strong> Hóa chất tạo hương như Diacetyl và kim loại nặng chì, thiếc giải phóng khi đốt nóng tinh dầu gây tổn thương phế nang cấp tính (hội chứng EVALI) — một dạng xơ hóa phổi không thể phục hồi.
      </div>
    </li>
  </ul>
</div>

<div class="my-6 p-5 sm:p-6 bg-sky-50/80 border-l-4 border-sky-600 rounded-r-2xl shadow-xs">
  <h3 class="text-lg font-black text-sky-800 mb-3 flex items-center gap-2">
    <span>🎭 3. Chiêu Trò Thao Túng Tâm Lý Tinh Vi</span>
  </h3>
  <ul class="space-y-2.5 text-slate-700 pl-1">
    <li class="flex items-start gap-2">
      <span class="text-sky-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Thiết kế ngụy trang tinh vi:</strong> Pod hiện nay được sản xuất dưới hình dáng bút viết, thỏi son, cục tẩy, đồ chơi hoạt hình lego hay đầu cắm USB, giúp học sinh dễ dàng lén lút cất giấu trong cặp sách để qua mặt cha mẹ và giám thị nhà trường.
      </div>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-sky-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Hương vị ngụy trang hấp dẫn:</strong> Các mùi hương ngọt ngào như xoài lạnh, dưa hấu, kẹo sữa, trà sữa che giấu hoàn toàn mùi khét độc hại của hóa chất, tạo cho các em cảm giác giả tạo rằng đây chỉ là một thứ "kẹo hơi vô hại".
      </div>
    </li>
  </ul>
</div>

<div class="my-6 p-5 sm:p-6 bg-purple-50/80 border-l-4 border-purple-600 rounded-r-2xl shadow-xs">
  <h3 class="text-lg font-black text-purple-900 mb-3 flex items-center gap-2">
    <span>👥 4. Bình Thường Hóa Một Thói Quen Tiêu Cực</span>
  </h3>
  <ul class="space-y-2.5 text-slate-700 pl-1">
    <li class="flex items-start gap-2">
      <span class="text-purple-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Áp lực đồng trang lứa (Peer pressure):</strong> Khói thuốc pod bị các video TikTok và mạng xã hội gắn mác là "chất chơi", "ngầu", "trưởng thành". Nhiều học sinh bị bạn bè cô lập, chê bai là "nhát gan" nếu không cùng chuyền tay nhau hút.
      </div>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-purple-500 font-bold mt-1">•</span>
      <div>
        <strong class="text-slate-900 font-bold">Ảo tưởng giảm stress:</strong> Khi gặp căng thẳng trong học tập hay tình cảm, nhiều em tìm đến pod như một lối thoát tạm thời. Nhưng thực tế sau cảm giác hưng phấn 10 phút, nicotin lại gia tăng mức độ bồn chồn, hoảng loạn và trầm cảm khi thiếu liều.
      </div>
    </li>
  </ul>
</div>

<div class="my-6 p-5 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl shadow-xs">
  <h4 class="text-base font-black text-emerald-900 mb-2 flex items-center gap-2">
    <span>🛡️ Thông Điệp Từ Ban Tuyên Truyền THCS Nguyễn Hồng Ánh:</span>
  </h4>
  <p class="text-sm text-emerald-900 leading-relaxed font-medium">
    Bản lĩnh và sự trưởng thành thực sự của một người học trò không nằm ở việc hút một hơi khói độc để chứng tỏ bản thân, mà nằm ở sự dũng cảm dám nói <strong>"KHÔNG!"</strong> trước những lời rủ rê nguy hại. Hãy trân trọng cơ thể mình và bảo vệ tương lai của chính bạn!
  </p>
</div>
`;

async function main() {
  const { data, error } = await supabase
    .from("articles")
    .update({
      content_html: formattedHtml.trim(),
      proclamation_text: "Một hơi hút thử hôm nay có thể cướp đi cả tương lai khỏe mạnh ngày mai. Hãy kiên quyết nói KHÔNG với thuốc lá điện tử học đường!",
    })
    .eq("id", "b09c2381-3e91-40e5-acdd-b8c17dcf6b70")
    .select();

  if (error) {
    console.error("Lỗi khi cập nhật bài viết:", error);
  } else {
    console.log("Cập nhật bài viết thành công!");
    console.log("Dữ liệu cập nhật:", data[0]?.title);
  }
}

main();

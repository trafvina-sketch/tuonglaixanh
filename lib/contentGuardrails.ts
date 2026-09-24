/**
 * LÁ CHẮN NỘI DUNG HỌC ĐƯỜNG (CONTENT SAFETY GUARDRAILS)
 * Dự án: Lá Chắn Học Đường - Phòng chống ma túy học đường
 * 
 * Kiểm duyệt 2 lớp (Client & Server):
 * 1. Chặn từ khóa thô tục, chửi thề, lăng mạ (tiếng Việt có dấu, không dấu, teencode, lách ký tự).
 * 2. Chặn nội dung khiêu dâm, 18+, gợi dục, quấy rối.
 * 3. Chặn hành vi hỏi cách pha chế, điều chế, buôn bán ma túy, hướng dẫn lén lút sử dụng.
 * 4. Chặn nội dung bạo lực cực đoan, tự hại/tự sát.
 */

// Bảng chuyển đổi ký tự có dấu sang không dấu
export function removeVietnameseAccents(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

export interface ContentSafetyResult {
  isSafe: boolean;
  violationType?: "profanity" | "sexual" | "drug_sourcing" | "violence" | "inappropriate";
  reason?: string;
  feedbackMessage?: string;
}

// 1. DANH SÁCH TỪ KHÓA CHỬI THỀ, THÔ TỤC (Có dấu & Không dấu)
const PROFANITY_WORDS = [
  // Chửi thề phổ biến & viết tắt
  "đm", "dm", "dcm", "đcm", "đkm", "dkm", "vcl", "vkl", "vl", "vcc", "clgt", "cmm", "dume", "đume",
  "duma", "đuma", "du me", "đụ mẹ", "địt mẹ", "dit me", "địt mọe", "dit moe", "đjt", "djt", "djtme",
  "địt", "dit", "đụ", "du", "đệt", "det", "buồi", "buoi", "cặc", "cac", "chim cặc", "con cặc",
  "lồn", "lon", "loz", "lồz", "loz me", "cứt", "cut", "ỉa", "ia", "đách", "dell", "đíu", "đéo", "deo",
  "chó đẻ", "cho de", "súc sinh", "suc sinh", "đĩ", "di", "con đĩ", "con di", "điếm", "diem",
  "mẹ mày", "me may", "bố mày", "bo may", "cha mày", "cha may", "tiên sư", "mả cha", "thằng chó",
  "óc chó", "oc cho", "não chó", "nao cho", "ngu như chó", "ngu nhu cho", "óc lợn", "oc lon"
];

// 2. TỪ KHÓA KHIÊU DÂM, 18+, GỢI DỤC
const SEXUAL_WORDS = [
  "khiêu dâm", "khieu dam", "phim sex", "chat sex", "gái gọi", "gai goi", "làm tình", "lam tinh",
  "quan hệ tình dục", "quan he tinh duc", "thủ dâm", "thu dam", "sục cặc", "suc cac", "bú cu", "bu cu",
  "bú liếm", "bu liem", "hiếp dâm", "hiep dam", "ấu dâm", "au dam", "kích dục", "kich duc",
  "nứng", "nung", "lộ clip", "lo clip", "clip nóng", "clip nong", "jav", "hentai", "nude", "khỏa thân", "khoa than"
];

// 3. TỪ KHÓA HỎI CÁCH ĐIỀU CHẾ, BUÔN BÁN, PHA CHẾ CHẤT CẤM
const DRUG_SOURCING_WORDS = [
  "cách pha chế pod", "cach pha che pod", "cách chế pod chill", "cach che pod chill",
  "cách điều chế ma túy", "cach dieu che ma tuy", "cách làm ma túy", "cach lam ma tuy",
  "mua pod chill ở đâu", "mua pod chill o dau", "mua nước vui ở đâu", "mua nuoc vui o dau",
  "mua cần sa ở đâu", "mua can sa o dau", "chỗ bán cần", "cho ban can", "chỗ bán pod",
  "ship pod chill", "bán ma túy", "ban ma tuy", "giá 1 chỉ heroin", "gia 1 chi heroin",
  "cách hút cho phê", "cach hut cho phe", "hút sao cho phê", "hut sao cho phe",
  "cách giấu ma túy", "cach giau ma tuy", "cách lén mang", "cach len mang"
];

// 4. TỪ KHÓA BẠO LỰC CỰC ĐOAN, TỰ HẠI
const VIOLENCE_WORDS = [
  "cách tự tử", "cach tu tu", "cách tự sát", "cach tu sat", "muốn tự tử", "muon tu tu",
  "nhảy lầu tự tử", "nhay lau tu tu", "cắt cổ tay", "cat co tay", "chế tạo bom", "che tao bom",
  "cách làm bom", "cach lam bom", "đánh bom", "danh bom", "mua súng hoa cải", "mua sung"
];

// Regex bắt các biến thể lách luật cố tình tách chữ bằng dấu chấm, gạch hoặc dấu cách (vd: "đ . m", "v_c_l")
const EVASION_PATTERNS = [
  /\b[đd][\s._\-*]+[m][\s._\-*]+[c]?\b/i,           // đ.m, d.m, d.c.m
  /\b[v][\s._\-*]+[c][\s._\-*]+[l]\b/i,             // v.c.l
  /\b[đd][\s._\-*]+[ụu][\s._\-*]+[m][\s._\-*]+[ẹe]\b/i, // đ.ụ.m.ẹ
  /\b[đd][\s._\-*]+[ịi][\s._\-*]+[t][\s._\-*]+[m][\s._\-*]+[ẹe]\b/i, // đ.ị.t.m.ẹ
  /\b[l][\s._\-*]+[ồo][\s._\-*]+[n]\b/i,             // l.ồ.n
  /\b[c][\s._\-*]+[ặa][\s._\-*]+[c][\s._\-*]+[k]?\b/i // c.ặ.c
];

export const REFUSAL_INAPPROPRIATE_MESSAGE = `Chào bạn nhé!

Lá Chắn Học Đường nhận thấy lời nhắn của bạn chứa từ ngữ hoặc nội dung chưa phù hợp với môi trường học đường văn minh, trong sáng.

Trạng Tí luôn sẵn lòng lắng nghe và đồng hành bảo vệ bạn, nhưng chỉ đối thoại với những ngôn từ chuẩn mực, tôn trọng và lành mạnh. Hãy cùng nhau giữ gìn văn hóa học đường bạn nhé!

Nếu bạn đang băn khoăn về cách phòng chống ma túy hay cần lời khuyên tự vệ, hãy diễn đạt lại câu hỏi một cách lịch sự, Ta luôn ở đây để giúp bạn!`;

export function checkContentSafety(rawInput: string): ContentSafetyResult {
  if (!rawInput || typeof rawInput !== "string") {
    return { isSafe: true };
  }

  const text = rawInput.trim();
  if (text.length === 0) {
    return { isSafe: true };
  }

  const lowerText = text.toLowerCase();
  const noAccentsText = removeVietnameseAccents(lowerText);
  // Loại bỏ toàn bộ khoảng trắng và dấu câu để dò chữ lách luật
  const compacted = noAccentsText.replace(/[\s\-_.,*!?:;"'`~@#$%^&()+=/\\|[\]{}<>]/g, "");

  // 1. Kiểm tra Hỏi mua / Chế xuất chất ma túy
  for (const phrase of DRUG_SOURCING_WORDS) {
    if (lowerText.includes(phrase) || noAccentsText.includes(phrase)) {
      return {
        isSafe: false,
        violationType: "drug_sourcing",
        reason: "Yêu cầu có dấu hiệu hỏi cách pha chế, tìm mua hoặc sử dụng trái phép chất gây nghiện.",
        feedbackMessage: "Trạng Tí chỉ cung cấp kiến thức phòng chống, nhận diện tác hại và kỹ năng tự vệ. Mọi hành vi hướng dẫn điều chế, tìm mua hay sử dụng chất cấm đều vi phạm pháp luật nghiêm trọng!"
      };
    }
  }

  // 2. Kiểm tra Từ ngữ khiêu dâm / 18+
  for (const phrase of SEXUAL_WORDS) {
    if (lowerText.includes(phrase) || noAccentsText.includes(phrase)) {
      return {
        isSafe: false,
        violationType: "sexual",
        reason: "Nội dung phản cảm, không phù hợp với chuẩn mực học sinh.",
        feedbackMessage: REFUSAL_INAPPROPRIATE_MESSAGE
      };
    }
  }

  // 3. Kiểm tra Tự hại / Bạo lực nguy hiểm
  for (const phrase of VIOLENCE_WORDS) {
    if (lowerText.includes(phrase) || noAccentsText.includes(phrase)) {
      return {
        isSafe: false,
        violationType: "violence",
        reason: "Nội dung có yếu tố bạo lực hoặc nguy cơ tự hại.",
        feedbackMessage: "Nếu bạn hoặc ai đó đang trải qua cảm xúc tiêu cực, bế tắc hoặc cảm thấy nguy hiểm, xin đừng ngần ngại bấm gọi ngay Tổng đài Quốc gia Bảo vệ Trẻ em 111 hoặc nhờ Thầy Cô và Bác sĩ hỗ trợ ngay nhé!"
      };
    }
  }

  // 4. Kiểm tra Chửi thề, thô tục qua danh sách từ
  // Tách từ theo ranh giới từ để tránh bắt nhầm từ con vô hại
  const words = lowerText.split(/[\s,.;:!?+*&^%$#@~`"'/\\|()\[\]{}]+/);
  const wordsNoAccents = noAccentsText.split(/[\s,.;:!?+*&^%$#@~`"'/\\|()\[\]{}]+/);

  for (const p of PROFANITY_WORDS) {
    // Nếu p là từ ghép (có dấu cách)
    if (p.includes(" ")) {
      if (lowerText.includes(p) || noAccentsText.includes(p)) {
        return {
          isSafe: false,
          violationType: "profanity",
          reason: "Chứa từ ngữ thô tục, thiếu văn minh học đường.",
          feedbackMessage: REFUSAL_INAPPROPRIATE_MESSAGE
        };
      }
    } else {
      // Nếu p là từ đơn hoặc từ viết tắt (vd: đm, vcl, lồn, cặc)
      if (words.includes(p) || wordsNoAccents.includes(p)) {
        return {
          isSafe: false,
          violationType: "profanity",
          reason: "Chứa từ ngữ thô tục, thiếu văn minh học đường.",
          feedbackMessage: REFUSAL_INAPPROPRIATE_MESSAGE
        };
      }
    }
  }

  // 5. Kiểm tra các regex lách luật dạng phân tách (vd: "đ . m", "v _ c _ l")
  for (const pattern of EVASION_PATTERNS) {
    if (pattern.test(lowerText) || pattern.test(noAccentsText)) {
      return {
        isSafe: false,
        violationType: "profanity",
        reason: "Phát hiện từ ngữ thô tục dạng lách ký tự.",
        feedbackMessage: REFUSAL_INAPPROPRIATE_MESSAGE
      };
    }
  }

  // 6. Kiểm tra chuỗi compact cho các từ viết tắt nguy hiểm đặc trưng
  const strictCompactBlacklist = [
    "dm", "dcm", "dkm", "vcl", "vkl", "clgt", "duma", "dume", "ditme", "ditmoe", "djtme",
    "concac", "lonme", "lozme", "chode", "sucsinh"
  ];
  for (const bad of strictCompactBlacklist) {
    // Chỉ kích hoạt nếu toàn bộ chuỗi compact bằng đúng từ bậy hoặc chứa dạng bao quanh
    if (compacted === bad || compacted.includes(bad)) {
      return {
        isSafe: false,
        violationType: "profanity",
        reason: "Chứa từ ngữ thô tục viết tắt.",
        feedbackMessage: REFUSAL_INAPPROPRIATE_MESSAGE
      };
    }
  }

  return { isSafe: true };
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_ADVISOR_PROMPT, OUT_OF_SCOPE_REFUSAL_MOCK } from "@/lib/advisorPrompt";
import { checkRateLimit } from "@/lib/rateLimiter";
import { checkContentSafety, REFUSAL_INAPPROPRIATE_MESSAGE } from "@/lib/contentGuardrails";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const AI_API_URL = process.env.AGNES_API_BASE_URL || "https://apihub.agnes-ai.com/v1";
const AI_MODEL = process.env.AGNES_MODEL || "agnes-2.5-flash";
const CREDENTIAL_KEY = "advisor_api_keys";

// Lấy Kịch bản hệ thống do Admin cài đặt từ Database (hoặc dùng kịch bản chuẩn dân gian mặc định)
async function getAdvisorSystemPrompt(): Promise<string> {
  try {
    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "advisor_system_prompt")
      .single();

    if (data && data.value && typeof data.value === "string" && data.value.trim().length > 20) {
      return data.value.trim();
    }
  } catch (err: any) {
    console.warn("Dùng kịch bản mặc định do chưa nạp kịch bản tùy chỉnh:", err?.message);
  }
  return DEFAULT_ADVISOR_PROMPT;
}

// Bộ nhớ toàn cục lưu danh sách khóa bị lỗi và thời điểm hết hạn phạt (cooldown)
const keyFailureCooldownMap = new Map<string, number>();
let globalKeyRotationIndex = 0;

// Lấy danh sách các khóa từ Database và biến môi trường, luân phiên xoay vòng Round-Robin
async function getCandidateKeys(): Promise<string[]> {
  const keys: string[] = [];

  // 1. Lấy từ biến môi trường nếu có
  if (process.env.AGNES_API_KEY && process.env.AGNES_API_KEY.trim()) {
    keys.push(process.env.AGNES_API_KEY.trim());
  }

  // 2. Lấy từ bảng system_credentials trong Supabase
  try {
    const { data, error } = await supabaseAdmin
      .from("system_credentials")
      .select("key_values")
      .eq("key_name", CREDENTIAL_KEY)
      .single();

    if (!error && data && Array.isArray(data.key_values)) {
      for (const k of data.key_values) {
        if (typeof k === "string" && k.trim().length > 5) {
          keys.push(k.trim());
        }
      }
    }
  } catch (err: any) {
    console.warn("Không thể tải khóa từ system_credentials:", err?.message);
  }

  // Lọc trùng lặp
  const uniqueKeys = Array.from(new Set(keys));
  if (uniqueKeys.length === 0) return [];

  // 3. Lọc bỏ các khóa đang trong thời gian Cooldown
  const now = Date.now();
  let availableKeys = uniqueKeys.filter((k) => {
    const cooldownUntil = keyFailureCooldownMap.get(k);
    return !cooldownUntil || cooldownUntil < now;
  });

  // Nếu tất cả các khóa đều bị phạt -> xóa phạt để có khóa hoạt động
  if (availableKeys.length === 0) {
    keyFailureCooldownMap.clear();
    availableKeys = uniqueKeys;
  }

  // 4. Xoay vòng tuần tự (Round-Robin) chia đều tải cho các khóa khỏe mạnh
  const offset = globalKeyRotationIndex % availableKeys.length;
  globalKeyRotationIndex++;
  const rotatedKeys = [
    ...availableKeys.slice(offset),
    ...availableKeys.slice(0, offset),
  ];

  return rotatedKeys;
}

// Hàm làm sạch chuỗi văn bản hoàn chỉnh
function cleanAndFormatReply(rawText: string): string {
  if (!rawText) return "";

  let cleaned = rawText;

  // 1. Loại bỏ chữ Hán / tiếng Trung ngoại lai
  cleaned = cleaned.replace(/[\u4e00-\u9fa5]/g, "");

  // 2. Loại bỏ các ký tự Markdown dấu sao (*, **, ***)
  cleaned = cleaned.replace(/\*+/g, "");

  // 3. Loại bỏ các ký tự Markdown dấu thăng (#, ##, ###)
  cleaned = cleaned.replace(/#{1,6}\s?/g, "");

  // 4. Sửa các lỗi dịch máy và chuẩn hóa từ ngữ thuần Việt
  cleaned = cleaned
    .replace(/khởi bẩm sĩ tử[!.,]?/gi, "Chào bạn nhé!")
    .replace(/khởi bẩm[!.,]?/gi, "Chào bạn!")
    .replace(/sĩ tử ơi/gi, "bạn ơi")
    .replace(/các sĩ tử/gi, "các bạn")
    .replace(/sĩ tử/gi, "bạn")
    .replace(/áp đồ tin tế/gi, "đồ dùng ngụy trang")
    .replace(/bút mực du mục/gi, "cây bút dạ quang")
    .replace(/cào điện tử/gi, "thuốc lá điện tử")
    .replace(/dáng dáng/gi, "hình dáng")
    .replace(/thủy tinh thể/gi, "ống thủy tinh")
    .replace(/phá hủ/gi, "phá hủy")
    .replace(/\bespecially\b/gi, "đặc biệt")
    .replace(/\bpackaging\b/gi, "bao bì");

  // 5. Khắc phục lỗi gạch đầu dòng bị ngắt dòng xuống dưới
  cleaned = cleaned.replace(/[-•]\s*\n+\s*/g, "- ");

  // 6. Tự động xuống dòng cho gạch đầu dòng nếu dính liền
  cleaned = cleaned.replace(/([.!?])\s*[-•]\s+/g, "$1\n- ");

  // 7. Xóa các dòng trống thừa thãi
  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter((line, idx, arr) => !(line === "" && arr[idx - 1] === ""));

  cleaned = lines.join("\n").trim();

  // 8. Chống ngắt quãng lửng lơ ở cuối câu
  const lastChar = cleaned.slice(-1);
  if (![".", "!", "?", "”", '"', "…"].includes(lastChar)) {
    const lastPunctuation = Math.max(
      cleaned.lastIndexOf("."),
      cleaned.lastIndexOf("!"),
      cleaned.lastIndexOf("?")
    );
    if (lastPunctuation > cleaned.length * 0.5) {
      cleaned = cleaned.slice(0, lastPunctuation + 1).trim();
    }
  }

  return cleaned;
}

// Làm sạch chunk streaming nhẹ nhàng theo thời gian thực
function cleanStreamChunk(chunk: string): string {
  return chunk
    .replace(/[\u4e00-\u9fa5]/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/\bespecially\b/gi, "đặc biệt")
    .replace(/\bpackaging\b/gi, "bao bì");
}

// Sinh 3 câu hỏi gợi ý thông minh dựa trên ngữ cảnh vừa trao đổi
function generateFollowUpQuestions(lastUserQuery: string, assistantReply: string): string[] {
  const combined = (lastUserQuery + " " + assistantReply).toLowerCase();

  if (combined.includes("pod") || combined.includes("vape") || combined.includes("thuốc lá điện tử")) {
    return [
      "Hút thử 1 hơi pod chill có bị nghiện ngay không?",
      "Cách từ chối khéo léo khi bị cả nhóm bạn ép hút?",
      "Làm sao nhận biết bạn bè cùng lớp đang lén hút pod?"
    ];
  }

  if (combined.includes("nước vui") || combined.includes("chali") || combined.includes("kẹo") || combined.includes("bánh cần")) {
    return [
      "Lỡ uống nhầm nước lạ ở tiệc sinh nhật phải sơ cứu sao?",
      "Dấu hiệu người bị trúng độc ma túy nước vui?",
      "Cách bảo vệ đồ uống của mình khi đi liên hoan tập thể?"
    ];
  }

  if (combined.includes("cỏ mỹ") || combined.includes("tem giấy") || combined.includes("bóng cười") || combined.includes("ma túy đá")) {
    return [
      "Bóng cười N2O hủy hoại não bộ và tủy sống như thế nào?",
      "Tem giấy bùa lưỡi ngụy trang nguy hiểm ra sao?",
      "Cách né tránh an toàn khi gặp người ngáo đá hung hãn?"
    ];
  }

  if (combined.includes("từ chối") || combined.includes("ép") || combined.includes("dọa") || combined.includes("chặn đường")) {
    return [
      "Bị anh chị khóa trên chặn đường đe dọa thì báo ai?",
      "Cách báo Thầy Cô an toàn mà không lo bị trả thù?",
      "Gọi Tổng đài 111 có được giấu tên và bảo mật 100% không?"
    ];
  }

  return [
    "Cách nhận biết pod chill ngụy trang cây bút bi?",
    "4 bước từ chối vàng khi bị bạn bè rủ rê thử ma túy?",
    "Tổng đài 111 và 113 hỗ trợ học sinh khẩn cấp thế nào?"
  ];
}

export async function POST(req: NextRequest) {
  try {
    // 1. KIỂM TRA RATE LIMIT THEO ĐỊA CHỈ IP (Tối đa 10 yêu cầu/phút)
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : (realIp ? realIp.trim() : "127.0.0.1");

    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Bạn ơi, bạn gửi tin nhắn hơi nhanh rồi! Hãy bình tĩnh nghỉ ngơi ${rateCheck.retryAfterSeconds} giây rồi tiếp tục trò chuyện nhé.`,
          rateLimited: true,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": rateCheck.retryAfterSeconds.toString() },
        }
      );
    }

    const body = await req.json();
    const { messages, stream = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Danh sách tin nhắn không hợp lệ" }, { status: 400 });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const lastUserMsgLower = lastUserMsg.toLowerCase();

    // 2. LÁ CHẮN AN TOÀN HỌC ĐƯỜNG: CHẶN TỪ KHÓA THÔ TỤC, PHẢN CẢM, ĐIỀU CHẾ MA TÚY, BẠO LỰC
    const safetyCheck = checkContentSafety(lastUserMsg);
    if (!safetyCheck.isSafe) {
      const refusalMsg = cleanAndFormatReply(safetyCheck.feedbackMessage || REFUSAL_INAPPROPRIATE_MESSAGE);
      const safeSuggestions = [
        "Pod chill ngụy trang cây bút nguy hiểm thế nào?",
        "4 bước từ chối vàng khi bị bạn bè rủ rê?",
        "Tổng đài 111 và 113 hỗ trợ học sinh bí mật ra sao?"
      ];

      if (stream) {
        const encoder = new TextEncoder();
        const streamResponse = new ReadableStream({
          async start(controller) {
            const words = refusalMsg.split(" ");
            for (let i = 0; i < words.length; i++) {
              const word = words[i] + (i < words.length - 1 ? " " : "");
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "content", chunk: word })}\n\n`)
              );
              await new Promise((r) => setTimeout(r, 20));
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "suggestions", items: safeSuggestions })}\n\n`)
            );
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          },
        });

        return new Response(streamResponse, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      }

      return NextResponse.json({
        reply: refusalMsg,
        suggestions: safeSuggestions,
      });
    }

    // 3. KIỂM TRA CÂU HỎI HOÀN TOÀN NGOÀI LỀ (Toán, Lý, Hóa, Văn, Lập trình...)
    const outOfScopePatterns = [
      "giải toán", "bài toán", "tính diện tích", "phương trình", "đại số", "hình học",
      "giải bài", "viết văn", "bài văn", "soạn văn", "lập trình", "viết code", "viết phần mềm",
      "tiếng anh", "dịch bài", "hóa học", "vật lý", "làm thơ", "bài thơ", "tình yêu",
      "tỏ tình", "người yêu", "dự báo thời tiết", "chơi game", "chính trị", "chứng khoán",
      "bóng đá", "xem phim", "ca sĩ", "diễn viên", "x +", "x -", "x *", "x /"
    ];
    const isOutOfScope = outOfScopePatterns.some((pattern) => lastUserMsgLower.includes(pattern));

    const candidateKeys = await getCandidateKeys();
    const activeSystemPrompt = await getAdvisorSystemPrompt();

    // 4. XỬ LÝ KHI NGƯỜI DÙNG YÊU CẦU STREAMING (Mặc định stream: true)
    if (stream) {
      const encoder = new TextEncoder();

      // Nếu câu hỏi ngoài lề rõ ràng -> Stream ngay câu từ chối chuẩn
      if (isOutOfScope) {
        const streamResponse = new ReadableStream({
          async start(controller) {
            const refusalText = cleanAndFormatReply(OUT_OF_SCOPE_REFUSAL_MOCK);
            const words = refusalText.split(" ");
            for (let i = 0; i < words.length; i++) {
              const word = words[i] + (i < words.length - 1 ? " " : "");
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "content", chunk: word })}\n\n`)
              );
              await new Promise((r) => setTimeout(r, 20));
            }
            const suggestions = generateFollowUpQuestions(lastUserMsg, refusalText);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "suggestions", items: suggestions })}\n\n`)
            );
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
            controller.close();
          },
        });

        return new Response(streamResponse, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      }

      // Thử gọi AI Stream với tối đa 2 khóa luân phiên
      if (candidateKeys.length > 0) {
        const keysToTry = candidateKeys.slice(0, 2);

        for (let i = 0; i < keysToTry.length; i++) {
          const key = keysToTry[i];
          const maskedKey = `••••${key.slice(-4)}`;

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);

            const aiRes = await fetch(`${AI_API_URL}/chat/completions`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${key}`,
              },
              body: JSON.stringify({
                model: AI_MODEL,
                messages: [
                  { role: "system", content: activeSystemPrompt },
                  ...messages.slice(-6),
                ],
                temperature: 0.5,
                max_tokens: 1200,
                stream: true,
              }),
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (aiRes.ok && aiRes.body) {
              const aiReader = aiRes.body.getReader();
              const decoder = new TextDecoder();

              const streamResponse = new ReadableStream({
                async start(streamCtrl) {
                  // Gửi sự kiện ban đầu: đang suy ngẫm
                  streamCtrl.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "status", message: "Trạng Tí đang phân tích tình huống..." })}\n\n`
                    )
                  );

                  let buffer = "";
                  let accumulatedText = "";
                  let sentFindingKếSách = false;

                  try {
                    while (true) {
                      const { done, value } = await aiReader.read();
                      if (done) break;

                      buffer += decoder.decode(value, { stream: true });
                      const lines = buffer.split("\n");
                      buffer = lines.pop() || "";

                      for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data:")) continue;
                        if (trimmed === "data: [DONE]") continue;

                        try {
                          const json = JSON.parse(trimmed.slice(5).trim());
                          const delta = json.choices?.[0]?.delta;

                          // Khi AI đang suy luận (reasoning)
                          if (delta?.reasoning_content && !sentFindingKếSách) {
                            sentFindingKếSách = true;
                            streamCtrl.enqueue(
                              encoder.encode(
                                `data: ${JSON.stringify({ type: "status", message: "Đang tìm kiếm kế sách an toàn phù hợp..." })}\n\n`
                              )
                            );
                          }

                          // Khi có nội dung câu trả lời chính
                          if (delta?.content) {
                            const cleanedChunk = cleanStreamChunk(delta.content);
                            accumulatedText += cleanedChunk;
                            streamCtrl.enqueue(
                              encoder.encode(
                                `data: ${JSON.stringify({ type: "content", chunk: cleanedChunk })}\n\n`
                              )
                            );
                            // Nhịp độ điều hòa 25ms giữa các chunk để dòng text tuôn ra êm ái, không bị dồn cục
                            await new Promise((r) => setTimeout(r, 25));
                          }
                        } catch (parseErr) {
                          // bỏ qua dòng JSON không chuẩn
                        }
                      }
                    }

                    // Hoàn thành: Gửi 3 câu hỏi gợi ý và tín hiệu done
                    const suggestions = generateFollowUpQuestions(lastUserMsg, accumulatedText);
                    streamCtrl.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "suggestions", items: suggestions })}\n\n`
                      )
                    );
                    streamCtrl.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                    );
                    streamCtrl.close();
                  } catch (streamErr) {
                    streamCtrl.error(streamErr);
                  }
                },
              });

              keyFailureCooldownMap.delete(key);

              return new Response(streamResponse, {
                headers: {
                  "Content-Type": "text/event-stream; charset=utf-8",
                  "Cache-Control": "no-cache, no-transform",
                  Connection: "keep-alive",
                },
              });
            }

            if (aiRes.status === 401 || aiRes.status === 403) {
              keyFailureCooldownMap.set(key, Date.now() + 60 * 1000);
            }
          } catch (err: any) {
            console.warn(`Khóa [${maskedKey}] stream lỗi (${err.message}). Thử phương án tiếp theo...`);
          }
        }
      }

      // FALLBACK STREAMING NẾU TOÀN BỘ KHÓA AI BẬN
      let fallbackText = OUT_OF_SCOPE_REFUSAL_MOCK;
      if (lastUserMsgLower.includes("pod") || lastUserMsgLower.includes("thuốc lá điện tử") || lastUserMsgLower.includes("vape")) {
        fallbackText = `Chào bạn nhé! Về pod chill ngụy trang, hãy ghi nhớ các ý cốt lõi:

ĐẶC ĐIỂM & TÁC HẠI:
- Pod chill bị tẩm tinh dầu cần sa tổng hợp (ADB-BUTINACA) cực độc.
- Gây tim đập dồn dập, co giật, ảo giác và biến đổi hành vi.
- Gây nghiện rất nhanh, phá hủy tế bào não của lứa tuổi học sinh.

KẾ SÁCH THOÁT HIỂM:
- Lắc đầu dứt khoát: "Tớ dị ứng khói khó thở lắm!"
- Rút lui an toàn quay về lớp học hoặc tìm Thầy Cô, Bác Bảo Vệ.`;
      } else if (lastUserMsgLower.includes("nước vui") || lastUserMsgLower.includes("kẹo") || lastUserMsgLower.includes("chali")) {
        fallbackText = `Bạn nhỏ hãy cảnh giác cao độ:

ĐẶC ĐIỂM NGUY HIỂM:
- "Nước vui" hay kẹo sô-cô-la bay thực chất là ma túy tổng hợp pha trộn Ketamine và thuốc lắc.
- Không màu, không mùi vị lạ, dễ hòa tan vào nước ngọt để bẫy học sinh.

LỜI DẶN VÀNG:
- Của lạ chớ nếm, đồ uống mở nắp rời mắt tuyệt đối không dùng.
- Khi đi tiệc liên hoan, chỉ uống đồ do chính tay mình mở nắp.`;
      } else if (lastUserMsgLower.includes("từ chối") || lastUserMsgLower.includes("ép") || lastUserMsgLower.includes("dọa")) {
        fallbackText = `Đừng sợ hãi, hãy nhớ "4 bước từ chối vàng" của Trạng Tí:

CÁC BƯỚC THỰC HIỆN:
- Bước 1: Lắc đầu dứt khoát "Tớ KHÔNG dùng!"
- Bước 2: Cớ hoãn binh "Tớ bị hen suyễn khó thở ngửi khói là ngất"
- Bước 3: Đổi trận sang chuông vào lớp hoặc bài kiểm tra
- Bước 4: Chạy ngay đến chỗ Thầy Cô hoặc gọi Tổng đài 111 (Bảo vệ trẻ em) / 113 (Công an).`;
      }

      const streamResponse = new ReadableStream({
        async start(controller) {
          const cleanedFallback = cleanAndFormatReply(fallbackText);
          const words = cleanedFallback.split(" ");
          for (let i = 0; i < words.length; i++) {
            const word = words[i] + (i < words.length - 1 ? " " : "");
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "content", chunk: word })}\n\n`)
            );
            await new Promise((r) => setTimeout(r, 35));
          }
          const suggestions = generateFollowUpQuestions(lastUserMsg, cleanedFallback);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "suggestions", items: suggestions })}\n\n`)
          );
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        },
      });

      return new Response(streamResponse, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // 4. PHƯƠNG ÁN KHÔNG STREAM (DÀNH CHO CLIENT CŨ)
    return NextResponse.json({
      reply: cleanAndFormatReply(OUT_OF_SCOPE_REFUSAL_MOCK),
      suggestions: generateFollowUpQuestions(lastUserMsg, OUT_OF_SCOPE_REFUSAL_MOCK),
    });
  } catch (error: any) {
    console.error("Chat API error:", error.message);
    return NextResponse.json(
      { error: "Không thể kết nối với Cố Vấn Trạng Tí: " + error.message },
      { status: 500 }
    );
  }
}

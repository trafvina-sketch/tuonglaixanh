import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_PIN = "lachanhocduong2026";
const AGNES_API_URL = process.env.AGNES_API_BASE_URL || "https://apihub.agnes-ai.com/v1";
const AGNES_MODEL = process.env.AGNES_MODEL || "agnes-2.5-flash";
const CREDENTIAL_KEY = "advisor_api_keys";

// Hàm gửi thử nghiệm 1 request ngắn tới máy chủ
async function pingKey(key: string): Promise<{ ok: boolean; latencyMs: number; errorMsg?: string }> {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 giây timeout

    const res = await fetch(`${AGNES_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: AGNES_MODEL,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 2,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.ok) {
      return { ok: true, latencyMs };
    } else {
      const errText = await res.text();
      return { ok: false, latencyMs, errorMsg: `Máy chủ phản hồi mã ${res.status}` };
    }
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return { ok: false, latencyMs, errorMsg: err.name === "AbortError" ? "Quá thời gian chờ (Timeout)" : err.message };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, testKeys, testIndex } = body;

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "Không có quyền thử nghiệm" }, { status: 401 });
    }

    // Trường hợp 1: Thử nghiệm danh sách khóa vừa gõ trong ô nhập (chưa lưu)
    if (testKeys && typeof testKeys === "string" && testKeys.trim()) {
      const incomingKeys = testKeys
        .split(/[\n,;]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 5);

      if (incomingKeys.length === 0) {
        return NextResponse.json({ error: "Chưa có khóa nào để thử nghiệm" }, { status: 400 });
      }

      const results = [];
      for (let i = 0; i < incomingKeys.length; i++) {
        const k = incomingKeys[i];
        const res = await pingKey(k);
        results.push({
          index: i + 1,
          masked: `••••••••${k.slice(-4)}`,
          status: res.ok ? "valid" : "invalid",
          latency: `${res.latencyMs}ms`,
          message: res.ok ? "Kết nối thông suốt, sẵn sàng hoạt động" : (res.errorMsg || "Không thể kết nối"),
        });
      }

      const allValid = results.every((r) => r.status === "valid");
      return NextResponse.json({
        success: allValid,
        message: allValid
          ? `Tất cả ${results.length} khóa đều hoạt động hoàn hảo!`
          : `Có ${results.filter((r) => r.status === "invalid").length}/${results.length} khóa gặp trục trặc kết nối.`,
        results,
      });
    }

    // Trường hợp 2: Thử nghiệm khóa đã lưu trong Database
    const { data } = await supabaseAdmin
      .from("system_credentials")
      .select("key_values")
      .eq("key_name", CREDENTIAL_KEY)
      .single();

    const storedKeys: string[] = Array.isArray(data?.key_values) ? data.key_values : [];
    if (storedKeys.length === 0) {
      return NextResponse.json({
        error: "Chưa có khóa nào được lưu trong hệ thống. Hãy nhập khóa mới và bấm Thử Nghiệm.",
      }, { status: 404 });
    }

    // Thử nghiệm 1 khóa cụ thể hoặc toàn bộ
    if (typeof testIndex === "number" && testIndex >= 0 && testIndex < storedKeys.length) {
      const targetKey = storedKeys[testIndex];
      const res = await pingKey(targetKey);
      return NextResponse.json({
        success: res.ok,
        message: res.ok
          ? `Khóa #${testIndex + 1} hoạt động tốt (${res.latencyMs}ms)`
          : `Khóa #${testIndex + 1} lỗi kết nối: ${res.errorMsg}`,
      });
    }

    // Thử nghiệm toàn bộ danh sách đã lưu
    const results = [];
    for (let i = 0; i < storedKeys.length; i++) {
      const k = storedKeys[i];
      const res = await pingKey(k);
      results.push({
        index: i,
        masked: `••••••••${k.slice(-4)}`,
        status: res.ok ? "valid" : "invalid",
        latency: `${res.latencyMs}ms`,
        message: res.ok ? "Hoạt động tốt" : (res.errorMsg || "Lỗi"),
      });
    }

    const validCount = results.filter((r) => r.status === "valid").length;
    return NextResponse.json({
      success: validCount > 0,
      message: `Đã thử nghiệm: ${validCount}/${storedKeys.length} khóa đang trực tuyến tốt.`,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Lỗi máy chủ khi thử nghiệm: " + err.message }, { status: 500 });
  }
}

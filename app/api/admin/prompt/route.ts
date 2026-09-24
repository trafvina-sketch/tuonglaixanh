import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { DEFAULT_ADVISOR_PROMPT, DEFAULT_KNOWLEDGE_SCOPE } from "@/lib/advisorPrompt";

const ADMIN_PIN = "lachanhocduong2026";

// GET: Lấy kịch bản và phạm vi kiến thức hiện tại
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-admin-pin");
    if (authHeader !== ADMIN_PIN) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("key, value")
      .in("key", ["advisor_system_prompt", "advisor_knowledge_scope", "advisor_strict_mode"]);

    let systemPrompt = DEFAULT_ADVISOR_PROMPT;
    let knowledgeScope = DEFAULT_KNOWLEDGE_SCOPE;
    let strictMode = true;

    if (data && Array.isArray(data)) {
      data.forEach((item) => {
        if (item.key === "advisor_system_prompt" && item.value) {
          systemPrompt = item.value;
        }
        if (item.key === "advisor_knowledge_scope" && item.value) {
          knowledgeScope = item.value;
        }
        if (item.key === "advisor_strict_mode") {
          strictMode = item.value === "true" || item.value === true;
        }
      });
    }

    return NextResponse.json({
      success: true,
      systemPrompt,
      knowledgeScope,
      strictMode,
      defaultPrompt: DEFAULT_ADVISOR_PROMPT,
      defaultScope: DEFAULT_KNOWLEDGE_SCOPE,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Lưu kịch bản hoặc khôi phục mặc định
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, systemPrompt, knowledgeScope, strictMode, resetToDefault } = body;

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "Mã PIN quản trị không chính xác" }, { status: 401 });
    }

    let finalPrompt = systemPrompt;
    let finalScope = knowledgeScope;
    let finalStrict = strictMode !== undefined ? String(strictMode) : "true";

    if (resetToDefault) {
      finalPrompt = DEFAULT_ADVISOR_PROMPT;
      finalScope = DEFAULT_KNOWLEDGE_SCOPE;
      finalStrict = "true";
    }

    if (!finalPrompt || !finalPrompt.trim()) {
      return NextResponse.json({ error: "Kịch bản hệ thống không được để trống" }, { status: 400 });
    }

    const updates = [
      { key: "advisor_system_prompt", value: finalPrompt.trim(), updated_at: new Date().toISOString() },
      { key: "advisor_knowledge_scope", value: finalScope?.trim() || "", updated_at: new Date().toISOString() },
      { key: "advisor_strict_mode", value: finalStrict, updated_at: new Date().toISOString() },
    ];

    for (const item of updates) {
      const { error } = await supabaseAdmin
        .from("site_settings")
        .upsert(item, { onConflict: "key" });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: resetToDefault
        ? "Đã khôi phục kịch bản chuẩn dân gian khoanh vùng ma túy học đường!"
        : "Đã lưu kịch bản và phạm vi kiến thức thành công!",
      systemPrompt: finalPrompt,
      knowledgeScope: finalScope,
      strictMode: finalStrict === "true",
    });
  } catch (err: any) {
    console.error("Lỗi lưu kịch bản:", err);
    return NextResponse.json({ error: "Lỗi máy chủ khi lưu: " + err.message }, { status: 500 });
  }
}

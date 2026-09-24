import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_PIN = "lachanhocduong2026";
const CREDENTIAL_KEY = "advisor_api_keys";

// Hàm ẩn khóa (chỉ hiển thị 4 ký tự cuối)
function maskApiKey(key: string): string {
  if (!key || key.length < 6) return "••••••••••••";
  const lastFour = key.slice(-4);
  return `••••••••••••••••${lastFour}`;
}

// GET: Lấy danh sách khóa đã lưu dạng ẩn (Tuyệt đối không gửi raw key ra frontend)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-admin-pin");
    if (authHeader !== ADMIN_PIN) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("system_credentials")
      .select("key_values, updated_at")
      .eq("key_name", CREDENTIAL_KEY)
      .single();

    if (error || !data || !Array.isArray(data.key_values)) {
      return NextResponse.json({
        count: 0,
        maskedKeys: [],
        updatedAt: null,
      });
    }

    const rawKeys: string[] = data.key_values;
    const maskedKeys = rawKeys.map((k, index) => ({
      index,
      masked: maskApiKey(k),
      status: "active",
    }));

    return NextResponse.json({
      count: maskedKeys.length,
      maskedKeys,
      updatedAt: data.updated_at,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Thêm mới hoặc thay thế danh sách khóa
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, rawText, mode } = body; // mode: 'append' (thêm dồn) | 'replace' (thay thế hết)

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "Mã truy cập Admin không chính xác" }, { status: 401 });
    }

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return NextResponse.json({ error: "Vui lòng nhập ít nhất một khóa kết nối hợp lệ" }, { status: 400 });
    }

    // Tách khóa theo dòng mới (\n) hoặc dấu phẩy (,)
    const incomingKeys = rawText
      .split(/[\n,;]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 5);

    if (incomingKeys.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy khóa nào đủ độ dài hợp lệ" }, { status: 400 });
    }

    let finalKeys: string[] = [];

    if (mode === "append") {
      // Lấy danh sách khóa cũ
      const { data } = await supabaseAdmin
        .from("system_credentials")
        .select("key_values")
        .eq("key_name", CREDENTIAL_KEY)
        .single();

      const existingKeys: string[] = Array.isArray(data?.key_values) ? data.key_values : [];
      // Gộp và loại bỏ khóa trùng lặp
      finalKeys = Array.from(new Set([...existingKeys, ...incomingKeys]));
    } else {
      // Thay thế toàn bộ
      finalKeys = Array.from(new Set(incomingKeys));
    }

    // Lưu vào Supabase qua service_role (RLS chặn 100% truy vấn từ client anon)
    const { error: upsertError } = await supabaseAdmin
      .from("system_credentials")
      .upsert(
        {
          key_name: CREDENTIAL_KEY,
          key_values: finalKeys,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key_name" }
      );

    if (upsertError) throw upsertError;

    const maskedKeys = finalKeys.map((k, index) => ({
      index,
      masked: maskApiKey(k),
      status: "active",
    }));

    return NextResponse.json({
      success: true,
      count: finalKeys.length,
      addedCount: incomingKeys.length,
      maskedKeys,
    });
  } catch (err: any) {
    console.error("Lỗi lưu khóa bí mật:", err);
    return NextResponse.json({ error: "Lỗi máy chủ khi lưu khóa: " + err.message }, { status: 500 });
  }
}

// DELETE: Xóa một khóa cụ thể hoặc xóa toàn bộ
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, index, action } = body;

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "Không có quyền thao tác" }, { status: 401 });
    }

    if (action === "clear_all") {
      await supabaseAdmin
        .from("system_credentials")
        .delete()
        .eq("key_name", CREDENTIAL_KEY);

      return NextResponse.json({ success: true, count: 0, maskedKeys: [] });
    }

    // Xóa theo index
    const { data } = await supabaseAdmin
      .from("system_credentials")
      .select("key_values")
      .eq("key_name", CREDENTIAL_KEY)
      .single();

    if (!data || !Array.isArray(data.key_values)) {
      return NextResponse.json({ success: true, count: 0, maskedKeys: [] });
    }

    const existingKeys: string[] = data.key_values;
    if (typeof index === "number" && index >= 0 && index < existingKeys.length) {
      existingKeys.splice(index, 1);
    }

    await supabaseAdmin.from("system_credentials").upsert(
      {
        key_name: CREDENTIAL_KEY,
        key_values: existingKeys,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key_name" }
    );

    const maskedKeys = existingKeys.map((k, idx) => ({
      index: idx,
      masked: maskApiKey(k),
      status: "active",
    }));

    return NextResponse.json({
      success: true,
      count: existingKeys.length,
      maskedKeys,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

// POST: Gửi báo cáo tố giác ẩn danh từ học sinh / người dân
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location_text, description, evidence_image_url } = body;

    if (!location_text || !description) {
      return NextResponse.json(
        { error: "Vui lòng nhập địa điểm và mô tả sự việc!" },
        { status: 400 }
      );
    }

    // Dùng supabaseAdmin (Service Role) để đảm bảo không bị chặn bởi RLS
    const { data, error } = await supabaseAdmin
      .from("anonymous_reports")
      .insert([
        {
          location_text: location_text.trim(),
          description: description.trim(),
          evidence_image_url: evidence_image_url || null,
          status: "pending",
        },
      ])
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Lỗi insert anonymous_reports:", error);
      return NextResponse.json(
        { error: "Không thể lưu báo cáo: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Báo cáo đã được tiếp nhận an toàn và bảo mật 100%!",
      data,
    });
  } catch (err: any) {
    console.error("Lỗi API /api/reports:", err);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi tiếp nhận báo cáo: " + err.message },
      { status: 500 }
    );
  }
}

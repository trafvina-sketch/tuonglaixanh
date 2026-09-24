import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const ADMIN_PIN = "lachanhocduong2026";

function checkAdminAuth(req: NextRequest): boolean {
  const pinHeader = req.headers.get("x-admin-pin");
  return pinHeader === ADMIN_PIN;
}

// GET: Lấy toàn bộ danh sách báo cáo tố giác (Chỉ Admin có PIN mới đọc được)
export async function GET(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("anonymous_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi lấy danh sách tố giác:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      reports: data || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Cập nhật trạng thái xử lý báo cáo (pending, investigating, resolved, dismissed)
export async function PATCH(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Thiếu id hoặc trạng thái" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("anonymous_reports")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật trạng thái báo cáo thành công!",
      report: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Xóa vĩnh viễn báo cáo tố giác (báo cáo rác hoặc đã xử lý xong)
export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID báo cáo cần xóa" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("anonymous_reports")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa báo cáo tố giác thành công!",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

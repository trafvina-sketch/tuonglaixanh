import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkContentSafety } from "@/lib/contentGuardrails";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getAdminSupabase() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// Dữ liệu mẫu ban đầu phòng khi chưa có dữ liệu trong DB
const INITIAL_PLEDGES = [
  {
    id: "p1",
    name: "Nguyễn Minh Khang",
    school_class: "Lớp 9A2",
    message: "Em quyết tâm cùng cả lớp xây dựng chi đội văn minh, nói KHÔNG tuyệt đối với thuốc lá điện tử và ma túy!",
    tag: "Sống khỏe",
    likes: 42,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "p2",
    name: "Cô Thanh Trúc",
    school_class: "Giáo viên Tổng phụ trách",
    message: "Thầy cô luôn sẵn sàng lắng nghe, bảo vệ và đồng hành cùng các em trên mọi chặng đường học tập!",
    tag: "Đồng hành",
    likes: 89,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "p3",
    name: "Trần Tuấn Kiệt",
    school_class: "Lớp 8B",
    message: "Tụi em chọn rèn luyện thể thao, đá bóng mỗi chiều để có sức khỏe và tinh thần minh mẫn!",
    tag: "Tương lai",
    likes: 35,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "p4",
    name: "Lê Hoàng Yến",
    school_class: "Lớp 7C",
    message: "Dũng cảm từ chối khi bị rủ rê chính là bản lĩnh lớn nhất của học sinh chúng mình!",
    tag: "Bản lĩnh",
    likes: 56,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "p5",
    name: "Phạm Hải Đăng",
    school_class: "Lớp 9D",
    message: "Bảo vệ bản thân và tuyên truyền cho các em khóa dưới nhận biết bẫy ngụy trang tinh vi.",
    tag: "Bảo vệ",
    likes: 67,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
  }
];

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        pledges: INITIAL_PLEDGES,
        total_count: 1865 + INITIAL_PLEDGES.length,
      });
    }

    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "community_pledges")
      .single();

    let list = INITIAL_PLEDGES;
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      } catch (e) {
        console.error("Lỗi parse community_pledges:", e);
      }
    }

    return NextResponse.json({
      success: true,
      pledges: list,
      total_count: 1865 + list.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const supabase = getAdminSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Thiếu cấu hình kết nối CSDL" },
        { status: 500 }
      );
    }

    // 1. LẤY DANH SÁCH HIỆN TẠI
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "community_pledges")
      .single();

    let list = INITIAL_PLEDGES;
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed)) list = parsed;
      } catch (e) {
        console.error("Lỗi parse JSON:", e);
      }
    }

    // 2. XỬ LÝ HÀNH ĐỘNG LIKE
    if (action === "like") {
      const { pledge_id } = body;
      if (!pledge_id) {
        return NextResponse.json({ success: false, error: "Thiếu mã lời nhắn" }, { status: 400 });
      }

      list = list.map((item: any) => {
        if (item.id === pledge_id) {
          return { ...item, likes: (item.likes || 0) + 1 };
        }
        return item;
      });

      await supabase.from("site_settings").upsert({
        key: "community_pledges",
        value: JSON.stringify(list),
      }, { onConflict: "key" });

      return NextResponse.json({ success: true, message: "Đã thả tim thành công!" });
    }

    // 3. XỬ LÝ HÀNH ĐỘNG KÝ CAM KẾT / GỬI LỜI NHẮN
    if (action === "pledge") {
      const { name, school_class, message, tag } = body;

      if (!message || message.trim().length < 5) {
        return NextResponse.json(
          { success: false, error: "Lời nhắn cam kết cần dài tối thiểu 5 ký tự." },
          { status: 400 }
        );
      }

      // Kiểm tra lá chắn ngôn từ an toàn
      const fullTextToCheck = `${name || ""} ${school_class || ""} ${message}`;
      const safetyCheck = checkContentSafety(fullTextToCheck);
      if (!safetyCheck.isSafe) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Nội dung chứa từ ngữ không phù hợp với môi trường học đường. Vui lòng sử dụng ngôn từ tích cực và lịch sự." 
          },
          { status: 400 }
        );
      }

      const newPledge = {
        id: "p_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        name: (name && name.trim()) ? name.trim().slice(0, 50) : "Học sinh tích cực",
        school_class: (school_class && school_class.trim()) ? school_class.trim().slice(0, 50) : "Đại sứ Học đường",
        message: message.trim().slice(0, 300),
        tag: tag || "Cam kết",
        likes: 1,
        created_at: new Date().toISOString(),
      };

      // Đẩy lên đầu danh sách, tối đa lưu 100 lời nhắn mới nhất
      list = [newPledge, ...list].slice(0, 100);

      await supabase.from("site_settings").upsert({
        key: "community_pledges",
        value: JSON.stringify(list),
      }, { onConflict: "key" });

      return NextResponse.json({
        success: true,
        message: "Ký cam kết lan tỏa thành công!",
        pledge: newPledge,
        total_count: 1865 + list.length,
      });
    }

    return NextResponse.json({ success: false, error: "Hành động không hợp lệ" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

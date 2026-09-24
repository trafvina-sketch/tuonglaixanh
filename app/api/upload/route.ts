import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const folder = (formData.get("folder") as string) || "general";
    const customName = (formData.get("filename") as string) || `upload_${Date.now()}.webp`;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file để tải lên" }, { status: 400 });
    }

    // Đảm bảo bucket app-assets tồn tại
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === "app-assets");
    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket("app-assets", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
    }

    const cleanName = customName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${Date.now()}_${cleanName}`;

    // Chuyển Blob thành Buffer để upload ổn định qua Server Action
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from("app-assets")
      .upload(filePath, buffer, {
        contentType: file.type || "image/webp",
        cacheControl: "31536000",
        upsert: true,
      });

    if (error) {
      console.error("Supabase Admin Storage Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Lấy URL công khai
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("app-assets")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
    });
  } catch (err: any) {
    console.error("Upload API Error:", err.message);
    return NextResponse.json(
      { error: "Lỗi xử lý tải ảnh lên máy chủ: " + err.message },
      { status: 500 }
    );
  }
}

"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import WebpCanvasConverter from "@/components/WebpCanvasConverter";
import { ShieldAlert, AlertTriangle, Send, CheckCircle2, PhoneCall, Lock, ShieldCheck } from "lucide-react";

export default function ToGiacPage() {
  const [locationText, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationText.trim() || !description.trim()) {
      alert("Vui lòng nhập địa điểm và mô tả sự việc!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_text: locationText.trim(),
          description: description.trim(),
          evidence_image_url: evidenceUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể gửi báo cáo");
      }

      setIsSuccess(true);
      setLocationText("");
      setDescription("");
      setEvidenceUrl("");
    } catch (err: any) {
      console.error(err);
      alert("Lỗi khi gửi báo cáo: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      
      {/* HEADER HIỆN ĐẠI ĐỒNG BỘ VŨ TRỤ KẸO NGỌT */}
      <div className="bg-white border border-purple-100/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-bold text-purple-700">
            <ShieldAlert className="w-3.5 h-3.5 text-pink-500" />
            <span>Kênh tiếp nhận thông tin bảo mật 🪐✨</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-teal-500 bg-clip-text text-transparent tracking-tight uppercase">
            Hộp Thư Tố Giác Ẩn Danh
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Dũng cảm phản ánh những hành vi dụ dỗ, buôn bán ma túy học đường để bảo vệ bản thân và bè bạn. Mọi thông tin được mã hóa an toàn.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-pink-50 border border-pink-200 rounded-2xl px-4 py-2.5 text-xs text-pink-700 font-bold shrink-0">
          <Lock className="w-4 h-4 text-pink-600" />
          <span>BẢO MẬT 100% ẨN DANH</span>
        </div>
      </div>

      {/* CAM KẾT BẢO MẬT & ĐƯỜNG DÂY NÓNG */}
      <div className="bg-gradient-to-r from-purple-50/70 via-pink-50/30 to-teal-50/70 border border-purple-100 rounded-2xl p-4 sm:p-5 text-xs text-slate-700 space-y-3 shadow-2xs">
        <p className="font-extrabold text-purple-950 flex items-center gap-1.5 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          CAM KẾT BẢO VỆ DANH TÍNH HỌC SINH TỪ BAN GIÁM HIỆU:
        </p>
        <p className="leading-relaxed text-slate-600">
          Hệ thống <strong>hoàn toàn không lưu địa chỉ IP, không yêu cầu họ tên hay số điện thoại</strong> của các em. Báo cáo sẽ được chuyển thẳng đến Ban Giám Hiệu và lực lượng chức năng để xác minh và xử lý kín đáo.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-3 font-semibold border-t border-purple-100 text-xs">
          <span className="text-slate-500">Khẩn cấp gọi ngay:</span>
          <a href="tel:111" className="text-pink-600 hover:text-purple-700 hover:underline flex items-center gap-1 font-bold">
            <PhoneCall className="w-3.5 h-3.5" /> Tổng đài 111 (Trẻ em)
          </a>
          <span>•</span>
          <a href="tel:113" className="text-pink-600 hover:text-purple-700 hover:underline flex items-center gap-1 font-bold">
            <PhoneCall className="w-3.5 h-3.5" /> Cảnh sát 113
          </a>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-white border border-teal-200 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-teal-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-extrabold text-xl sm:text-2xl text-slate-900">
            Báo cáo đã được tiếp nhận an toàn!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Cảm ơn tinh thần trách nhiệm và quả cảm của em! Thầy cô và lực lượng chức năng sẽ lập tức xác minh để giữ vững môi trường học đường lành mạnh, an toàn.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm shadow-purple-600/20 transition-all cursor-pointer"
          >
            Gửi báo cáo khác
          </button>
        </div>
      ) : (
        /* FORM TỐ GIÁC HIỆN ĐẠI */
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-purple-100/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
        >
          {/* ĐỊA ĐIỂM */}
          <div>
            <label className="block text-xs font-extrabold text-purple-950 mb-1.5">
              1. Địa điểm nghi vấn phát hiện sự việc: <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              required
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="Ví dụ: Cổng sau trường, Quán trà sữa góc ngã tư, Khu vực nhà vệ sinh tầng 2..."
              className="w-full bg-purple-50/20 border border-purple-200/80 rounded-2xl p-3.5 text-xs sm:text-sm focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/10 transition-all placeholder-slate-400 outline-none"
            />
          </div>

          {/* MÔ TẢ CHI TIẾT */}
          <div>
            <label className="block text-xs font-extrabold text-purple-950 mb-1.5">
              2. Mô tả cụ thể sự việc hoặc đối tượng nghi vấn: <span className="text-pink-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Có người lạ mặt mời học sinh thử pod màu hồng, hoặc một nhóm bạn đang rủ rê uống gói bột nước xoài lạ..."
              className="w-full bg-purple-50/20 border border-purple-200/80 rounded-2xl p-3.5 text-xs sm:text-sm focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/10 transition-all placeholder-slate-400 outline-none"
            />
          </div>

          {/* TẢI ẢNH BẰNG CHỨNG (NÉN WEBP TỰ ĐỘNG) */}
          <div>
            <label className="block text-xs font-extrabold text-purple-950 mb-1.5">
              3. Tải ảnh bằng chứng (nếu có - Tự động nén WebP siêu nhẹ):
            </label>
            <WebpCanvasConverter
              folderPath="evidence"
              label="Chọn ảnh chụp bằng chứng từ thiết bị (Không bắt buộc)"
              onUploadSuccess={(url) => {
                setEvidenceUrl(url);
                alert("Đã nén và gắn ảnh WebP thành công!");
              }}
            />
            {evidenceUrl && (
              <p className="text-[11px] font-bold text-teal-700 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Đã đính kèm ảnh bằng chứng an toàn.</span>
              </p>
            )}
          </div>

          {/* NÚT GỬI */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-extrabold py-4 px-6 rounded-2xl text-xs sm:text-sm shadow-md shadow-pink-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Đang gửi báo cáo bảo mật..." : "Gửi Báo Cáo Ẩn Danh Ngay"}</span>
          </button>
        </form>
      )}

    </div>
  );
}

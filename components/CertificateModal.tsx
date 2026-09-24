"use client";

import React, { useState, useRef } from "react";
import { Award, Download, Share2, Sparkles, X, CheckCircle2, ShieldCheck } from "lucide-react";

interface CertificateModalProps {
  score: number;
  total: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({
  score,
  total,
  isOpen,
  onClose,
}: CertificateModalProps) {
  const [studentName, setStudentName] = useState("Nguyễn Văn Bản Lĩnh");
  const [schoolClass, setSchoolClass] = useState("Lớp 8A - Trường THCS Nguyễn Hồng Ánh");
  const [isDownloading, setIsDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Xếp loại danh hiệu học đường
  let titleRank = "Đại Sứ Xuất Sắc";
  let honorSubtitle = "Thủ Khoa Đấu Trí - Toàn Thắng Cả 5 Ải Tình Huống";
  let badgeColor = "bg-amber-100 text-amber-900 border-amber-300";

  if (score < 3) {
    titleRank = "Tuyên Truyền Viên Tập Sự";
    honorSubtitle = "Đã Nắm Được Kỹ Năng Thoát Hiểm Cơ Bản";
    badgeColor = "bg-sky-100 text-sky-900 border-sky-300";
  } else if (score < 5) {
    titleRank = "Dũng Sĩ Lá Chắn";
    honorSubtitle = "Bản Lĩnh Vững Vàng - Xử Trí Tình Huống Xuất Sắc";
    badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-300";
  }

  // Tạo ảnh PNG bằng HTML5 Canvas để tải về
  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 840;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // 1. Nền sáng sang trọng
      ctx.fillStyle = "#FFFDF9";
      ctx.fillRect(0, 0, 1200, 840);

      // 2. Khung viền đôi hiện đại
      ctx.strokeStyle = "#1E3A8A";
      ctx.lineWidth = 6;
      ctx.strokeRect(35, 35, 1130, 770);

      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(48, 48, 1104, 744);

      // 3. Tiêu đề Bằng Khen & Quốc hiệu
      ctx.textAlign = "center";
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 600, 95);
      ctx.font = "15px sans-serif";
      ctx.fillText("Độc lập - Tự do - Hạnh phúc", 600, 122);
      ctx.fillText("-------------------- ❖ --------------------", 600, 142);

      ctx.fillStyle = "#DC2626";
      ctx.font = "900 44px sans-serif";
      ctx.fillText("GIẤY CHỨNG NHẬN", 600, 220);

      ctx.fillStyle = "#0284C7";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("ĐẠI SỨ TUYÊN TRUYỀN PHÒNG CHỐNG MA TÚY HỌC ĐƯỜNG", 600, 268);

      // 4. Nội dung trao tặng
      ctx.fillStyle = "#475569";
      ctx.font = "italic 20px sans-serif";
      ctx.fillText("Chứng nhận Bạn học sinh bản lĩnh & thông thái:", 600, 335);

      ctx.fillStyle = "#1E3A8A";
      ctx.font = "bold 40px sans-serif";
      ctx.fillText(studentName.toUpperCase(), 600, 395);

      ctx.fillStyle = "#64748B";
      ctx.font = "20px sans-serif";
      ctx.fillText(schoolClass, 600, 435);

      ctx.fillStyle = "#1E293B";
      ctx.font = "20px sans-serif";
      ctx.fillText(
        `Đã hoàn thành xuất sắc Thử Thách Đấu Trí Phòng Chống Ma Túy Học Đường`,
        600,
        500
      );
      ctx.fillText(
        `Đạt kết quả: ${score}/${total} Điểm - Danh hiệu: 【 ${titleRank.toUpperCase()} 】`,
        600,
        540
      );

      ctx.font = "italic 18px sans-serif";
      ctx.fillStyle = "#D97706";
      ctx.fillText(`"${honorSubtitle}"`, 600, 580);

      // 5. Ngày tháng & Chữ ký
      const today = new Date();
      const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
      ctx.textAlign = "right";
      ctx.fillStyle = "#475569";
      ctx.font = "italic 17px sans-serif";
      ctx.fillText(dateStr, 1050, 650);
      ctx.font = "bold 19px sans-serif";
      ctx.fillStyle = "#1E3A8A";
      ctx.fillText("BAN CHỈ ĐẠO HỌC ĐƯỜNG AN TOÀN", 1080, 685);

      // Con dấu chứng nhận
      ctx.strokeStyle = "#DC2626";
      ctx.lineWidth = 3;
      ctx.strokeRect(880, 705, 200, 70);
      ctx.fillStyle = "rgba(220, 38, 38, 0.06)";
      ctx.fillRect(880, 705, 200, 70);

      ctx.textAlign = "center";
      ctx.fillStyle = "#DC2626";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("LÁ CHẮN HỌC ĐƯỜNG", 980, 735);
      ctx.fillText("ĐẠT CHUẨN XÁC THỰC", 980, 755);

      // Tải ảnh PNG
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Chung_Nhan_Dai_Su_${studentName.replace(/\s+/g, "_")}.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error("Lỗi xuất bằng khen:", err);
      alert("Không thể tải ảnh, em hãy chụp màn hình lại nhé!");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TIÊU ĐỀ POPUP */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>VINH DANH ĐẠI SỨ HỌC ĐƯỜNG</span>
          </div>
          <h3 className="font-extrabold text-2xl sm:text-3xl text-[#1e3a8a] uppercase tracking-tight">
            Giấy Chứng Nhận Tuyên Truyền Viên
          </h3>
          <p className="text-xs text-slate-500">
            Chứng nhận bản lĩnh tự vệ và kỹ năng phòng chống ma túy học đường
          </p>
        </div>

        {/* KHUNG GIẤY CHỨNG NHẬN MÔ PHỎNG HIỆN ĐẠI */}
        <div
          ref={certRef}
          className="relative bg-gradient-to-br from-amber-50/40 via-white to-sky-50/40 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 text-center space-y-4 shadow-sm"
        >
          <div className="border border-amber-200/70 rounded-xl p-4 sm:p-5 space-y-3 relative overflow-hidden bg-white/70 backdrop-blur-xs">
            
            <div className="space-y-3">
              <span className={`text-xs px-3.5 py-1 rounded-full font-extrabold uppercase inline-block border ${badgeColor}`}>
                {titleRank} (Đạt {score}/{total} Ải)
              </span>

              <p className="text-xs text-slate-500 italic">Trân trọng tuyên dương học sinh bản lĩnh:</p>

              {/* TÊN HỌC SINH CÓ THỂ CHỈNH SỬA ĐỂ TẢI BẰNG */}
              <div className="max-w-md mx-auto space-y-1.5">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Nhập họ và tên của em..."
                  className="w-full text-center font-black text-xl sm:text-2xl text-[#1e3a8a] bg-white border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-2xs"
                />
                <input
                  type="text"
                  value={schoolClass}
                  onChange={(e) => setSchoolClass(e.target.value)}
                  placeholder="Nhập Lớp & Trường..."
                  className="w-full text-center text-xs text-slate-600 bg-transparent border-b border-slate-200 py-1 focus:outline-none"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                Đã rèn luyện trí tuệ, nắm vững các kỹ năng nhận diện và xuất sắc vượt qua các cạm bẫy ma túy ngụy trang chốn học đường.
              </p>

              {/* XÁC THỰC VÀ NGÀY THÁNG */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
                <div className="text-left flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1e3a8a] to-[#0284c7] text-white flex items-center justify-center shadow-xs shrink-0">
                    <ShieldCheck className="w-4 h-4 text-sky-200" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1e3a8a]">LÁ CHẮN HỌC ĐƯỜNG</p>
                    <p className="text-[10px] text-slate-400">Trường Học Không Ma Túy</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>XÁC THỰC HOÀN THÀNH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NÚT THAO TÁC (TẢI ẢNH VỀ MÁY & CHIA SẺ) */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Đang xuất chứng nhận PNG..." : "Tải Giấy Chứng Nhận PNG Về Máy"}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Tớ vừa đạt Giấy Chứng Nhận Đại Sứ Học Đường!",
                  text: `Tớ vừa xuất sắc vượt ải Thử Thách Phòng Chống Ma Túy đạt ${score}/${total} điểm! Cậu vào thử sức ngay nhé!`,
                  url: window.location.origin + "/khao-thi",
                });
              } else {
                navigator.clipboard.writeText(window.location.origin + "/khao-thi");
                alert("Đã sao chép liên kết Thử Thách! Hãy dán vào Zalo/Facebook gửi bạn bè cùng thi nhé!");
              }
            }}
            className="w-full bg-sky-50 hover:bg-sky-100/80 text-[#0284c7] font-bold py-3 px-6 rounded-2xl text-xs border border-sky-200/80 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia Sẻ Link Thách Đấu Cho Bạn Bè</span>
          </button>
        </div>

      </div>
    </div>
  );
}

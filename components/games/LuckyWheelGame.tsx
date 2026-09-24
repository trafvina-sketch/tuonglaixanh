"use client";

import React, { useState } from "react";
import { Sparkles, Trophy, RotateCcw, Award, Gift } from "lucide-react";
import { playTone } from "./gameAudio";

interface WheelSlice {
  label: string;
  points: number;
  color: string;
  advice: string;
}

const SLICES: WheelSlice[] = [
  {
    label: "+50 Điểm",
    points: 50,
    color: "#0284c7", // Xanh dương
    advice: "Chúc mừng! Bạn nhận được 50 Điểm Danh Dự vì tinh thần học đường tích cực!",
  },
  {
    label: "Hộp Quà",
    points: 30,
    color: "#f59e0b", // Hổ phách
    advice: "Món quà bí mật: Luôn mang theo kỹ năng từ chối 'Quy tắc 3 KHÔNG' bên mình!",
  },
  {
    label: "+40 Điểm",
    points: 40,
    color: "#10b981", // Xanh lá
    advice: "Tuyệt vời! Hãy chia sẻ trang web cho 1 người bạn để cùng được bảo vệ nhé!",
  },
  {
    label: "Lời Khuyên",
    points: 25,
    color: "#8b5cf6", // Tím
    advice: "Lời khuyên vàng: Không bao giờ uống nước lạ khi rời khỏi tầm mắt ở các buổi tiệc!",
  },
  {
    label: "+60 Điểm",
    points: 60,
    color: "#ef4444", // Đỏ
    advice: "Xuất sắc! Bạn được vinh danh là Đại Sứ Tuyên Truyền Khóa Này (+60đ)!",
  },
  {
    label: "Bản Lĩnh",
    points: 35,
    color: "#06b6d4", // Cyan
    advice: "Bản lĩnh thật sự: Từ chối cám dỗ chính là sự dũng cảm của người làm chủ tương lai!",
  },
  {
    label: "+45 Điểm",
    points: 45,
    color: "#ec4899", // Hồng
    advice: "Ghi nhớ: Tổng đài 111 và 113 luôn sẵn sàng hỗ trợ bạn bí mật 24/7!",
  },
  {
    label: "Khiên Thép",
    points: 30,
    color: "#f97316", // Cam
    advice: "Trang bị khiên tự vệ: Tránh xa các đối tượng khả nghi lảng vảng quanh cổng trường!",
  },
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function LuckyWheelGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSlice | null>(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    playTone("spin", soundEnabled);

    // Chọn ngẫu nhiên 1 ô
    const sliceCount = SLICES.length;
    const chosenIndex = Math.floor(Math.random() * sliceCount);
    const sliceAngle = 360 / sliceCount;

    // Quay ít nhất 5 vòng (1800 độ) + góc của ô được chọn
    const additionalSpins = 5 * 360;
    const targetAngle = additionalSpins + (360 - chosenIndex * sliceAngle - sliceAngle / 2);
    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const chosenSlice = SLICES[chosenIndex];
      setResult(chosenSlice);
      onAddScore(chosenSlice.points);
      playTone("win", soundEnabled);
    }, 3600);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>🎡 Vòng Quay Bản Lĩnh: Vận May Học Đường</span>
          </h2>
          <p className="text-xs text-slate-500">
            Quay vòng quay may mắn để tích lũy Điểm Danh Dự và mở khóa những lời khuyên tự vệ vô giá!
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 shrink-0">
          <span className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200">
            ✨ Mỗi lượt quay đều có quà
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        
        {/* VÒNG QUAY BẢN LĨNH SVG HIỆN ĐẠI */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center select-none">
          
          {/* KIM CHỈ VÒNG QUAY Ở TRÊN ĐỈNH */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-rose-600 filter drop-shadow-md" />

          {/* VÒNG TRÒN XOAY */}
          <div
            className="w-full h-full rounded-full border-4 border-slate-800 shadow-xl overflow-hidden relative transition-transform duration-[3500ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SLICES.map((slice, idx) => {
              const rotateDeg = idx * (360 / SLICES.length);
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-start justify-center pt-3 text-white font-extrabold text-[11px] sm:text-xs"
                  style={{
                    transform: `rotate(${rotateDeg}deg)`,
                    transformOrigin: "50% 50%",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 bottom-0"
                    style={{
                      clipPath: "polygon(50% 50%, 30% 0%, 70% 0%)",
                      backgroundColor: slice.color,
                    }}
                  />
                  <span
                    className="relative z-10 pt-2 drop-shadow-sm font-black"
                    style={{ transform: "rotate(0deg)" }}
                  >
                    {slice.label}
                  </span>
                </div>
              );
            })}

            {/* TRỤC TÂM VÒNG QUAY */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white border-4 border-slate-800 shadow-md flex items-center justify-center z-10">
              <span className="text-lg">⭐</span>
            </div>
          </div>
        </div>

        {/* NÚT BẤM QUAY */}
        <button
          type="button"
          onClick={spinWheel}
          disabled={spinning}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
        >
          {spinning ? "ĐANG XOAY BẢN LĨNH..." : "QUAY NGAY BÂY GIỜ!"}
        </button>

        {/* HIỂN THỊ KẾT QUẢ KHI QUAY XONG */}
        {result && (
          <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border-2 border-amber-300 rounded-3xl p-5 text-center space-y-2 max-w-md mx-auto animate-in zoom-in-95 duration-200">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-200 text-amber-900 inline-block">
              🎉 Bạn Đã Trúng: {result.label}
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              {result.advice}
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onNextGame}
                className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Chơi Game Tiếp Theo &rarr;
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

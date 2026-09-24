"use client";

import React, { useState } from "react";
import { Trash2, Backpack, Trophy, Check, X, RotateCcw } from "lucide-react";
import { playTone } from "./gameAudio";

interface SortItem {
  id: number;
  name: string;
  icon: string;
  category: "trash" | "backpack";
  detail: string;
}

const SORT_ITEMS: SortItem[] = [
  {
    id: 1,
    name: "Cây Bút Pod Chill Ngụy Trang",
    icon: "🖍️",
    category: "trash",
    detail: "Độc chất ma túy cần sa tổng hợp nguy hiểm, phải tiêu hủy và báo cáo thầy cô!",
  },
  {
    id: 2,
    name: "Sách Giáo Khoa & Bài Vở",
    icon: "📚",
    category: "backpack",
    detail: "Hành trang tri thức quý giá giúp học sinh vững bước tương lai.",
  },
  {
    id: 3,
    name: "Gói Bột Nước Vui Sủi Bọt",
    icon: "🧪",
    category: "trash",
    detail: "Ma túy pha trộn ketamine và thuốc lắc, đe dọa trực tiếp tính mạng!",
  },
  {
    id: 4,
    name: "Hộp Bút Màu Học Tập",
    icon: "🎨",
    category: "backpack",
    detail: "Dụng cụ rèn luyện tài năng hội họa và sáng tạo học đường.",
  },
  {
    id: 5,
    name: "Bánh Cần Sa (Space Cake)",
    icon: "🍪",
    category: "trash",
    detail: "Bánh tẩm chất gây nghiện, gây ngộ độc hôn mê sâu!",
  },
  {
    id: 6,
    name: "Trái Bóng Rổ Thể Thao",
    icon: "🏀",
    category: "backpack",
    detail: "Rèn luyện sức khỏe dẻo dai, xây dựng tinh thần đồng đội.",
  },
  {
    id: 7,
    name: "Tem Giấy Bùa Lưỡi LSD",
    icon: "👅",
    category: "trash",
    detail: "Ảo giác cực mạnh, phá hủy hoàn toàn hệ thần kinh trung ương!",
  },
  {
    id: 8,
    name: "Bình Nước Cá Nhân Sạch",
    icon: "🍶",
    category: "backpack",
    detail: "Uống nước đủ mỗi ngày để cơ thể luôn tràn đầy sinh lực.",
  },
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function SortingGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentItem = SORT_ITEMS[currentIndex];

  const handleSort = (chosenCategory: "trash" | "backpack") => {
    if (completed) return;

    const isCorrect = chosenCategory === currentItem.category;

    if (isCorrect) {
      playTone("success", soundEnabled);
      setScore((s) => s + 15);
      onAddScore(15);
      setLastFeedback({
        isCorrect: true,
        text: `Chuẩn xác! ${currentItem.detail}`,
      });
    } else {
      playTone("fail", soundEnabled);
      setScore((s) => Math.max(0, s - 10));
      setLastFeedback({
        isCorrect: false,
        text: `Sai rồi! ${currentItem.detail}`,
      });
    }

    if (currentIndex + 1 < SORT_ITEMS.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
      playTone("win", soundEnabled);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setLastFeedback(null);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>🧹 Chiến Dịch Phân Loại: Dọn Sạch Học Đường</span>
          </h2>
          <p className="text-xs text-slate-500">
            Xem xét đồ vật: Cho đồ dùng an toàn vào Balo học sinh hoặc gửi ma túy vào Thùng tiêu hủy độc hại!
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold shrink-0">
          <div className="bg-slate-100 px-3 py-1.5 rounded-full">
            Tiến độ: <b className="text-[#0284c7]">{currentIndex + 1} / {SORT_ITEMS.length}</b>
          </div>
          <div className="bg-sky-50 text-[#0284c7] border border-sky-200 px-3.5 py-1.5 rounded-full">
            Điểm: <b className="text-sm font-black">{score}</b>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6 max-w-xl mx-auto text-center py-2">
          
          {/* MÓN ĐỒ CẦN PHÂN LOẠI */}
          <div className="bg-gradient-to-br from-slate-50 to-sky-50 border-2 border-sky-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-2 animate-in zoom-in-95 duration-200">
            <span className="text-5xl sm:text-6xl block animate-bounce" style={{ animationDuration: "1s" }}>
              {currentItem.icon}
            </span>
            <h3 className="font-black text-base sm:text-lg text-slate-800">
              {currentItem.name}
            </h3>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Món đồ này thuộc về đâu?
            </span>
          </div>

          {/* 2 NÚT HÀNH ĐỘNG PHÂN LOẠI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <button
              type="button"
              onClick={() => handleSort("backpack")}
              className="py-4 px-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-black text-xs sm:text-sm shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 group"
            >
              <Backpack className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>🎒 CHO VÀO BALO HỌC ĐƯỜNG</span>
            </button>

            <button
              type="button"
              onClick={() => handleSort("trash")}
              className="py-4 px-5 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-800 font-black text-xs sm:text-sm shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 group"
            >
              <Trash2 className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
              <span>🗑️ THÙNG TIÊU HỦY ĐỘC HẠI</span>
            </button>

          </div>

          {lastFeedback && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed animate-in fade-in duration-150 ${
              lastFeedback.isCorrect
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}>
              {lastFeedback.text}
            </div>
          )}

        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">
            Hoàn Thành Chiến Dịch Phân Loại!
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Bạn đã xuất sắc làm sạch môi trường học đường với điểm số: <b>{score} Điểm</b>! Đạt danh hiệu: <b>Chuyên Gia Bảo Vệ Học Đường</b>!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetGame}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Chơi Lại Từ Đầu
            </button>
            <button
              type="button"
              onClick={onNextGame}
              className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Quay Về Game 1 &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

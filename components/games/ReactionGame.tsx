"use client";

import React, { useState, useEffect, useRef } from "react";
import { Flame, Trophy } from "lucide-react";
import { playTone } from "./gameAudio";

interface TargetItem {
  id: number;
  type: "good" | "bad";
  name: string;
  icon: string;
  points: number;
  tip: string;
}

const REACTION_ITEMS: TargetItem[] = [
  { id: 1, type: "good", name: "Sách Tri Thức", icon: "📚", points: 10, tip: "Học tập để làm chủ tương lai!" },
  { id: 2, type: "good", name: "Bóng Thể Thao", icon: "⚽", points: 10, tip: "Rèn luyện thể lực, sảng khoái tinh thần!" },
  { id: 3, type: "good", name: "Cây Xanh Lớp Học", icon: "🌿", points: 10, tip: "Bảo vệ môi trường học đường xanh sạch!" },
  { id: 4, type: "good", name: "Điểm 10 Chăm Ngoan", icon: "💯", points: 15, tip: "Thành tích vẻ vang báo hiếu cha mẹ!" },
  { id: 5, type: "good", name: "Đường Dây Nóng 111", icon: "📞", points: 15, tip: "Kênh cứu trợ học đường bảo mật 24/7!" },

  { id: 6, type: "bad", name: "Pod Chill Cây Bút", icon: "🚬", points: -20, tip: "Cạm bẫy phá hủy phổi và não bộ!" },
  { id: 7, type: "bad", name: "Nước Vui Chali", icon: "🧪", points: -20, tip: "Độc dược gây trụy tim tử vong!" },
  { id: 8, type: "bad", name: "Viên Thuốc Lắc", icon: "💊", points: -20, tip: "Ma túy tàn phá hệ thần kinh trung ương!" },
  { id: 9, type: "bad", name: "Lời Rủ Rê Độc Hại", icon: "🚷", points: -20, tip: "Dứt khoát từ chối kẻo hối không kịp!" },
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function ReactionGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [slots, setSlots] = useState<(TargetItem | null)[]>([null, null, null, null, null, null]);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setGameOver(false);
    setPlaying(true);
    setSlots([null, null, null, null, null, null]);
    playTone("click", soundEnabled);
  };

  useEffect(() => {
    if (playing && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setPlaying(false);
            setGameOver(true);
            playTone("win", soundEnabled);
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      spawnRef.current = setInterval(() => {
        const randomSlotIndex = Math.floor(Math.random() * 6);
        const randomItem = REACTION_ITEMS[Math.floor(Math.random() * REACTION_ITEMS.length)];
        setSlots((prev) => {
          const next = [...prev];
          next[randomSlotIndex] = randomItem;
          return next;
        });

        setTimeout(() => {
          setSlots((prev) => {
            const next = [...prev];
            if (next[randomSlotIndex] === randomItem) {
              next[randomSlotIndex] = null;
            }
            return next;
          });
        }, 1200);
      }, 700);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
      };
    }
  }, [playing, timeLeft]);

  const handleSlotClick = (slotIdx: number) => {
    const item = slots[slotIdx];
    if (!item || !playing) return;

    if (item.type === "good") {
      playTone("success", soundEnabled);
      setScore((s) => s + item.points);
      onAddScore(item.points);
    } else {
      playTone("fail", soundEnabled);
      setScore((s) => Math.max(0, s + item.points));
    }

    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>⚡ Vệ Binh Phản Xạ: Bắt Đồ Tốt - Né Bẫy Xấu</span>
          </h2>
          <p className="text-xs text-slate-500">
            Thử thách 45 giây: Chạm nhanh vào vật phẩm TỐT (+10đ). Tuyệt đối KHÔNG chạm vào CẠM BẪY XẤU (-20đ)!
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold shrink-0">
          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Thời gian: <b className="text-sm">{timeLeft}s</b></span>
          </div>
          <div className="bg-sky-50 text-[#0284c7] border border-sky-200 px-3.5 py-1.5 rounded-full">
            <span>Điểm ván: <b className="text-sm font-black">{score}</b></span>
          </div>
        </div>
      </div>

      {!playing && !gameOver && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-4">
          <div className="text-4xl">🎮</div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-black text-sm text-[#1e3a8a] uppercase">Sẵn Sàng Thử Thách Phản Xạ?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Các vật phẩm sẽ xuất hiện chớp nhoáng trên 6 ô. Bạn có 45 giây để tích lũy thật nhiều điểm số!
            </p>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm shadow-md shadow-amber-500/30 transition-all cursor-pointer active:scale-95"
          >
            BẮT ĐẦU CHƠI NGAY
          </button>
        </div>
      )}

      {playing && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 min-h-[260px]">
          {slots.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`h-28 rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-2 select-none relative ${
                item
                  ? item.type === "good"
                    ? "bg-emerald-50 border-emerald-300 shadow-md cursor-pointer hover:scale-105 active:scale-95 animate-in zoom-in-50 duration-150"
                    : "bg-rose-50 border-rose-300 shadow-md cursor-pointer hover:scale-105 active:scale-95 animate-in zoom-in-50 duration-150"
                  : "bg-slate-50/60 border-slate-200/60"
              }`}
            >
              {item ? (
                <div className="text-center space-y-1">
                  <span className="text-3xl sm:text-4xl block animate-bounce" style={{ animationDuration: "0.8s" }}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-black text-slate-800 block truncate max-w-[120px]">
                    {item.name}
                  </span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    item.type === "good" ? "bg-emerald-200 text-emerald-900" : "bg-rose-200 text-rose-900"
                  }`}>
                    {item.type === "good" ? "+10đ" : "-20đ Né đi!"}
                  </span>
                </div>
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300/40" />
              )}
            </div>
          ))}
        </div>
      )}

      {gameOver && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8 text-amber-100" />
          </div>
          <h3 className="text-lg font-black text-[#78350f] uppercase tracking-tight">
            Hết Giờ! Tổng Điểm Của Bạn: {score} Điểm
          </h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            {score >= 180
              ? "Đỉnh cao phản xạ! Bạn sở hữu đôi mắt đại bàng và phản xạ thép của một Vệ Binh Tinh Nhuệ! 🥇"
              : score >= 100
              ? "Rất khá! Khả năng né cạm bẫy của bạn đạt chuẩn Vệ Binh Dũng Cảm! 🥈"
              : "Cần chú ý hơn một chút nhé! Hãy tập trung chọn đúng vật phẩm có ích và né xa ma túy ngụy trang! 🥉"}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={startGame}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Chơi Lại Để Nâng Điểm
            </button>
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
  );
}

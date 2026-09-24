"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Check, Trophy } from "lucide-react";
import { playTone } from "./gameAudio";

interface CardItem {
  id: number;
  pairId: number;
  type: "safe" | "danger";
  title: string;
  icon: string;
  desc: string;
  warningTip: string;
}

const MEMORY_CARDS_SOURCE: Omit<CardItem, "id">[] = [
  {
    pairId: 1,
    type: "safe",
    title: "Bút Dạ Quang Thường",
    icon: "🖊️",
    desc: "Dụng cụ học tập đánh dấu bài vở, mực không mùi độc hại.",
    warningTip: "Đồ dùng học tập an toàn có xuất xứ rõ ràng.",
  },
  {
    pairId: 1,
    type: "danger",
    title: "Pod Chill Dạng Cây Bút",
    icon: "🖍️",
    desc: "Ngụy trang hình cây bút, có cổng sạc USB ở đuôi và tinh dầu độc.",
    warningTip: "Bẫy ngụy trang: Chứa tinh dầu cần sa tổng hợp gây ảo giác và suy tim!",
  },
  {
    pairId: 2,
    type: "safe",
    title: "Kẹo Dẻo Trái Cây",
    icon: "🍬",
    desc: "Bánh kẹo ăn vặt thông thường, bao bì có nhãn tiếng Việt rõ ràng.",
    warningTip: "Được kiểm định chất lượng vệ sinh thực phẩm.",
  },
  {
    pairId: 2,
    type: "danger",
    title: "Kẹo Gummy Cần Sa",
    icon: "🐻",
    desc: "In chữ THC/CBD, hình lá cần sa nhỏ, vị đắng ngọt lạ lùng.",
    warningTip: "Bẫy ngụy trang: Tẩm chất kích thích ma túy, gây co giật và loạn thần!",
  },
  {
    pairId: 3,
    type: "safe",
    title: "Trà Sữa Nhà Làm",
    icon: "🧋",
    desc: "Thức uống quen thuộc từ sữa, trà và trân châu lành mạnh.",
    warningTip: "Uống lượng vừa phải để giữ gìn sức khỏe.",
  },
  {
    pairId: 3,
    type: "danger",
    title: "Nước Vui / Nước Xoài",
    icon: "🧪",
    desc: "Gói bột pha nước màu mè (Chali), hòa vào nước sẽ sủi bọt ngây ngất.",
    warningTip: "Bẫy ngụy trang: Trộn ketamine, thuốc lắc, gây trụy tim sau vài phút!",
  },
  {
    pairId: 4,
    type: "safe",
    title: "Tem Nhãn Vở Hoạt Hình",
    icon: "🏷️",
    desc: "Giấy dán tên học sinh, lớp học thông thường bằng decal giấy.",
    warningTip: "Chỉ để dán bìa sách vở, không có hóa chất độc hại.",
  },
  {
    pairId: 4,
    type: "danger",
    title: "Tem Giấy Bùa Lưỡi (LSD)",
    icon: "👅",
    desc: "Miếng giấy nhỏ tẩm chất gây ảo giác cực mạnh LSD, ngậm vào lưỡi.",
    warningTip: "Bẫy ngụy trang: Gây hoang tưởng nặng nề, ảo giác nhảy lầu hoặc tự hại!",
  },
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function MemoryGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const initGame = () => {
    const fullList: CardItem[] = MEMORY_CARDS_SOURCE.map((item, idx) => ({
      ...item,
      id: idx,
    }));
    const shuffled = [...fullList].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setMoves(0);
    setCompleted(false);
    setActiveTip(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    const clickedCard = cards[index];
    if (matchedPairIds.includes(clickedCard.pairId)) return;

    playTone("click", soundEnabled);
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const first = cards[newFlipped[0]];
      const second = cards[newFlipped[1]];

      if (first.pairId === second.pairId) {
        playTone("success", soundEnabled);
        setMatchedPairIds((prev) => [...prev, first.pairId]);
        onAddScore(20);
        setActiveTip(
          `🔍 PHÁT HIỆN: Cặp đôi '${first.title}' và '${second.title}'! ` +
            (first.type === "danger" ? first.warningTip : second.warningTip)
        );
        setFlippedIndices([]);

        if (matchedPairIds.length + 1 === MEMORY_CARDS_SOURCE.length / 2) {
          setCompleted(true);
          onAddScore(50);
          playTone("win", soundEnabled);
        }
      } else {
        playTone("fail", soundEnabled);
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>🕵️ Thám Tử Học Đường: Vạch Trần Ngụy Trang</span>
          </h2>
          <p className="text-xs text-slate-500">
            Lật mở các cặp thẻ đối chứng giữa đồ vật học đường an toàn và bẫy ma túy ngụy trang tương ứng!
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-600 shrink-0">
          <div className="bg-slate-100 px-3 py-1.5 rounded-full">
            Số lượt lật: <b className="text-[#0284c7]">{moves}</b>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
            Giải mã: <b className="font-black">{matchedPairIds.length}/4</b>
          </div>
          <button
            type="button"
            onClick={initGame}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            title="Chơi lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTip && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 font-medium animate-in slide-in-from-top-2 duration-200 flex items-start gap-2.5">
          <span className="text-lg shrink-0">💡</span>
          <p className="leading-relaxed">{activeTip}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx);
          const isMatched = matchedPairIds.includes(card.pairId);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleCardClick(idx)}
              disabled={isMatched || isFlipped}
              className={`aspect-[4/3] rounded-2xl p-3 border transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer select-none relative overflow-hidden ${
                isMatched
                  ? "bg-emerald-50/80 border-emerald-300 shadow-2xs scale-98"
                  : isFlipped
                  ? "bg-white border-[#0284c7] shadow-md ring-2 ring-sky-400/20"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 hover:from-sky-50 hover:to-sky-100 border-slate-300/80 hover:border-sky-300 shadow-2xs hover:scale-102"
              }`}
            >
              {isFlipped || isMatched ? (
                <div className="space-y-1 animate-in zoom-in-75 duration-200">
                  <span className="text-3xl">{card.icon}</span>
                  <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-800 line-clamp-1">
                    {card.title}
                  </h4>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                    card.type === "danger"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {card.type === "danger" ? "Ngụy Trang Độc Hại" : "Đồ Dùng An Toàn"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 opacity-70">
                  <span className="text-2xl">❓</span>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Thẻ #{idx + 1}
                  </span>
                </div>
              )}

              {isMatched && (
                <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {completed && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-emerald-800 uppercase tracking-tight">
            Vượt Ải Thám Tử Xuất Sắc!
          </h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
            Bạn đã phân biệt được 100% các thủ đoạn ngụy trang ma túy học đường chỉ sau <b>{moves}</b> lượt lật (+50 Điểm Danh Dự)!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={initGame}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Chơi Lại Ván Mới
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

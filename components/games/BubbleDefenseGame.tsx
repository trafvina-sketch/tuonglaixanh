"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Heart, Trophy, Zap, AlertOctagon, RotateCcw } from "lucide-react";
import { playTone } from "./gameAudio";

interface Bubble {
  id: number;
  type: "toxic" | "clean";
  name: string;
  icon: string;
  x: number; // Tọa độ ngang 10% - 85%
  y: number; // Tọa độ dọc rơi xuống 0% -> 90%
  speed: number;
}

const TOXIC_TYPES = [
  { name: "Bóng Cười N2O", icon: "🎈" },
  { name: "Khói Pod Chill", icon: "💨" },
  { name: "Viên Lắc Độc", icon: "💊" },
  { name: "Tem Bùa Lưỡi", icon: "👅" },
  { name: "Gói Nước Vui", icon: "🧪" },
];

const CLEAN_TYPES = [
  { name: "Oxy Sạch", icon: "💧" },
  { name: "Táo Dinh Dưỡng", icon: "🍎" },
  { name: "Sách Tri Thức", icon: "📚" },
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function BubbleDefenseGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [wave, setWave] = useState(1);

  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setWave(1);
    setGameOver(false);
    setBubbles([]);
    setPlaying(true);
    playTone("click", soundEnabled);
  };

  useEffect(() => {
    if (playing && lives > 0) {
      // Vòng lặp cập nhật vị trí bóng rơi
      loopRef.current = setInterval(() => {
        setBubbles((prev) => {
          const next: Bubble[] = [];
          for (const b of prev) {
            const nextY = b.y + b.speed;
            if (nextY >= 88) {
              // Rơi chạm phòng tuyến não bộ
              if (b.type === "toxic") {
                playTone("fail", soundEnabled);
                setLives((l) => {
                  const newL = l - 1;
                  if (newL <= 0) {
                    setPlaying(false);
                    setGameOver(true);
                    playTone("fail", soundEnabled);
                  }
                  return newL;
                });
              }
              // Bỏ qua nếu chạm đáy
            } else {
              next.push({ ...b, y: nextY });
            }
          }
          return next;
        });
      }, 50);

      // Sinh bóng mới ngẫu nhiên
      spawnRef.current = setInterval(() => {
        const isToxic = Math.random() < 0.75;
        const pool = isToxic ? TOXIC_TYPES : CLEAN_TYPES;
        const item = pool[Math.floor(Math.random() * pool.length)];
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          type: isToxic ? "toxic" : "clean",
          name: item.name,
          icon: item.icon,
          x: Math.floor(10 + Math.random() * 75),
          y: 0,
          speed: 1.2 + Math.random() * 0.8,
        };
        setBubbles((prev) => [...prev, newBubble]);
      }, 900);

      return () => {
        if (loopRef.current) clearInterval(loopRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
      };
    }
  }, [playing, lives]);

  const handlePop = (id: number, type: "toxic" | "clean") => {
    if (!playing) return;

    if (type === "toxic") {
      playTone("pop", soundEnabled);
      setScore((s) => s + 15);
      onAddScore(15);
    } else {
      // Bắn nhầm đồ tốt!
      playTone("fail", soundEnabled);
      setLives((l) => {
        const newL = l - 1;
        if (newL <= 0) {
          setPlaying(false);
          setGameOver(true);
        }
        return newL;
      });
    }

    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>🎯 Bắn Phá Bóng Độc: Bảo Vệ Não Bộ Học Đường</span>
          </h2>
          <p className="text-xs text-slate-500">
            Chạm nhanh bắn vỡ các bóng độc hại (+15đ). Đừng để chúng chạm vào Não Bộ và KHÔNG bắn nhầm Oxy sạch!
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full border border-rose-200">
            <span>Lá chắn:</span>
            <div className="flex items-center gap-0.5">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < lives ? "fill-rose-500 text-rose-500" : "text-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-sky-50 text-[#0284c7] border border-sky-200 px-3.5 py-1.5 rounded-full">
            <span>Điểm: <b className="text-sm font-black">{score}</b></span>
          </div>
        </div>
      </div>

      {!playing && !gameOver && (
        <div className="bg-gradient-to-b from-sky-50 to-slate-50 border-2 border-dashed border-sky-200 rounded-3xl p-8 text-center space-y-4">
          <div className="text-5xl animate-bounce">🧠🛡️</div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-black text-sm text-[#1e3a8a] uppercase">Pháo Đài Não Bộ Cần Bạn Bảo Vệ!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Các bóng chứa khói Pod Chill, bóng cười, thuốc lắc đang bay tới. Hãy chạm để bắn nổ chúng ngay lập tức!
            </p>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-[#1e3a8a] hover:from-sky-700 hover:to-[#172554] text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            KÍCH HOẠT PHÒNG THỦ
          </button>
        </div>
      )}

      {playing && (
        <div className="relative w-full h-[340px] bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 rounded-3xl overflow-hidden border border-slate-700 select-none shadow-inner">
          
          {/* SAO BĂNG / BỤI KHÔNG GIAN NỀN */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* CÁC BÓNG ĐỘC TRÔI XUỐNG */}
          {bubbles.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => handlePop(b.id, b.type)}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
              className={`absolute -translate-x-1/2 p-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-125 active:scale-90 shadow-lg ${
                b.type === "toxic"
                  ? "bg-rose-500/80 border-2 border-rose-300 text-white animate-pulse"
                  : "bg-emerald-500/80 border-2 border-emerald-300 text-white"
              }`}
            >
              <span className="text-2xl sm:text-3xl">{b.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-tight text-white drop-shadow-md">
                {b.name}
              </span>
            </button>
          ))}

          {/* PHÒNG TUYẾN NÃO BỘ DƯỚI ĐÁY */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-sky-900/90 backdrop-blur-md border-t-2 border-sky-400 flex items-center justify-center gap-3 px-4">
            <span className="text-2xl animate-spin" style={{ animationDuration: "10s" }}>🧠</span>
            <div className="text-center leading-tight">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-200">
                VÙNG NÃO BỘ HỌC ĐƯỜNG AN TOÀN
              </span>
              <p className="text-[9px] text-sky-300">Không cho độc chất ma túy xâm nhập!</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      )}

      {gameOver && (
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-300 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8 text-rose-100" />
          </div>
          <h3 className="text-lg font-black text-rose-900 uppercase tracking-tight">
            Kết Thúc Chiến Dịch! Điểm Của Bạn: {score} Điểm
          </h3>
          <p className="text-xs text-rose-800 max-w-md mx-auto leading-relaxed">
            {score >= 200
              ? "Tuyệt đỉnh! Bạn là tấm khiên vững vàng nhất bảo vệ não bộ học đường an toàn! 🥇"
              : score >= 100
              ? "Khá lắm! Bạn đã tiêu diệt được rất nhiều cạm bẫy độc hại trước khi chúng kịp gây hại! 🥈"
              : "Đừng nản lòng! Hãy rèn luyện thêm mắt nhìn và phản xạ để bảo vệ tối đa trí tuệ nhé! 🥉"}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={startGame}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
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

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, X, Flame, Trophy, Sparkles, RotateCcw } from "lucide-react";
import { playTone } from "./gameAudio";

interface FactItem {
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

const FACTS_DATA: FactItem[] = [
  {
    statement: "Hút Pod Chill chỉ là tinh dầu trái cây, không bao giờ gây nghiện?",
    isCorrect: false,
    explanation: "SAI! Pod Chill tẩm cần sa tổng hợp cực độc, gây nghiện tức thì và tàn phá não bộ!",
  },
  {
    statement: "Gọi Tổng đài Quốc gia 111 được bảo mật danh tính tuyệt đối và miễn cước 24/7?",
    isCorrect: true,
    explanation: "ĐÚNG! Tổng đài 111 luôn bảo vệ học sinh an toàn và hỗ trợ khẩn cấp.",
  },
  {
    statement: "Bóng cười chỉ là khí vui vẻ, hít bao nhiêu cũng không bị liệt?",
    isCorrect: false,
    explanation: "SAI! Khí N2O hủy hoại tủy sống, gây tổn thương não và liệt toàn thân!",
  },
  {
    statement: "Nước Vui (Chali) có thể ngụy trang dưới dạng gói bột pha nước cam, nước dâu?",
    isCorrect: true,
    explanation: "ĐÚNG! Kẻ xấu cố tình đóng gói sặc sỡ để lừa học sinh uống nhầm tại các bữa tiệc.",
  },
  {
    statement: "Bản lĩnh thật sự của học sinh là dám dứt khoát nói KHÔNG với chất cấm?",
    isCorrect: true,
    explanation: "ĐÚNG! Từ chối cám dỗ là sự dũng cảm và thông minh của người làm chủ tương lai.",
  },
  {
    statement: "Cỏ Mỹ chỉ là thảo dược thiên nhiên lành tính?",
    isCorrect: false,
    explanation: "SAI! Cỏ Mỹ tẩm hóa chất ma túy cực mạnh, gây ảo giác hoang tưởng và tự hại!",
  },
  {
    statement: "Thấy bạn bè bị ép hút pod, cách an toàn nhất là báo ngay cho Thầy Cô?",
    isCorrect: true,
    explanation: "ĐÚNG! Kịp thời báo người lớn là giải cứu bạn mình khỏi hiểm họa.",
  },
  {
    statement: "Uống thử nước ngọt người lạ đưa ở quán net một ngụm là không sao?",
    isCorrect: false,
    explanation: "SAI! Tuyệt đối không ăn uống đồ lạ từ người không quen biết!",
  },
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function FactOrMythGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<{ isRight: boolean; text: string } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setTimeLeft(30);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setGameOver(false);
    setLastResult(null);
    setPlaying(true);
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

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [playing, timeLeft]);

  const handleAnswer = (userChoice: boolean) => {
    if (!playing) return;

    const currentItem = FACTS_DATA[currentIndex % FACTS_DATA.length];
    const isRight = userChoice === currentItem.isCorrect;

    if (isRight) {
      playTone("success", soundEnabled);
      const bonus = (combo + 1) * 10;
      setScore((s) => s + bonus);
      onAddScore(bonus);
      setCombo((c) => c + 1);
      setLastResult({ isRight: true, text: `Chính xác! ${currentItem.explanation}` });
    } else {
      playTone("fail", soundEnabled);
      setCombo(0);
      setLastResult({ isRight: false, text: `Sai rồi! ${currentItem.explanation}` });
    }

    setCurrentIndex((i) => i + 1);
  };

  const currentItem = FACTS_DATA[currentIndex % FACTS_DATA.length];

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>⚖️ Đúng Hay Sai Thần Tốc (30 Giây)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Vạch trần các lời đồn ma túy tai hại trong tích tắc. Trả lời đúng liên tiếp để nhân điểm Combo!
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold shrink-0">
          <div className="bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Thời gian: <b className="text-sm">{timeLeft}s</b></span>
          </div>

          {combo > 1 && (
            <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-black animate-bounce">
              🔥 Combo x{combo}
            </div>
          )}

          <div className="bg-sky-50 text-[#0284c7] border border-sky-200 px-3.5 py-1.5 rounded-full">
            <span>Điểm: <b className="text-sm font-black">{score}</b></span>
          </div>
        </div>
      </div>

      {!playing && !gameOver && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-4">
          <div className="text-4xl">⚡⚖️</div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-black text-sm text-[#1e3a8a] uppercase">Vạch Lá Tìm Sâu: Đúng Hay Sai?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bạn có 30 giây để phán đoán các câu nói về ma túy học đường. Càng trả lời nhanh và đúng, điểm càng cao!
            </p>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            BẮT ĐẦU 30 GIÂY
          </button>
        </div>
      )}

      {playing && (
        <div className="space-y-6 max-w-2xl mx-auto text-center py-2">
          
          <div className="bg-gradient-to-r from-slate-50 via-sky-50 to-slate-50 border-2 border-sky-200 rounded-3xl p-6 sm:p-8 shadow-xs min-h-[140px] flex items-center justify-center">
            <h3 className="font-black text-base sm:text-lg text-slate-800 leading-relaxed">
              "{currentItem.statement}"
            </h3>
          </div>

          {/* 2 NÚT ĐÚNG / SAI LỚN VÀ NỔI BẬT */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-base sm:text-lg shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>ĐÚNG</span>
            </button>

            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-base sm:text-lg shadow-md shadow-rose-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[3]" />
              <span>SAI</span>
            </button>
          </div>

          {lastResult && (
            <p className={`text-xs font-bold animate-in fade-in duration-150 ${
              lastResult.isRight ? "text-emerald-600" : "text-rose-600"
            }`}>
              {lastResult.text}
            </p>
          )}

        </div>
      )}

      {gameOver && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-emerald-900 uppercase tracking-tight">
            Hết Giờ! Tổng Điểm Của Bạn: {score} Điểm
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            {score >= 120
              ? "Bộ não phân tích siêu đẳng! Không một lời đồn ma túy nào có thể đánh lừa được bạn! 🥇"
              : score >= 60
              ? "Khá tốt! Bạn nắm rất vững kiến thức và kỹ năng phòng chống ma túy học đường! 🥈"
              : "Hãy luyện tập thêm để nâng cao tốc độ phản xạ và kiến thức nhé! 🥉"}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={startGame}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Chơi Lại 30 Giây
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

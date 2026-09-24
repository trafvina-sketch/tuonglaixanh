"use client";

import React, { useState } from "react";
import { HelpCircle, Trophy, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { playTone } from "./gameAudio";

interface WordPuzzle {
  word: string; // Từ khóa không dấu để đoán dễ dàng
  displayWord: string; // Từ khóa hiển thị tiếng Việt có dấu
  hint: string;
  category: string;
  explanation: string;
}

const PUZZLES: WordPuzzle[] = [
  {
    word: "PODCHILL",
    displayWord: "POD CHILL",
    category: "Ma túy ngụy trang",
    hint: "Dạng thuốc lá điện tử ngụy trang cây bút hoặc thỏi son, tẩm tinh dầu cần sa tổng hợp cực độc?",
    explanation: "Pod Chill chứa hóa chất kích thích thần kinh, gây suy tim, ảo giác hoang tưởng và nghiện tức thì!",
  },
  {
    word: "NUOCVUI",
    displayWord: "NƯỚC VUI",
    category: "Bẫy ngụy trang tiệc tùng",
    hint: "Gói bột màu mè hòa vào nước sủi bọt, thường pha trộn ketamine và thuốc lắc?",
    explanation: "Nước Vui (Chali) là bẫy độc hại hàng đầu tại các quán bar, karaoke, có thể gây ngưng tim sau 15 phút!",
  },
  {
    word: "TONGDAI111",
    displayWord: "TỔNG ĐÀI 111",
    category: "Cứu hộ khẩn cấp",
    hint: "Đường dây nóng Quốc gia bảo vệ trẻ em, tiếp nhận thông tin tố giác ẩn danh miễn cước 24/7?",
    explanation: "Hãy gọi ngay 111 bất cứ khi nào bạn hoặc bạn bè bị kẻ xấu đe dọa, ép buộc sử dụng chất cấm!",
  },
  {
    word: "QUYTAC3KHONG",
    displayWord: "QUY TẮC 3 KHÔNG",
    category: "Kỹ năng vàng",
    hint: "Khẩu hiệu tự vệ: Không thử dù 1 lần - Không tàng trữ sử dụng - Không rủ rê bao che?",
    explanation: "Khắc ghi Quy tắc 3 KHÔNG là tấm khiên vững vàng nhất bảo vệ danh dự và tương lai học sinh!",
  },
  {
    word: "BONGCUOI",
    displayWord: "BÓNG CƯỜI",
    category: "Khí độc hại trá hình",
    hint: "Khí N2O hít vào gây hưng phấn nhất thời nhưng làm teo tủy sống và liệt tứ chi?",
    explanation: "Bóng cười là chất gây nghiện nguy hiểm, nhiều bạn trẻ đã bị bại liệt suốt đời chỉ vì hít thử!",
  },
];

const KEYBOARD_KEYS = [
  "A", "B", "C", "D", "E", "G", "H", "I", "K", "L",
  "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "1", "3"
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function WordGuessGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [puzzleFinished, setPuzzleFinished] = useState(false);

  const currentPuzzle = PUZZLES[puzzleIndex];
  const targetLetters = currentPuzzle.word.split("");

  // Kiểm tra xem đã đoán trúng hết chưa
  const isWon = targetLetters.every((char) => guessedLetters.includes(char));
  const isLost = wrongCount >= 6;

  const handleGuess = (char: string) => {
    if (guessedLetters.includes(char) || isWon || isLost) return;

    const newGuessed = [...guessedLetters, char];
    setGuessedLetters(newGuessed);

    if (targetLetters.includes(char)) {
      playTone("success", soundEnabled);
      // Kiểm tra nếu vừa thắng
      if (targetLetters.every((c) => newGuessed.includes(c))) {
        playTone("win", soundEnabled);
        setTotalScore((s) => s + 30);
        onAddScore(30);
      }
    } else {
      playTone("fail", soundEnabled);
      setWrongCount((w) => w + 1);
    }
  };

  const handleNextPuzzle = () => {
    playTone("click", soundEnabled);
    if (puzzleIndex + 1 < PUZZLES.length) {
      setPuzzleIndex((i) => i + 1);
      setGuessedLetters([]);
      setWrongCount(0);
    } else {
      setPuzzleFinished(true);
      playTone("win", soundEnabled);
    }
  };

  const resetAll = () => {
    setPuzzleIndex(0);
    setGuessedLetters([]);
    setWrongCount(0);
    setTotalScore(0);
    setPuzzleFinished(false);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>🧩 Giải Cứu Từ Khóa Bí Mật Học Đường</span>
          </h2>
          <p className="text-xs text-slate-500">
            Dựa vào gợi ý để đoán đúng các ký tự ghép thành từ khóa an toàn (Tối đa đoán sai 6 lần).
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold shrink-0">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full">
            Câu: <b className="text-sm font-black">{puzzleIndex + 1} / {PUZZLES.length}</b>
          </div>
          <div className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-full">
            Lỗi sai: <b className="text-sm font-black">{wrongCount} / 6</b>
          </div>
          <div className="bg-sky-50 text-[#0284c7] border border-sky-200 px-3 py-1.5 rounded-full">
            Điểm: <b className="text-sm font-black">{totalScore}</b>
          </div>
        </div>
      </div>

      {!puzzleFinished ? (
        <div className="space-y-6">
          
          {/* KHUNG GỢI Ý & PHÂN LOẠI */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-200 text-amber-900">
                {currentPuzzle.category}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
              💡 {currentPuzzle.hint}
            </p>
          </div>

          {/* CÁC Ô CHỮ CÁI BÍ MẬT */}
          <div className="flex items-center justify-center flex-wrap gap-2 py-2">
            {targetLetters.map((char, idx) => {
              const revealed = guessedLetters.includes(char) || isLost;
              return (
                <div
                  key={idx}
                  className={`w-10 h-12 sm:w-12 sm:h-14 rounded-2xl border-2 font-black text-base sm:text-lg flex items-center justify-center shadow-xs transition-all ${
                    revealed
                      ? isLost && !guessedLetters.includes(char)
                        ? "bg-rose-50 border-rose-400 text-rose-600"
                        : "bg-sky-50 border-[#0284c7] text-[#1e3a8a] scale-105"
                      : "bg-slate-100 border-slate-300 text-transparent"
                  }`}
                >
                  {revealed ? char : "?"}
                </div>
              );
            })}
          </div>

          {/* BÀN PHÍM CHỮ CÁI ẢO */}
          {!isWon && !isLost && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Chạm vào chữ cái để giải mã:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-xl mx-auto">
                {KEYBOARD_KEYS.map((k) => {
                  const used = guessedLetters.includes(k);
                  const isHit = used && targetLetters.includes(k);
                  const isMiss = used && !targetLetters.includes(k);

                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleGuess(k)}
                      disabled={used}
                      className={`w-8 h-9 sm:w-10 sm:h-11 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                        isHit
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-xs"
                          : isMiss
                          ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
                          : "bg-white hover:bg-sky-50 hover:border-sky-400 text-slate-700 shadow-2xs hover:scale-105"
                      }`}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* HIỂN THỊ KẾT QUẢ VÒNG HIỆN TẠI */}
          {(isWon || isLost) && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in slide-in-from-top-2 duration-150 ${
              isWon
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-rose-50 border-rose-300 text-rose-900"
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm uppercase">
                  {isWon ? "🎉 Chính Xác! Đáp Án Là: " + currentPuzzle.displayWord : "Chưa Đoán Ra: " + currentPuzzle.displayWord}
                </span>
                <span className="font-bold">{isWon ? "+30 Điểm" : "0 Điểm"}</span>
              </div>
              <p className="leading-relaxed font-medium">
                {currentPuzzle.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextPuzzle}
                  className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  {puzzleIndex + 1 < PUZZLES.length ? "Sang Từ Khóa Tiếp Theo &rarr;" : "Xem Tổng Kết Điểm &rarr;"}
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">
            Hoàn Thành Thử Thách Từ Khóa Bí Mật!
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Bạn đã xuất sắc giải mã toàn bộ kho tàng từ khóa bảo vệ học đường với tổng điểm: <b>{totalScore} Điểm</b>!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Chơi Lại Từ Đầu
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

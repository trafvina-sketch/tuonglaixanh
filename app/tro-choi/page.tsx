"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Trophy,
  Volume2,
  VolumeX,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Flame,
  Award
} from "lucide-react";

import MemoryGame from "@/components/games/MemoryGame";
import ReactionGame from "@/components/games/ReactionGame";
import ScenarioGame from "@/components/games/ScenarioGame";
import BubbleDefenseGame from "@/components/games/BubbleDefenseGame";
import WordGuessGame from "@/components/games/WordGuessGame";
import FactOrMythGame from "@/components/games/FactOrMythGame";
import LuckyWheelGame from "@/components/games/LuckyWheelGame";
import SortingGame from "@/components/games/SortingGame";
import { playTone } from "@/components/games/gameAudio";

type GameTab =
  | "memory"
  | "reaction"
  | "scenario"
  | "bubble"
  | "word"
  | "fact"
  | "wheel"
  | "sort";

interface GameTabConfig {
  id: GameTab;
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  desc: string;
}

const GAME_TABS: GameTabConfig[] = [
  {
    id: "memory",
    title: "Thám Tử Lật Thẻ",
    badge: "NGỤY TRANG",
    badgeColor: "bg-rose-100 text-rose-700",
    icon: "🕵️",
    desc: "Vạch trần các cặp thẻ đối chứng ngụy trang ma túy.",
  },
  {
    id: "reaction",
    title: "Vệ Binh Phản Xạ",
    badge: "45 GIÂY",
    badgeColor: "bg-amber-100 text-amber-800",
    icon: "⚡",
    desc: "Bắt trọn đồ tốt, né cạm bẫy xấu trong tích tắc.",
  },
  {
    id: "scenario",
    title: "Đấu Trí Tình Huống",
    badge: "4 BƯỚC",
    badgeColor: "bg-emerald-100 text-emerald-800",
    icon: "🥋",
    desc: "Nhập vai xử lý khéo léo khi bị rủ rê, khích bác.",
  },
  {
    id: "bubble",
    title: "Bảo Vệ Não Bộ",
    badge: "BẮN BÓNG ĐỘC",
    badgeColor: "bg-indigo-100 text-indigo-700",
    icon: "🎯",
    desc: "Bắn nổ bóng Pod Chill, bóng cười bảo vệ thành trì.",
  },
  {
    id: "word",
    title: "Từ Khóa Bí Mật",
    badge: "GIẢI CỨU",
    badgeColor: "bg-teal-100 text-teal-800",
    icon: "🧩",
    desc: "Đoán chữ cái giải mã bí mật phòng chống ma túy.",
  },
  {
    id: "fact",
    title: "Đúng Hay Sai",
    badge: "30 GIÂY",
    badgeColor: "bg-pink-100 text-pink-700",
    icon: "⚖️",
    desc: "Vạch lá tìm sâu, phá tan các lời đồn ma túy tai hại.",
  },
  {
    id: "wheel",
    title: "Vòng Quay Bản Lĩnh",
    badge: "MAY MẮN",
    badgeColor: "bg-orange-100 text-orange-800",
    icon: "🎡",
    desc: "Quay may mắn tích điểm danh dự và nhận lời khuyên vàng.",
  },
  {
    id: "sort",
    title: "Chiến Dịch Phân Loại",
    badge: "DỌN RÁC",
    badgeColor: "bg-purple-100 text-purple-800",
    icon: "🧹",
    desc: "Phân loại đồ vật: Cho vào Balo hay Thùng tiêu hủy.",
  },
];

export default function GameHubPage() {
  const [activeTab, setActiveTab] = useState<GameTab>("memory");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [honorScore, setHonorScore] = useState(150);

  const handleAddScore = (points: number) => {
    setHonorScore((prev) => prev + points);
  };

  const handleNextGame = () => {
    const currentIndex = GAME_TABS.findIndex((g) => g.id === activeTab);
    const nextIndex = (currentIndex + 1) % GAME_TABS.length;
    setActiveTab(GAME_TABS[nextIndex].id);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* 1. HEADER KHU VỰC TRÒ CHƠI VŨ TRỤ KẸO NGỌT */}
      <div className="bg-gradient-to-r from-purple-950 via-pink-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-purple-400/30">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-teal-300/30 text-xs font-bold text-teal-200">
            <Gamepad2 className="w-4 h-4 text-pink-300" />
            <span>Tổ Hợp 8 Trò Chơi Giáo Dục Vũ Trụ Kẹo Ngọt Đỉnh Cao 🪐✨</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white drop-shadow-xs">
            Đấu Trường Trò Chơi Tuổi Thơ
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed font-medium">
            Vừa học vừa chơi trong thế giới kỳ diệu! 8 mini game tương tác phong phú giúp học sinh nhận diện ma túy ngụy trang, luyện phản xạ và làm chủ kỹ năng tự vệ.
          </p>
        </div>

        {/* NÚT BẬT TẮT ÂM THANH & TỔNG ĐIỂM DANH DỰ */}
        <div className="flex items-center gap-3 z-10 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold text-white transition-all cursor-pointer shadow-xs border border-white/20"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-teal-300" />
                <span>Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-pink-200" />
                <span>Âm thanh: Tắt</span>
              </>
            )}
          </button>

          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-purple-950 font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-amber-200">
            <Trophy className="w-5 h-5 text-purple-950" />
            <div className="text-left leading-tight">
              <span className="block text-[9px] uppercase tracking-wider text-purple-900 font-extrabold">Điểm Danh Dự</span>
              <span className="text-sm font-black">{honorScore} Điểm</span>
            </div>
          </div>
        </div>

        {/* TRANG TRÍ HÌNH HỌC NỀN */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-pink-500/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. THANH LỰA CHỌN 8 TRÒ CHƠI THEO LƯỚI (2 HÀNG x 4 CỘT) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>Chọn phòng thử thách:</span>
          </p>
          <span className="text-[11px] text-purple-600 font-medium">8 Chế độ chơi đa dạng</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {GAME_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  playTone("click", soundEnabled);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer shadow-xs ${
                  isActive
                    ? "bg-purple-50/70 border-purple-500 ring-2 ring-purple-400/30 shadow-md scale-102"
                    : "bg-white hover:bg-pink-50/30 border-purple-100 text-slate-600 hover:border-pink-300"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-2xl">{tab.icon}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                </div>
                <div>
                  <h3 className={`font-extrabold text-xs sm:text-[13px] leading-tight ${
                    isActive ? "text-purple-700" : "text-slate-800"
                  }`}>
                    {tab.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. KHU VỰC HIỂN THỊ TRÒ CHƠI ĐANG ĐƯỢC CHỌN */}
      {activeTab === "memory" && (
        <MemoryGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {activeTab === "reaction" && (
        <ReactionGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {activeTab === "scenario" && (
        <ScenarioGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {activeTab === "bubble" && (
        <BubbleDefenseGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {activeTab === "word" && (
        <WordGuessGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {activeTab === "fact" && (
        <FactOrMythGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {activeTab === "wheel" && (
        <LuckyWheelGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {activeTab === "sort" && (
        <SortingGame
          soundEnabled={soundEnabled}
          onAddScore={handleAddScore}
          onNextGame={handleNextGame}
        />
      )}

      {/* 4. LỐI TẮT HỌC TẬP KHÁC */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        <Link
          href="/nhan-dien"
          className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-pink-300 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-purple-600 transition-colors">
                Nhận Diện Ma Túy
              </h4>
              <p className="text-[10px] text-slate-500">Xem ảnh phóng to & cách thức ngụy trang</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/khao-thi"
          className="p-4 rounded-2xl bg-white border border-pink-100 hover:border-orange-300 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-pink-600 transition-colors">
                Thử Thách Trắc Nghiệm
              </h4>
              <p className="text-[10px] text-slate-500">Thi đấu 15 câu nhận bằng chứng nhận</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/to-giac"
          className="p-4 rounded-2xl bg-white border border-teal-100 hover:border-teal-300 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-teal-600 transition-colors">
                Hộp Thư Tố Giác Ẩn Danh
              </h4>
              <p className="text-[10px] text-slate-500">Bảo vệ bạn bè & trường học an toàn</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

    </div>
  );
}

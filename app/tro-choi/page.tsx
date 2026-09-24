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
      
      {/* 1. HEADER KHU VỰC TRÒ CHƠI HOÀNH TRÁNG */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#0369a1] to-[#0284c7] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-sky-200">
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            <span>Tổ Hợp 8 Trò Chơi Giáo Dục Học Đường Đỉnh Cao</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white drop-shadow-xs">
            Đấu Trường Trò Chơi Học Đường
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-medium">
            Vừa học vừa chơi, rèn luyện bản lĩnh! 8 mini game tương tác phong phú giúp học sinh nhận diện ma túy ngụy trang, luyện phản xạ và làm chủ kỹ năng tự vệ.
          </p>
        </div>

        {/* NÚT BẬT TẮT ÂM THANH & TỔNG ĐIỂM DANH DỰ */}
        <div className="flex items-center gap-3 z-10 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-300" />
                <span>Âm thanh: Bật</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-300" />
                <span>Âm thanh: Tắt</span>
              </>
            )}
          </button>

          <div className="bg-amber-400 text-amber-950 font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
            <Trophy className="w-5 h-5 text-amber-800" />
            <div className="text-left leading-tight">
              <span className="block text-[9px] uppercase tracking-wider text-amber-900 font-extrabold">Điểm Danh Dự</span>
              <span className="text-sm font-black">{honorScore} Điểm</span>
            </div>
          </div>
        </div>

        {/* TRANG TRÍ HÌNH HỌC NỀN */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-40 h-40 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. THANH LỰA CHỌN 8 TRÒ CHƠI THEO LƯỚI (2 HÀNG x 4 CỘT) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Chọn phòng thử thách:</span>
          </p>
          <span className="text-[11px] text-slate-500 font-medium">8 Chế độ chơi đa dạng</span>
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
                    ? "bg-white border-[#0284c7] ring-2 ring-sky-500/25 shadow-md scale-102"
                    : "bg-white hover:bg-slate-50 border-slate-200/80 text-slate-600 hover:border-sky-300"
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
                    isActive ? "text-[#0284c7]" : "text-slate-800"
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
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-[#0284c7] transition-colors">
                Nhận Diện Ma Túy
              </h4>
              <p className="text-[10px] text-slate-500">Xem ảnh phóng to & cách thức ngụy trang</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0284c7] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/khao-thi"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-amber-600 transition-colors">
                Thử Thách Trắc Nghiệm
              </h4>
              <p className="text-[10px] text-slate-500">Thi đấu 15 câu nhận bằng chứng nhận</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/to-giac"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-300 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-800 group-hover:text-rose-600 transition-colors">
                Hộp Thư Tố Giác Ẩn Danh
              </h4>
              <p className="text-[10px] text-slate-500">Bảo vệ bạn bè & trường học an toàn</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

    </div>
  );
}

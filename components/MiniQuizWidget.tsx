"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Bot, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Flame, RotateCcw } from "lucide-react";

interface MiniQuizWidgetProps {
  initialQuestion?: {
    id: string;
    scenario_title: string;
    scenario_story: string;
    image_webp_url?: string;
    options: {
      id: string;
      text: string;
      is_correct: boolean;
      explanation: string;
    }[];
    tip_trang_ti: string;
  };
}

export default function MiniQuizWidget({ initialQuestion }: MiniQuizWidgetProps) {
  // Dữ liệu dự phòng nếu chưa load được từ DB
  const defaultQ = {
    id: "default-1",
    scenario_title: "Bẫy ngọt ngào ở quán trà sữa",
    scenario_story: "Trong buổi liên hoan sinh nhật tại quán trà sữa gần trường, anh khóa trên đưa cho em một chiếc Pod sặc sỡ mùi kẹo đào bảo: 'Hút một hơi cho thơm miệng và tỉnh táo học bài, người lớn ai cũng hút, sợ gì như con nít thế?'. Cả nhóm đang nhìn em cười. Em sẽ làm gì?",
    image_webp_url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
    options: [
      { id: "A", text: "Hút thử 1 hơi thật nhẹ cho đỡ bị quê với bạn bè.", is_correct: false, explanation: "Sai lầm nguy hiểm! Pod Chill chứa ma túy tổng hợp cực độc, chỉ 1 hơi có thể gây co giật, loạn thần và nghiện tức thì." },
      { id: "B", text: "Quát to 'Đồ ma túy!' rồi hất đổ ly nước của anh ấy.", is_correct: false, explanation: "Sai lầm! Hành vi kích động dễ dẫn tới ẩu đả, bị chặn đánh sau khi tan tiệc." },
      { id: "C", text: "Áp dụng Kế Hoãn Binh: Ho sặc sụa 'Em bị hen suyễn nặng ngửi khói là ngất ngay!', rồi xin phép ra về và báo người lớn.", is_correct: true, explanation: "Chính xác tuyệt đối! Kế hoãn binh vừa bảo toàn thân thể, vừa không khiêu khích đối phương, sau đó rút lui an toàn." }
    ],
    tip_trang_ti: "Hay lắm bạn nhỏ! Lấy cớ sức khỏe là chiếc khiên mềm dẻo nhưng vững chắc nhất để từ chối mọi lời ép uổng!"
  };

  const question = initialQuestion || defaultQ;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (id: string) => {
    if (hasAnswered) return;
    setSelectedId(id);
    setHasAnswered(true);
  };

  const resetQuiz = () => {
    setSelectedId(null);
    setHasAnswered(false);
  };

  const chosenOption = question.options.find((o) => o.id === selectedId);

  return (
    <section className="bg-[#FFFDF9] border-3 border-[#1E1B18] rounded-3xl p-6 sm:p-7 shadow-[5px_5px_0px_#1E1B18] relative overflow-hidden">
      {/* Huy hiệu dân gian */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#D6C8B2] pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl animate-bounce">⚡</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#9E2A2B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ĐẤU TRÍ TRẠNG TÍ 60S
              </span>
              <span className="seal-stamp text-[9px] px-1.5 py-0.2 rounded font-heritage text-[#C5892F]">
                CHƠI NGAY TẠI TRANG CHỦ
              </span>
            </div>
            <h3 className="font-heritage font-bold text-base sm:text-lg text-[#1E1B18] mt-0.5">
              Thử Thách Thoát Hiểm: {question.scenario_title}
            </h3>
          </div>
        </div>

        <Link
          href="/khao-thi"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9E2A2B] hover:text-[#7A1E1F] hover:underline"
        >
          <span>Vào đấu trường 5 ải</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* NỘI DUNG TÌNH HUỐNG & CÁC LỰA CHỌN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* CỘT TRÁI: BỐI CẢNH TÌNH HUỐNG (5 CỘT) */}
        <div className="lg:col-span-5 bg-[#F8F4EA] border-2 border-[#1E1B18] rounded-2xl p-4 space-y-3">
          <span className="text-[11px] font-bold text-[#9E2A2B] uppercase tracking-wide flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#9E2A2B]" />
            Tình Huống Thực Tế Trường Học:
          </span>
          <p className="text-xs sm:text-sm text-[#1E1B18] leading-relaxed font-medium">
            "{question.scenario_story}"
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-[#7A6B58] font-semibold border-t border-[#D6C8B2]">
            <span>🎯 Em sẽ chọn cách xử lý nào?</span>
            <span className="text-[#9E2A2B] italic">Suy nghĩ kỹ trước khi chọn</span>
          </div>
        </div>

        {/* CỘT PHẢI: 3 LỰA CHỌN ĐÁP ÁN (7 CỘT) */}
        <div className="lg:col-span-7 space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            let btnStyle = "bg-white border-[#1E1B18] hover:bg-[#F8F4EA]";

            if (hasAnswered) {
              if (opt.is_correct) {
                btnStyle = "bg-[#E8F3EB] border-[#2E7D32] text-[#1B5E20] shadow-[2px_2px_0px_#2E7D32]";
              } else if (isSelected && !opt.is_correct) {
                btnStyle = "bg-[#FDF2F2] border-[#DC2626] text-[#991B1B] shadow-[2px_2px_0px_#DC2626]";
              } else {
                btnStyle = "bg-white/60 border-slate-200 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={hasAnswered}
                className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-3 ${btnStyle}`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                  hasAnswered && opt.is_correct
                    ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                    : hasAnswered && isSelected && !opt.is_correct
                    ? "bg-[#DC2626] text-white border-[#DC2626]"
                    : "bg-[#F8F4EA] text-[#1E1B18] border-[#1E1B18]"
                }`}>
                  {opt.id}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-snug flex-1">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* PHẢN HỒI CỦA TRẠNG TÍ SAU KHI CHỌN */}
      {hasAnswered && chosenOption && (
        <div className="mt-5 pt-4 border-t-2 border-[#D6C8B2] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`p-4 rounded-2xl border-2 ${
            chosenOption.is_correct
              ? "bg-[#E8F3EB] border-[#2E7D32]"
              : "bg-[#FDF2F2] border-[#DC2626]"
          } space-y-3`}>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFFDF9] border-2 border-[#1E1B18] flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-[#9E2A2B]" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heritage font-bold text-sm text-[#1E1B18]">
                    Trạng Tí Luận Giải:
                  </span>
                  {chosenOption.is_correct ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> CHÍNH XÁC XUẤT SẮC!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626]">
                      <XCircle className="w-3.5 h-3.5" /> NGUY HIỂM! CẦN CẢNH GIÁC
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#1E1B18] leading-relaxed">
                  {chosenOption.explanation}
                </p>
                <p className="text-xs font-bold text-[#9E2A2B] italic pt-1">
                  💡 Lời khuyên vàng: "{question.tip_trang_ti}"
                </p>
              </div>
            </div>

            {/* NÚT THAO TÁC TIẾP THEO */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/10">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5C5042] hover:text-[#1E1B18]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử chọn lại</span>
              </button>

              <Link
                href="/khao-thi"
                className="inline-flex items-center gap-2 bg-[#9E2A2B] hover:bg-[#7A1E1F] text-white font-heritage font-bold px-4 py-2 rounded-xl text-xs border border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] transition-all hover:translate-x-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Vượt Trọn Bộ 5 Ải Nhận Bằng Khen Triện Son ➔</span>
              </Link>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

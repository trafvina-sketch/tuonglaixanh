"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { playTone } from "./gameAudio";

interface ScenarioStep {
  title: string;
  context: string;
  illustration: string;
  options: {
    text: string;
    isCorrect: boolean;
    analysis: string;
    points: number;
  }[];
}

const SCENARIO_STORY: ScenarioStep[] = [
  {
    title: "Chương 1: Cổng Trường Giờ Tan Học",
    context: "Giờ tan học, bạn đang đứng chờ bố mẹ đến đón thì một anh khóa trên đi cùng nhóm bạn tiến lại. Anh ta chìa ra một đồ vật có hình dáng giống cây bút dạ quang màu sắc sặc sỡ, tỏa mùi hương dâu tây thơm lừng và nói: 'Này nhóc, thử một hơi đi cho ngầu, hút cái này xả stress đã lắm, anh cho thử miễn phí!'. Bạn sẽ làm gì?",
    illustration: "🏫",
    options: [
      {
        text: "Cầm lấy ngửi thử xem có thơm thật không rồi tính tiếp.",
        isCorrect: false,
        points: 0,
        analysis: "Sai lầm! Khói Pod Chill tẩm cần sa tổng hợp có thể ngấm qua đường hô hấp hoặc bạn sẽ bị cả nhóm ép hút thật khi đã cầm trên tay. Nguyên tắc là KHÔNG CHẠM VÀO!",
      },
      {
        text: "Lùi lại 2 bước, nhìn thẳng vào mắt và nói dứt khoát: 'Không, em không bao giờ dùng thứ này!'.",
        isCorrect: true,
        points: 40,
        analysis: "Tuyệt vời! Bạn đã áp dụng chính xác Bước 1 (Lùi lại tạo khoảng cách an toàn) và Bước 2 (Nói KHÔNG dứt khoát, ánh mắt tự tin khiến đối phương không dám lấn tới).",
      },
      {
        text: "Im lặng, nhìn lén xung quanh và ngập ngừng: 'Em sợ lắm...'.",
        isCorrect: false,
        points: 10,
        analysis: "Thái độ ngập ngừng thể hiện sự yếu thế, kẻ xấu sẽ tiếp tục chèo kéo, khích bác để ép bạn dùng bằng được.",
      },
    ],
  },
  {
    title: "Chương 2: Cám Dỗ & Khích Bác",
    context: "Thấy bạn từ chối, nhóm anh đó cười lớn, một người khác áp sát nói khích: 'Gì mà nhát gan thế? Con trai thế này thì làm ăn gì? Hút một hơi chứng tỏ bản lĩnh đi, không ai mách thầy cô đâu mà sợ!'. Tình huống bắt đầu căng thẳng. Bạn phản ứng ra sao?",
    illustration: "⚠️",
    options: [
      {
        text: "Sợ bị coi là hèn nhát nên đành nhắm mắt thử một hơi cho xong chuyện.",
        isCorrect: false,
        points: 0,
        analysis: "Cực kỳ nguy hiểm! Nghiện ngập chỉ bắt đầu từ 'một hơi thử'. Thể hiện bản lĩnh thực sự là dám nói KHÔNG với cái xấu, chứ không phải hùa theo để chứng tỏ sự liều mạng vô ích!",
      },
      {
        text: "Đứng đôi co, cãi nhau lớn tiếng để chứng minh mình không hèn nhát.",
        isCorrect: false,
        points: 15,
        analysis: "Dễ dẫn đến ẩu đả bạo lực học đường, đặt bản thân vào vòng nguy hiểm khi đối phương đông người hơn.",
      },
      {
        text: "Khẳng định: 'Bản lĩnh là bảo vệ sức khỏe! Em bận về rồi!' và lập tức rảo bước nhanh về phía phòng bảo vệ cổng trường.",
        isCorrect: true,
        points: 40,
        analysis: "Xuất sắc! Bạn áp dụng hoàn hảo Bước 3 (Rời khỏi vùng nguy cơ nhanh chóng). Di chuyển về nơi có người lớn (bác bảo vệ, phụ huynh) là giải pháp tự vệ số 1!",
      },
    ],
  },
  {
    title: "Chương 3: Lá Chắn Bảo Vệ Toàn Trường",
    context: "Sau khi thoát khỏi nhóm người đó và về nhà an toàn, bạn nghĩ về các bạn học sinh lớp dưới có thể sẽ là nạn nhân tiếp theo của nhóm lôi kéo này vào ngày mai. Bạn sẽ quyết định như thế nào?",
    illustration: "🛡️",
    options: [
      {
        text: "Kệ họ, miễn là mình an toàn là được rồi, nhiều chuyện sợ bị trả thù.",
        isCorrect: false,
        points: 0,
        analysis: "Sự im lặng dung túng cho cái xấu lây lan. Ngày mai rất có thể người bị hại chính là bạn bè thân thiết của bạn!",
      },
      {
        text: "Rủ bạn bè trong lớp mai đem hung khí đi giải quyết nhóm đó.",
        isCorrect: false,
        points: 0,
        analysis: "Vi phạm pháp luật nghiêm trọng! Bạo lực không giải quyết được vấn đề mà sẽ khiến bạn bị kỷ luật hoặc vướng vào lao lý.",
      },
      {
        text: "Báo ngay với Thầy Cô Tổng Phụ Trách hoặc gửi thông tin vào Hộp Thư Tố Giác Ẩn Danh của trường.",
        isCorrect: true,
        points: 40,
        analysis: "Hoàn hảo! Đây là Bước 4 (Báo cáo người lớn & tố giác an toàn). Hộp thư ẩn danh bảo mật 100% giúp Ban Giám Hiệu và Công an phối hợp dẹp bỏ dứt điểm ổ nhóm dụ dỗ!",
      },
    ],
  },
];

interface Props {
  soundEnabled: boolean;
  onAddScore: (points: number) => void;
  onNextGame: () => void;
}

export default function ScenarioGame({ soundEnabled, onAddScore, onNextGame }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleChoice = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);

    const step = SCENARIO_STORY[stepIndex];
    const choice = step.options[optionIdx];

    if (choice.isCorrect) {
      playTone("success", soundEnabled);
      setScore((s) => s + choice.points);
      onAddScore(choice.points);
    } else {
      playTone("fail", soundEnabled);
      setScore((s) => s + choice.points);
      onAddScore(choice.points);
    }
  };

  const handleNext = () => {
    playTone("click", soundEnabled);
    if (stepIndex + 1 < SCENARIO_STORY.length) {
      setStepIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setCompleted(true);
      playTone("win", soundEnabled);
    }
  };

  const resetGame = () => {
    setStepIndex(0);
    setScore(0);
    setSelectedOption(null);
    setCompleted(false);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#1e3a8a] uppercase flex items-center gap-2">
            <span>🥋 Đấu Trí Tình Huống: 4 Bước Từ Chối Vàng</span>
          </h2>
          <p className="text-xs text-slate-500">
            Nhập vai xử lý các tình huống cạm bẫy có thật ngoài đời thực. Đưa ra quyết định sáng suốt để bảo vệ chính mình!
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold shrink-0">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full">
            <span>Ải {stepIndex + 1} / {SCENARIO_STORY.length}</span>
          </div>
          <div className="bg-sky-50 text-[#0284c7] border border-sky-200 px-3.5 py-1.5 rounded-full">
            <span>Điểm: <b className="text-sm font-black">{score}</b></span>
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-4">
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white shadow-2xs shrink-0">
              {SCENARIO_STORY[stepIndex].illustration}
            </span>
            <div className="space-y-1">
              <h3 className="font-black text-sm text-[#1e3a8a] uppercase tracking-wide">
                {SCENARIO_STORY[stepIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {SCENARIO_STORY[stepIndex].context}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Bạn chọn hành động nào?
            </p>
            {SCENARIO_STORY[stepIndex].options.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleChoice(oIdx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all text-xs font-medium leading-relaxed flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? opt.isCorrect
                        ? "bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm"
                        : "bg-rose-50 border-rose-400 text-rose-900 shadow-sm"
                      : selectedOption !== null
                      ? "bg-slate-50/50 border-slate-200/60 text-slate-400"
                      : "bg-white hover:bg-slate-50 border-slate-200 hover:border-sky-300 text-slate-700 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[11px] text-slate-600 shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && (
                    <span className="shrink-0 font-bold text-xs">
                      {opt.isCorrect ? "✅ +40đ" : "❌ Chưa chuẩn"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in slide-in-from-top-2 duration-150 ${
              SCENARIO_STORY[stepIndex].options[selectedOption].isCorrect
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                : "bg-rose-50/90 border-rose-200 text-rose-900"
            }`}>
              <p className="font-extrabold uppercase mb-1 flex items-center gap-1.5">
                <span>💡 Phân Tích Kỹ Năng Tự Vệ:</span>
              </p>
              <p>{SCENARIO_STORY[stepIndex].options[selectedOption].analysis}</p>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Tiếp Tục Ải Kế Tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">
            Hoàn Thành Toàn Bộ 3 Ải Tình Huống!
          </h3>
          <p className="text-xs text-emerald-800 max-w-lg mx-auto leading-relaxed">
            Xuất sắc! Bạn đã vượt qua tất cả các bài thử thách tâm lý và nắm vững <b>Quy trình 4 Bước Từ Chối Vàng</b> (+120 Điểm Danh Dự)!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetGame}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              Luyện Lại Tình Huống
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

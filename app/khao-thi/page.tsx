"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CertificateModal from "@/components/CertificateModal";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  Award,
  Bot,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  ShieldAlert,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
  explanation: string;
}

interface QuizItem {
  id: string;
  scenario_title: string;
  scenario_story: string;
  image_webp_url?: string;
  options: QuizOption[];
  tip_trang_ti: string;
  category: string;
  order_index: number;
}

const FALLBACK_QUESTIONS: QuizItem[] = [
  {
    id: "f1",
    scenario_title: "Ải 1: Bẫy ngọt ngào ở quán trà sữa",
    scenario_story: "Trong buổi liên hoan sinh nhật tại quán trà sữa gần trường, anh khóa trên đưa cho em một chiếc Pod sặc sỡ mùi kẹo đào bảo: 'Hút một hơi cho thơm miệng và tỉnh táo học bài, người lớn ai cũng hút, sợ gì như con nít thế?'. Cả nhóm đang nhìn em cười. Em sẽ làm gì?",
    image_webp_url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
    options: [
      { id: "A", text: "Hút thử 1 hơi thật nhẹ cho đỡ bị quê với bạn bè.", is_correct: false, explanation: "Sai lầm nguy hiểm! Pod Chill chứa ma túy tổng hợp cực độc, chỉ 1 hơi có thể gây co giật, loạn thần và nghiện tức thì." },
      { id: "B", text: "Quát to 'Đồ ma túy!' rồi hất đổ ly nước của anh ấy.", is_correct: false, explanation: "Sai lầm! Hành vi kích động dễ dẫn tới ẩu đả, bị chặn đánh sau khi tan tiệc." },
      { id: "C", text: "Áp dụng Kế Hoãn Binh: Ho sặc sụa 'Em bị hen suyễn nặng ngửi khói là ngất ngay!', rồi xin phép ra về và báo người lớn.", is_correct: true, explanation: "Chính xác tuyệt đối! Kế hoãn binh vừa bảo toàn thân thể, vừa không khiêu khích đối phương, sau đó rút lui an toàn." }
    ],
    tip_trang_ti: "Hay lắm bạn nhỏ! Lấy cớ sức khỏe là chiếc khiên mềm dẻo nhưng vững chắc nhất để từ chối mọi lời ép uổng!",
    category: "refusal",
    order_index: 1
  },
  {
    id: "f2",
    scenario_title: "Ải 2: Cốc nước kỳ lạ màu hồng cam",
    scenario_story: "Đi chơi nhà bạn, bạn của bạn mở một gói bột có chữ 'Chali' pha vào cốc nước cam sủi bọt thơm lừng, bảo đây là 'nước tăng lực nhập khẩu uống vào quẩy cực sung'. Em thấy màu nước hơi đục và có mùi thơm hắc lạ. Em xử lý thế nào?",
    image_webp_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    options: [
      { id: "A", text: "Uống thử nửa cốc xem có sung thật không rồi tính tiếp.", is_correct: false, explanation: "Cực kỳ nguy hiểm! 'Nước vui' chứa Ketamine và Ecstasy, làm tê liệt ý thức và trụy tim mạch." },
      { id: "B", text: "Nhận lấy cốc, giả vờ nhấp môi không nuốt, chờ lúc không ai để ý đổ vào chậu cây rồi tìm cớ về sớm.", is_correct: true, explanation: "Chuẩn xác! Giữ được hòa khí, không bị nghi ngờ ép uống, và nhanh chóng thoát hiểm." },
      { id: "C", text: "Uống một ngụm rồi chia cho bạn thân uống cùng cho vui.", is_correct: false, explanation: "Sai hoàn toàn! Vừa tự hại mình vừa lôi kéo bạn bè vào vòng nguy hiểm." }
    ],
    tip_trang_ti: "Nhớ kỹ khẩu quyết: Bất kỳ đồ uống nào đã mở nắp hoặc do người khác pha sẵn ở chỗ đông người, tuyệt đối không được đưa vào miệng!",
    category: "identify",
    order_index: 2
  },
  {
    id: "f3",
    scenario_title: "Ải 3: Món quà ăn vặt bí ẩn trước cổng trường",
    scenario_story: "Giờ tan học, một người lạ mặt dừng xe máy mời chào: 'Chú có loại kẹo dẻo hình gấu vị dâu Tây ngon lắm, phát miễn phí cho học sinh ngoan ăn thử để quảng cáo!'. Em thấy trên bao bì có in hình chiếc lá gai nhọn 7 cánh và chữ nhỏ 'THC'. Em sẽ:",
    image_webp_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    options: [
      { id: "A", text: "Thấy phát miễn phí nên nhận ngay vài gói chia cho cả lớp ăn cùng.", is_correct: false, explanation: "Rất nguy hại! Đây là kẹo tẩm cần sa (THC), kẻ xấu thường phát miễn phí để tạo con nghiện học đường." },
      { id: "B", text: "Lắc đầu dứt khoát: 'Cháu không lấy!', bước nhanh vào trong trường và báo ngay cho bác bảo vệ.", is_correct: true, explanation: "Xuất sắc! Lắc đầu dứt khoát, di chuyển vào nơi an toàn và báo ngay cho lực lượng chức năng của trường." },
      { id: "C", text: "Cầm lấy rồi đem về giấu vào cặp sách xem sau.", is_correct: false, explanation: "Không an toàn! Để đồ lạ trong cặp có nguy cơ lỡ miệng ăn phải hoặc bị kẻ xấu đổ tội." }
    ],
    tip_trang_ti: "Bách Thảo Trấn Ma ghi rõ: Miếng pho-mát miễn phí chỉ có trên bẫy chuột! Đồ ăn vặt không rõ nguồn gốc trước cổng trường là cạm bẫy chết người!",
    category: "identify",
    order_index: 3
  },
  {
    id: "f4",
    scenario_title: "Ải 4: Áp lực nhóm: 'Không hút là không phải anh em'",
    scenario_story: "Trong nhà vệ sinh trường, một nhóm bạn cùng khối chặn em lại, đưa điếu thuốc lá điện tử và dọa: 'Mày phải làm một hơi thì mới được vào nhóm, nếu không từ mai cả khối sẽ tẩy chay và không ai chơi với mày!'. Em chọn cách nào?",
    image_webp_url: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80",
    options: [
      { id: "A", text: "Sợ bị tẩy chay nên đành nhắm mắt hút một hơi cho xong chuyện.", is_correct: false, explanation: "Sai lầm! Nhượng bộ một lần sẽ bị ép buộc vô số lần sau, trở thành nạn nhân bị tống tiền và nghiện ngập." },
      { id: "B", text: "Đánh lại cả nhóm để thể hiện mình không sợ ai.", is_correct: false, explanation: "Nguy hiểm! Một mình đối đầu với đám đông dễ dẫn tới chấn thương nặng." },
      { id: "C", text: "Bình tĩnh nhìn thẳng: 'Tớ không thích hút, việc chơi hay không là tùy các cậu!', lập tức đi ra ngoài chỗ đông người và báo kín cho thầy cô.", is_correct: true, explanation: "Bản lĩnh đích thực! Bạn bè chân chính không bao giờ ép nhau hủy hoại tương lai. Tố giác kín giúp giải quyết tận gốc." }
    ],
    tip_trang_ti: "Kẻ ép con vào con đường nghiệt ngã không phải là bạn, mà là quỷ dữ đội lốt bạn bè! Hãy dũng cảm quay lưng và tìm sự che chở của thầy cô!",
    category: "refusal",
    order_index: 4
  },
  {
    id: "f5",
    scenario_title: "Ải 5: Nhờ chuyển gói hàng kín với tiền công 500k",
    scenario_story: "Một người quen trên mạng xã hội nhắn tin: 'Em cầm giúp anh hộp trà bọc băng dính đen này giao cho một anh đứng ở cột đèn ngã tư, xong việc anh bắn cho 500k tiền nạp game! Cứ để trong balo, ai hỏi bảo đồ dùng học tập'. Em xử lý sao?",
    image_webp_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    options: [
      { id: "A", text: "Thấy việc nhẹ lương cao kiếm 500k dễ dàng nên nhận lời đi giao ngay.", is_correct: false, explanation: "Hậu quả khôn lường! Vận chuyển ma túy dù chỉ 'cầm hộ' vẫn bị truy cứu trách nhiệm hình sự rất nặng, có thể đi tù." },
      { id: "B", text: "Mở gói hàng ra xem bên trong có gì, nếu là ma túy mới từ chối.", is_correct: false, explanation: "Không nên! Chạm vào gói hàng có thể dính dấu vân tay, biến em thành đồng phạm." },
      { id: "C", text: "Tuyệt đối từ chối: 'Em bận học không nhận ship hộ đồ!', chụp màn hình tin nhắn và báo cho cha mẹ/thầy cô.", is_correct: true, explanation: "Sáng suốt phi thường! Kẻ buôn ma túy rất hay lợi dụng học sinh ngây thơ để làm người vận chuyển. Chặn đứng ngay từ đầu!" }
    ],
    tip_trang_ti: "Luật pháp Đại Việt rất nghiêm minh: Cầm hộ, giữ hộ hay mang hộ ma túy đều là phạm tội! Đừng vì vài đồng tiền tiêu vặt mà đánh đổi cả cuộc đời!",
    category: "law",
    order_index: 5
  }
];

export default function KhaoThiPage() {
  const [questions, setQuestions] = useState<QuizItem[]>(FALLBACK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Tải câu hỏi từ Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("quiz_questions")
          .select("*")
          .order("order_index", { ascending: true });

        if (data && data.length > 0) {
          const parsed = data.map((item) => ({
            ...item,
            options: typeof item.options === "string" ? JSON.parse(item.options) : item.options,
          }));
          setQuestions(parsed);
        }
      } catch (err) {
        console.warn("Dùng danh sách câu hỏi dự phòng:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const chosen = currentQ.options.find((o) => o.id === optionId);
    if (chosen?.is_correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextStage = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      setIsCompleted(true);
      setShowCertificate(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setShowCertificate(false);
  };

  const chosenOption = currentQ?.options?.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* HEADER HIỆN ĐẠI ĐỒNG BỘ TRANG CHỦ */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-bold text-rose-700">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Trắc nghiệm tình huống tương tác</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent tracking-tight uppercase">
              Thử Thách Đấu Trí Phòng Vệ Học Đường
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Nhập vai 5 tình huống thực tế thường gặp chốn học đường — Vượt qua cạm bẫy để nhận Giấy Chứng Nhận Đại Sứ Tuyên Truyền Viên!
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2.5 text-xs text-rose-700 font-bold shrink-0 self-start sm:self-auto flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>5 ẢI TÌNH HUỐNG THỰC TẾ</span>
          </div>
        </div>

        {/* BẢN ĐỒ TIẾN TRÌNH 5 ẢI (MODERN STEPPER) */}
        <div className="pt-5">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {questions.map((q, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div key={q.id || idx} className="flex-1 min-w-[70px] flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    isPast
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                      : isCurrent
                      ? "bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white ring-4 ring-rose-100 scale-110 shadow-md"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}>
                    {isPast ? "✓" : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold mt-1.5 text-center truncate max-w-full ${
                    isCurrent ? "text-rose-600" : isPast ? "text-emerald-700" : "text-slate-400"
                  }`}>
                    Ải {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* KHUNG NỘI DUNG ẢI HIỆN TẠI */}
      {!isCompleted && currentQ && (
        <section className="bg-white border border-rose-100/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
          
          {/* TIÊU ĐỀ ẢI & ĐIỂM SỐ */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-700 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Ải số {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/80">
                Điểm tích lũy: <strong>{score}</strong> / {questions.length}
              </span>
            </div>

            <h2 className="font-extrabold text-base sm:text-xl text-slate-900 leading-snug">
              {currentQ.scenario_title}
            </h2>

            {/* BỐI CẢNH TÌNH HUỐNG & ẢNH */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
              {currentQ.image_webp_url && (
                <div className="md:col-span-4 aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <ImageWithFallback
                    src={currentQ.image_webp_url}
                    alt={currentQ.scenario_title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`${currentQ.image_webp_url ? "md:col-span-8" : "md:col-span-12"} space-y-2`}>
                <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wide flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Bối Cảnh Tình Huống:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  "{currentQ.scenario_story}"
                </p>
                <p className="text-xs font-bold text-rose-600 pt-1">
                  ❓ Nếu em là người trong cuộc, em sẽ xử trí như thế nào?
                </p>
              </div>
            </div>
          </div>

          {/* DANH SÁCH LỰA CHỌN ĐÁP ÁN */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              Chọn phương án hành động của em:
            </label>
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnClass = "bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-slate-800 shadow-xs";

                if (hasAnswered) {
                  if (opt.is_correct) {
                    btnClass = "bg-emerald-50 border-2 border-emerald-500 text-emerald-900 shadow-sm";
                  } else if (isSelected && !opt.is_correct) {
                    btnClass = "bg-rose-50 border-2 border-rose-500 text-rose-900 shadow-sm";
                  } else {
                    btnClass = "bg-slate-50 border border-slate-200 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${btnClass}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                      hasAnswered && opt.is_correct
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : hasAnswered && isSelected && !opt.is_correct
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-slate-100 text-slate-700 border-slate-200"
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

          {/* KHUNG PHÂN TÍCH CỦA CỐ VẤN AI SAU KHI TRẢ LỜI */}
          {hasAnswered && chosenOption && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-3 duration-300 space-y-4">
              <div className={`p-4 sm:p-5 rounded-2xl border ${
                chosenOption.is_correct
                  ? "bg-emerald-50/90 border-emerald-200"
                  : "bg-rose-50/90 border-rose-200"
              } space-y-3`}>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-rose-200 shrink-0 shadow-xs flex items-center justify-center">
                    <img
                      src="/trolyai.png"
                      alt="Cố Vấn AI Học Đường"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">
                        Cố Vấn AI Phân Tích:
                      </span>
                      {chosenOption.is_correct ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> XỬ TRÍ CHUẨN XÁC!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> CẠM BẪY NGUY HIỂM!
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {chosenOption.explanation}
                    </p>
                    <p className="text-xs font-bold text-rose-600 pt-1">
                      💡 Lời Khuyên Cố Vấn: "{currentQ.tip_trang_ti}"
                    </p>
                  </div>
                </div>

              </div>

              {/* NÚT TIẾP TỤC VƯỢT ẢI TIẾP THEO */}
              <button
                onClick={handleNextStage}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{currentIndex < questions.length - 1 ? `Tiếp Tục Tiến Vào Ải ${currentIndex + 2}` : "Xem Kết Quả & Nhận Giấy Chứng Nhận"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </section>
      )}

      {/* KHI ĐÃ HOÀN THÀNH TOÀN BỘ 5 ẢI */}
      {isCompleted && (
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-3xl flex items-center justify-center mx-auto shadow-sm ring-8 ring-amber-50">
            🏆
          </div>

          <div className="space-y-2">
            <span className="text-xs px-3 py-1 rounded-full font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
              HOÀN THÀNH THỬ THÁCH
            </span>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-slate-900">
              Chúc Mừng Em Đã Vượt Qua 5 Ải Tình Huống!
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Em đã thể hiện bản lĩnh tuyệt vời và nắm chắc các kỹ năng phòng chống ma túy học đường với kết quả: <strong>{score}/{questions.length}</strong> câu trả lời đúng.
            </p>
          </div>

          {/* NÚT MỞ BẰNG KHEN */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-white" />
              <span>Mở & Tải Giấy Chứng Nhận Đại Sứ</span>
            </button>

            <button
              onClick={handleRestart}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Làm Lại Thử Thách</span>
            </button>
          </div>
        </section>
      )}

      {/* POPUP GIẤY CHỨNG NHẬN ĐẠI SỨ */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        score={score}
        total={questions.length}
      />

    </div>
  );
}

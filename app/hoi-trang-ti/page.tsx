"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, Trash2, PhoneCall, ShieldAlert, Bot, AlertTriangle, ShieldCheck } from "lucide-react";
import { checkContentSafety, REFUSAL_INAPPROPRIATE_MESSAGE } from "@/lib/contentGuardrails";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

export default function HoiTrangTiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn nhé! Ta là Trợ lý Cố Vấn của 'Trường Học Không Ma Túy'. Nếu bạn vừa thấy thứ gì lạ mắt quanh trường, băn khoăn về pod chill, nước vui hay lo âu khi bị bạn bè rủ rê, chớ ngần ngại nhắn cho Ta! Mọi chia sẻ đều ẩn danh và bảo mật 100%.",
      suggestions: [
        "Cách nhận biết pod chill ngụy trang cây bút?",
        "4 bước từ chối vàng khi bị bạn bè rủ rê?",
        "Nước vui là gì và nguy hiểm như thế nào?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rateLimitWarning, setRateLimitWarning] = useState<string | null>(null);
  const [safetyWarning, setSafetyWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const quickQuestions = [
    "Bạn cùng lớp rủ hút thử pod thơm, từ chối sao khéo?",
    "Nước vui là gì và nguy hiểm như thế nào?",
    "Bị anh khóa trên ép cầm hộ gói đồ lạ, em phải làm gì?",
    "Lỡ thử một hơi pod chill có bị nghiện không?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, statusMessage]);

  // Hủy bộ đếm nhả chữ khi component bị unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, []);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || isLoading) return;

    setSafetyWarning(null);

    // 1. LÁ CHẮN AN TOÀN HỌC ĐƯỜNG: CHẶN TỪ NGỮ THÔ TỤC, PHẢN CẢM, CHẾ TẠO MA TÚY
    const safetyCheck = checkContentSafety(textToSend.trim());
    if (!safetyCheck.isSafe) {
      setSafetyWarning(safetyCheck.reason || "Lời nhắn chứa từ ngữ không phù hợp với chuẩn mực học đường.");
      
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: textToSend.trim(),
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: safetyCheck.feedbackMessage || REFUSAL_INAPPROPRIATE_MESSAGE,
        suggestions: [
          "Pod chill ngụy trang cây bút nguy hiểm thế nào?",
          "4 bước từ chối vàng khi bị bạn bè rủ rê?",
          "Tổng đài 111 và 113 hỗ trợ học sinh bí mật ra sao?"
        ]
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      if (!questionText) setInput("");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!questionText) setInput("");
    setIsLoading(true);
    setStatusMessage("Trạng Tí đang phân tích tình huống...");
    setRateLimitWarning(null);

    const assistantMsgId = (Date.now() + 1).toString();
    // Tạo sẵn bong bóng tin nhắn của Assistant
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
      },
    ]);

    // Hủy timer cũ nếu còn đang chạy
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    let targetFullText = "";
    let displayedText = "";
    let isStreamDone = false;
    let pendingSuggestions: string[] = [];

    // KHỞI ĐỘNG HÀNG ĐỢI NHẢ CHỮ ĐIỀM ĐẠM, TỰ NHIÊN (SMOOTH TYPEWRITER TICKER)
    // Rung nhịp mỗi 38ms: nhả từng 1 ký tự từ tốn, chỉ tăng nhẹ khi dồn quá nhiều chữ
    typingTimerRef.current = setInterval(() => {
      if (displayedText.length < targetFullText.length) {
        const backlog = targetFullText.length - displayedText.length;
        // Tốc độ nhả chữ được điều chỉnh chậm rãi, dễ tiếp thu cho học sinh
        const step = backlog > 350 ? 3 : backlog > 150 ? 2 : 1;
        displayedText = targetFullText.slice(0, displayedText.length + step);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: displayedText + " ▌" }
              : m
          )
        );
      } else if (isStreamDone) {
        // Stream đã kết thúc và toàn bộ văn bản đã nhả hết -> Hoàn tất hiển thị
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: targetFullText, suggestions: pendingSuggestions }
              : m
          )
        );
        setIsLoading(false);
        setStatusMessage(null);
      }
    }, 38);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      // Xử lý khi bị Rate Limit (429)
      if (res.status === 429) {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
        const errorData = await res.json();
        const warn = errorData.error || "Bạn nhắn hơi nhanh, vui lòng nghỉ ngơi ít giây nhé!";
        setRateLimitWarning(warn);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: warn } : m
          )
        );
        setIsLoading(false);
        setStatusMessage(null);
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error("Không thể kết nối với Cố Vấn");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          try {
            const data = JSON.parse(trimmed.slice(5).trim());

            if (data.type === "status") {
              setStatusMessage(data.message);
            } else if (data.type === "content") {
              // Ẩn thanh trạng thái khi nội dung bắt đầu vào
              setStatusMessage(null);
              // Nạp vào bộ đệm đích (targetFullText), để ticker nhả ra từ từ
              targetFullText += data.chunk;
            } else if (data.type === "suggestions") {
              pendingSuggestions = data.items || [];
            }
          } catch (parseErr) {
            // bỏ qua dòng JSON đang dở
          }
        }
      }

      // Đánh dấu luồng stream từ server đã hoàn tất
      isStreamDone = true;
    } catch (err: any) {
      console.error(err);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  "Trạng Tí tạm thời chưa kịp đối đáp vì gián đoạn mạng. Bạn ơi chớ lo, nếu gặp nguy hiểm cận kề, hãy bấm ngay nút Cứu Viện 111 phía trên để được các cô chú hỗ trợ ngay nhé!",
              }
            : m
        )
      );
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  const handleClear = () => {
    if (confirm("Bạn có muốn xóa toàn bộ cuộc trò chuyện này để giữ trọn bí mật?")) {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      setIsLoading(false);
      setStatusMessage(null);
      setMessages([
        {
          id: "welcome-reset",
          role: "assistant",
          content: "Đã làm sạch lịch sử cuộc trò chuyện! Bạn cứ việc đặt câu hỏi mới khi cần lời khuyên nhé.",
          suggestions: [
            "Cách nhận biết pod chill ngụy trang cây bút?",
            "4 bước từ chối vàng khi bị bạn bè rủ rê?",
            "Nước vui là gì và nguy hiểm như thế nào?",
          ],
        },
      ]);
      setRateLimitWarning(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      
      {/* HEADER CỐ VẤN AI HIỆN ĐẠI ĐỒNG BỘ */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-sky-200 shadow-md shadow-sky-500/20 shrink-0 flex items-center justify-center p-0.5">
            <img
              src="/trolyai.png"
              alt="Trợ Lý Cố Vấn"
              className="w-full h-full object-cover object-center rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-[#1e3a8a] uppercase tracking-wide">
                Trợ Lý Cố Vấn Học Đường
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 text-[#0284c7]">
                ẨN DANH 100%
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 hidden sm:inline">
                ● Trực Tuyến 24/7
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 hidden md:inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                Lá chắn văn minh
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lắng nghe tâm tư • Chỉ dạy kế sách thoát hiểm • Không phán xét
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors"
            title="Xóa cuộc trò chuyện để giữ bí mật"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xóa dấu vết</span>
          </button>
        </div>
      </div>

      {/* CẢNH BÁO BẢO VỆ KHẨN CẤP */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Nếu bạn đang bị đe dọa vũ lực hoặc bị ép sử dụng ngay lúc này, hãy gọi ngay:
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:111"
            className="font-extrabold text-rose-600 hover:underline flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" /> 111 (Trẻ em)
          </a>
          <span>•</span>
          <a
            href="tel:113"
            className="font-extrabold text-[#0284c7] hover:underline flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" /> 113 (Công an)
          </a>
        </div>
      </div>

      {/* CẢNH BÁO RATE LIMIT NẾU CÓ */}
      {rateLimitWarning && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{rateLimitWarning}</span>
        </div>
      )}

      {/* KHUNG HỘI THOẠI TRÒ CHUYỆN */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-sm min-h-[480px] max-h-[600px] flex flex-col justify-between">
        
        {/* NỘI DUNG DANH SÁCH TIN NHẮN */}
        <div className="overflow-y-auto space-y-4 pr-1 mb-4 flex-1">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-sky-200 shrink-0 shadow-xs mt-0.5 flex items-center justify-center">
                    <img
                      src="/trolyai.png"
                      alt="Trợ Lý AI"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white rounded-tr-none shadow-md shadow-sky-500/20"
                      : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none shadow-2xs"
                  }`}
                >
                  <p className="whitespace-pre-line font-normal">{msg.content}</p>

                  {/* 3 NÚT GỢI Ý CÂU HỎI TIẾP THEO (FOLLOW-UP SUGGESTIONS) */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Gợi ý tìm hiểu thêm:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSend(sug)}
                            disabled={isLoading}
                            className="text-[11px] bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] border border-slate-200 hover:border-sky-300 px-3 py-1.5 rounded-full font-medium transition-all shadow-2xs hover:shadow-xs active:scale-95 text-left flex items-center gap-1.5 group cursor-pointer"
                          >
                            <span>{sug}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#0284c7] font-bold">
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* THANH TRẠNG THÁI SUY NGHĨ ĐỘNG (REASONING & THINKING PHASE) */}
          {isLoading && statusMessage && (
            <div className="flex gap-3 justify-start items-center animate-in fade-in duration-300">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-sky-200 shrink-0 shadow-xs animate-pulse flex items-center justify-center">
                <img
                  src="/trolyai.png"
                  alt="Trợ Lý AI"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="bg-sky-50/90 border border-sky-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-sky-900 flex items-center gap-2.5 shadow-2xs">
                <div className="w-3.5 h-3.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold">{statusMessage}</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-sky-500 rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* GỢI Ý CÂU HỎI THƯỜNG GẶP BAN ĐẦU */}
        <div className="border-t border-slate-100 pt-3 pb-2 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#0284c7]" /> Câu hỏi học sinh thường gặp:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-[11px] bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] border border-slate-200 hover:border-sky-200 px-3 py-1 rounded-full font-medium transition-all shadow-2xs cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* CẢNH BÁO LÁ CHẮN AN TOÀN NỘI DUNG */}
        {safetyWarning && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-2 animate-in fade-in duration-200 shadow-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{safetyWarning}</span>
          </div>
        )}

        {/* KHUNG NHẬP TIN NHẮN */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 pt-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (safetyWarning) setSafetyWarning(null);
            }}
            placeholder="Bạn có điều gì băn khoăn về ma túy, khói lạ, bị rủ rê? Nhắn cho Ta nhé..."
            disabled={isLoading}
            className="flex-1 bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-[#0284c7] rounded-2xl px-4 py-2.5 text-xs sm:text-sm focus:outline-hidden transition-all shadow-2xs disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-[#0284c7] to-[#1e40af] hover:from-[#0369a1] hover:to-[#1e3a8a] text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md shadow-sky-500/25 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi câu hỏi</span>
          </button>
        </form>

      </div>

    </div>
  );
}

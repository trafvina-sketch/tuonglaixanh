"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Send, X, Maximize2, Sparkles, ShieldAlert, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

export default function FloatingTrangTiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-float",
      role: "assistant",
      content:
        "Chào bạn nhé! Ta là Trợ lý AI Cố Vấn. Nếu bạn thấy điều gì lạ mắt hoặc băn khoăn về ma túy, thuốc lá điện tử, chớ ngại nhắn cho Ta nhé! Hoàn toàn ẩn danh 100%.",
      suggestions: [
        "Cách từ chối khi bị ép hút pod chill?",
        "Nước vui là gì và tác hại ra sao?",
        "Bị đe dọa thì tìm ai giúp an toàn?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [rateLimitWarning, setRateLimitWarning] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading, statusMessage]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, []);

  // Tự động ẩn widget nếu người dùng đang ở chính trang /hoi-trang-ti (luôn đặt sau tất cả hooks)
  if (pathname === "/hoi-trang-ti") {
    return null;
  }

  const handleSend = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend.trim(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!text) setInput("");
    setIsLoading(true);
    setStatusMessage("Trạng Tí đang phân tích tình huống...");
    setRateLimitWarning(null);

    const assistantMsgId = (Date.now() + 1).toString();
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
        throw new Error("Lỗi kết nối");
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
              setStatusMessage(null);
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
    } catch (err) {
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
                  "Trạng Tí đang trầm ngâm suy nghĩ do mạng gián đoạn. Bạn ơi nếu gặp chuyện khẩn cấp hãy gọi ngay SOS 111 nhé!",
              }
            : m
        )
      );
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50">
      
      {/* POPUP CHAT MINI */}
      {isOpen && (
        <div className="w-[330px] sm:w-[380px] h-[480px] sm:h-[520px] bg-white border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* HEADER POPUP HIỆN ĐẠI */}
          <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 text-white p-3.5 border-b border-indigo-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-cyan-200 shadow-xs shrink-0 flex items-center justify-center">
                <img
                  src="/trolyai.png"
                  alt="Trợ Lý AI"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs uppercase tracking-wide text-white">
                    Trợ Lý Cố Vấn AI
                  </h4>
                  <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-900">
                    ẨN DANH
                  </span>
                </div>
                <p className="text-[9px] text-sky-100 font-medium">Bảo vệ học đường • Luôn bên bạn</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* NÚT PHÓNG TO TOÀN TRANG */}
              <Link
                href="/hoi-trang-ti"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                title="Phóng to toàn trang đàm đạo"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
              {/* NÚT THU NHỎ / ĐÓNG */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Thu nhỏ cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CẢNH BÁO RATE LIMIT NẾU CÓ */}
          {rateLimitWarning && (
            <div className="p-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-[10px] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{rateLimitWarning}</span>
            </div>
          )}

          {/* DANH SÁCH TIN NHẮN */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white border border-sky-200 shrink-0 shadow-2xs mt-0.5 flex items-center justify-center">
                    <img
                      src="/trolyai.png"
                      alt="Trợ Lý AI"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-line break-words text-xs ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white rounded-tr-xs shadow-xs"
                      : "bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-2xs"
                  }`}
                >
                  <p>{m.content}</p>

                  {/* 3 NÚT GỢI Ý TIẾP THEO TRONG POPUP */}
                  {m.role === "assistant" && m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Gợi ý hỏi tiếp:
                      </p>
                      <div className="flex flex-col gap-1">
                        {m.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSend(sug)}
                            disabled={isLoading}
                            className="text-[10px] bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] border border-slate-200 hover:border-sky-200 p-1.5 rounded-xl font-medium transition-all text-left flex items-center justify-between group cursor-pointer"
                          >
                            <span className="truncate">{sug}</span>
                            <span className="text-slate-400 group-hover:text-[#0284c7] shrink-0 font-bold ml-1">
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* THANH TRẠNG THÁI SUY LUẬN TRONG POPUP */}
            {isLoading && statusMessage && (
              <div className="flex items-center gap-2 text-[11px] text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl animate-in fade-in">
                <div className="w-3 h-3 border-2 border-sky-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-semibold text-[10px] truncate">{statusMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* KHUNG NHẬP TIN NHẮN */}
          <div className="p-2.5 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Bạn có câu hỏi gì về ma túy, pod chill?..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0284c7] rounded-xl px-3 py-2 text-xs focus:outline-hidden transition-colors disabled:opacity-60"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white p-2 rounded-xl shadow-xs disabled:opacity-50 transition-colors cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* NÚT BẤM NỔI HIỆN ĐẠI (FLOATING TRIGGER BUTTON) */}
      {!isOpen && (
        <div className="relative group">
          {/* Bong bóng gợi mở nhấp nháy */}
          <div className="hidden sm:block absolute -top-11 right-0 bg-white text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-2xl border border-slate-200 shadow-md whitespace-nowrap animate-bounce pointer-events-none flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full overflow-hidden inline-block shrink-0 bg-sky-50 border border-sky-200">
              <img src="/trolyai.png" alt="Trợ lý AI" className="w-full h-full object-cover object-center" />
            </span>
            <span>Cần tư vấn bí mật không bạn ơi?</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[2.5px] shadow-2xl shadow-indigo-500/35 hover:shadow-cyan-500/45 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer relative overflow-hidden group"
            title="Trò chuyện ẩn danh cùng Trợ lý Cố Vấn AI"
          >
            <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
              <img
                src="/trolyai.png"
                alt="Trợ Lý Cố Vấn AI"
                className="w-full h-full object-cover object-center rounded-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse z-10" />
          </button>
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Share2, Check, Copy, Facebook, Printer, Type } from "lucide-react";

interface ArticleInteractionsProps {
  title: string;
  url?: string;
  onFontChange?: (size: "normal" | "large" | "xlarge") => void;
}

export default function ArticleInteractions({ title, url }: ArticleInteractionsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "";
  };

  const handleCopyLink = () => {
    const link = getShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleShareFacebook = () => {
    const link = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`, "_blank", "width=600,height=400");
  };

  const handleShareZalo = () => {
    const link = encodeURIComponent(getShareUrl());
    window.open(`https://zalo.me/share?url=${link}`, "_blank", "width=600,height=400");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-[#0284c7]" />
          <span>Chia sẻ bài học:</span>
        </span>

        {/* Nút Sao Chép Link */}
        <button
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            copied
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : "bg-white text-slate-700 border-slate-200 hover:border-[#0284c7] hover:text-[#0284c7]"
          }`}
          title="Sao chép liên kết bài viết"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã sao chép!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* Nút Chia sẻ Facebook */}
        <button
          onClick={handleShareFacebook}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all border border-[#1877F2]/20"
          title="Chia sẻ lên Facebook"
        >
          <Facebook className="w-3.5 h-3.5 fill-current" />
          <span>Facebook</span>
        </button>

        {/* Nút Chia sẻ Zalo */}
        <button
          onClick={handleShareZalo}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0068FF]/10 text-[#0068FF] hover:bg-[#0068FF] hover:text-white transition-all border border-[#0068FF]/20"
          title="Chia sẻ qua Zalo"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[9px] font-black">Z</span>
          <span>Zalo</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Nút In ấn bài viết */}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-all"
          title="In bài viết ra giấy"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>In bài viết</span>
        </button>
      </div>
    </div>
  );
}

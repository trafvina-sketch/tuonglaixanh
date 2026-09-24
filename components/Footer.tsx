"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PhoneCall, ShieldAlert, HeartHandshake, ArrowRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const [copyrightText, setCopyrightText] = useState<string | null>(null);

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["site_logo_url", "footer_copyright_text"]);

        if (data) {
          data.forEach((item) => {
            if (item.key === "site_logo_url") setSiteLogo(item.value ? item.value.trim() : "");
            if (item.key === "footer_copyright_text") setCopyrightText(item.value ? item.value.trim() : "");
          });
        }
      } catch (err) {
        console.warn("Could not load footer settings:", err);
      }
    }
    loadFooterSettings();
  }, []);

  return (
    <footer className="bg-white/95 backdrop-blur-md border-t border-purple-100 mt-12 pb-16 md:pb-8 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-purple-50">
          
          {/* CỘT 1: THƯƠNG HIỆU HỌC ĐƯỜNG */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {siteLogo ? (
                <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-white border-2 border-purple-300 shadow-sm shrink-0">
                  <img
                    src={siteLogo}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-teal-400 text-white flex items-center justify-center shadow-xs shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-purple-800 tracking-tight uppercase leading-tight">
                  Vũ Trụ Kẹo Ngọt
                </h3>
                <p className="text-[11px] text-teal-600 font-semibold">
                  Trường Học Diệu Kỳ - Bảo Vệ Mầm Xanh
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cổng thông tin và giáo dục kỹ năng nhận diện, phòng chống tệ nạn học đường ngụy trang thế hệ mới dành riêng cho học sinh, thầy cô và phụ huynh học sinh.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[11px] font-bold text-purple-700">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Chung tay xây dựng thế giới học đường diệu kỳ, an toàn</span>
            </div>
          </div>

          {/* CỘT 2: ĐƯỜNG DÂY NÓNG CỨU TRỢ KHẨN CẤP */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-pink-600" />
              Đường Dây Nóng Khẩn Cấp (Miễn Cước 24/7)
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="tel:111"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-pink-50/80 hover:bg-pink-100 border border-pink-200 shadow-xs hover:-translate-y-0.5 transition-all group"
              >
                <div>
                  <span className="font-extrabold text-pink-700">Tổng đài Quốc Gia 111</span>
                  <p className="text-[10px] text-slate-500 font-medium">Bảo vệ trẻ em khỏi bị dụ dỗ, bạo lực & xâm hại</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-pink-600 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>

              <a
                href="tel:113"
                className="flex items-center justify-between p-2.5 rounded-2xl bg-teal-50/80 hover:bg-teal-100 border border-teal-200 shadow-xs hover:-translate-y-0.5 transition-all group"
              >
                <div>
                  <span className="font-extrabold text-teal-800">Cảnh sát 113</span>
                  <p className="text-[10px] text-slate-500 font-medium">Tố giác tội phạm mua bán, tàng trữ ma túy</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-teal-600 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          {/* CỘT 3: LIÊN KẾT NHANH */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-purple-500" />
              Cẩm Nang Học Đường
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/nhan-dien" className="hover:text-purple-600 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  <span>Nhận diện Ma Túy Ngụy Trang (Pod Chill, Nước Vui)</span>
                </Link>
              </li>
              <li>
                <Link href="/khao-thi" className="hover:text-purple-600 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  <span>Thử Thách Trắc Nghiệm Đấu Trí Tình Huống</span>
                </Link>
              </li>
              <li>
                <Link href="/tro-choi" className="hover:text-purple-600 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  <span>Đấu Trường Trò Chơi Học Đường (Vừa học vừa chơi)</span>
                </Link>
              </li>
              <li>
                <Link href="/video" className="hover:text-purple-600 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  <span>Thư viện Phóng sự & Phim Cảnh Báo (VTV / ANTV)</span>
                </Link>
              </li>
              <li>
                <Link href="/hoi-trang-ti" className="hover:text-purple-600 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  <span>Tâm sự bảo mật với Cố Vấn AI Học Đường</span>
                </Link>
              </li>
              <li>
                <Link href="/to-giac" className="text-pink-600 font-bold hover:underline transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 text-pink-500 group-hover:translate-x-0.5 transition-all" />
                  <span>Hộp thư mật tố giác ẩn danh 100%</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-500 font-medium">
          {copyrightText ? (
            <p>{copyrightText}</p>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Cùng nhau khám phá thế giới diệu kỳ - Chung tay vì học đường không ma túy</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-slate-400">
            <Link href="/" className="hover:text-purple-600">Trang chủ</Link>
            <span>•</span>
            <Link href="/tin-tuc" className="hover:text-purple-600">Bản tin</Link>
            <span>•</span>
            <Link href="/to-giac" className="hover:text-pink-600">Đường dây nóng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

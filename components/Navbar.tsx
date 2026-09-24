"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Video, 
  Newspaper, 
  HelpCircle, 
  Phone, 
  Search, 
  Bell, 
  Settings, 
  Menu, 
  X,
  ShieldAlert,
  Users,
  ShieldCheck,
  Gamepad2
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function loadLogo() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "site_logo_url")
          .single();
        if (data && data.value && data.value.trim()) {
          setSiteLogo(data.value.trim());
        } else {
          setSiteLogo("");
        }
      } catch {
        setSiteLogo("");
      }
    }
    loadLogo();
  }, []);

  const navLinks = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/nhan-dien", label: "Kiến thức", icon: BookOpen },
    { href: "/khao-thi", label: "Trắc nghiệm", icon: CheckSquare },
    { href: "/tro-choi", label: "Trò chơi", icon: Gamepad2 },
    { href: "/video", label: "Video", icon: Video },
    { href: "/tin-tuc", label: "Tin tức", icon: Newspaper },
    { href: "/hoi-trang-ti", label: "Tư vấn", icon: HelpCircle },
    { href: "/to-giac", label: "Liên hệ", icon: Phone },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* LOGO: VŨ TRỤ KẸO NGỌT */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              {siteLogo ? (
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-purple-500 via-pink-500 to-teal-400 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-all duration-300 shrink-0">
                  <img
                    src={siteLogo}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-all duration-300 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-purple-600 via-pink-600 to-teal-500 bg-clip-text text-transparent tracking-tight leading-tight group-hover:opacity-90 transition-opacity">
                  VŨ TRỤ KẸO NGỌT
                </span>
                <span className="text-[10px] sm:text-[11px] text-purple-500 font-medium">
                  Trường học diệu kỳ - Cùng bạn an toàn ✨
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION PILLS VŨ TRỤ KẸO NGỌT */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = isLinkActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 via-pink-500 to-teal-400 text-white shadow-md shadow-pink-500/25 scale-[1.02]"
                        : "text-slate-600 hover:text-purple-600 hover:bg-purple-50/80"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* TIỆN ÍCH BÊN PHẢI (SEARCH, NOTIFICATION, USER PROFILE, ADMIN) */}
            <div className="hidden lg:flex items-center gap-2.5">
              
              {/* THANH TÌM KIẾM BO TRÒN */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-36 xl:w-44 bg-purple-50/50 hover:bg-purple-50/80 focus:bg-white focus:w-52 transition-all duration-200 border border-purple-200/80 rounded-full pl-3.5 pr-8 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30"
                />
                <button 
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
                  aria-label="Tìm kiếm"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CHUÔNG THÔNG BÁO CÓ BADGE SỐ 3 (CAM SÁNG NỔI BẬT) */}
              <button 
                type="button"
                className="relative p-2 rounded-full hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors"
                title="Thông báo mới (3)"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  3
                </span>
              </button>

              {/* PROFILE HỌC SINH */}
              <div className="flex items-center gap-2 pl-1 border-l border-purple-100">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-300 shadow-xs">
                  <img
                    src="/images/avatar_student.png"
                    alt="Học sinh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-purple-500 font-medium leading-none">Xin chào!</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">Học sinh</span>
                </div>
              </div>

              {/* NÚT ADMIN NHỎ GỌN CHO THẦY CÔ */}
              <Link
                href="/admin"
                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                title="Trang quản trị dành cho Thầy Cô"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>

            {/* MOBILE / TABLET RIGHT ACTIONS */}
            <div className="flex xl:hidden items-center gap-1.5">
              <Link
                href="/hoi-trang-ti"
                className="p-1.5 rounded-full bg-purple-50 text-purple-600"
                title="Trợ lý AI"
              >
                <HelpCircle className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-purple-50 text-slate-700 hover:bg-purple-100 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-purple-100 px-4 py-3 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-purple-50">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = isLinkActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm"
                        : "text-slate-700 hover:bg-purple-50 bg-purple-50/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-purple-600"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Trang Quản Trị (Admin)</span>
              </Link>

              <a
                href="tel:111"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-sm"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>SOS 111</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 px-2 py-1 flex justify-around items-center shadow-lg">
        {navLinks.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = isLinkActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 text-[10px] font-bold transition-all ${
                isActive ? "text-purple-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate max-w-[60px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

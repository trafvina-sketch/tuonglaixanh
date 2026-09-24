import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  BookOpen, 
  Gamepad2, 
  PlaySquare, 
  MessageCircle, 
  Siren, 
  ArrowRight, 
  Eye, 
  Calendar, 
  Play, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  Users,
  Heart,
  CheckSquare
} from "lucide-react";
import MiniQuizWidget from "@/components/MiniQuizWidget";
import CommunitySpread from "@/components/CommunitySpread";
import { extractYouTubeId } from "@/components/YouTubeEmbed";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Lấy câu hỏi trắc nghiệm tình huống cho Widget Đấu Trí 60s
  const { data: firstQuizData } = await supabase
    .from("quiz_questions")
    .select("*")
    .order("order_index", { ascending: true })
    .limit(1)
    .single();

  const miniQuiz = firstQuizData
    ? {
        ...firstQuizData,
        options:
          typeof firstQuizData.options === "string"
            ? JSON.parse(firstQuizData.options)
            : firstQuizData.options,
      }
    : undefined;

  // 6 Danh mục hành động nhanh (Quick Action Cards sắc nét, hiện đại phong cách học đường)
  const quickCategories = [
    {
      title: "KIẾN THỨC",
      subtitle: "về ma túy",
      href: "/nhan-dien",
      icon: BookOpen,
      badgeColor: "bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/70 hover:from-indigo-100 hover:to-blue-100 border-indigo-200/90 text-indigo-950 shadow-xs hover:shadow-indigo-500/10",
      iconColor: "text-white bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/30",
    },
    {
      title: "TRẮC NGHIỆM",
      subtitle: "thử thách 60s",
      href: "/khao-thi",
      icon: CheckSquare,
      badgeColor: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 hover:from-emerald-100 hover:to-teal-100 border-emerald-200/90 text-emerald-950 shadow-xs hover:shadow-emerald-500/10",
      iconColor: "text-white bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-500/30",
    },
    {
      title: "TRÒ CHƠI",
      subtitle: "đấu trường trí tuệ",
      href: "/tro-choi",
      icon: Gamepad2,
      badgeColor: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 hover:from-amber-100 hover:to-orange-100 border-amber-200/90 text-amber-950 shadow-xs hover:shadow-amber-500/10",
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md shadow-amber-500/30",
    },
    {
      title: "VIDEO",
      subtitle: "phóng sự cảnh báo",
      href: "/video",
      icon: PlaySquare,
      badgeColor: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/70 hover:from-rose-100 hover:to-pink-100 border-rose-200/90 text-rose-950 shadow-xs hover:shadow-rose-500/10",
      iconColor: "text-white bg-gradient-to-tr from-rose-500 to-pink-600 shadow-md shadow-rose-500/30",
    },
    {
      title: "CỐ VẤN AI",
      subtitle: "hỗ trợ ẩn danh",
      href: "/hoi-trang-ti",
      icon: MessageCircle,
      badgeColor: "bg-gradient-to-br from-violet-50/90 via-white to-purple-50/70 hover:from-violet-100 hover:to-purple-100 border-violet-200/90 text-violet-950 shadow-xs hover:shadow-violet-500/10",
      iconColor: "text-white bg-gradient-to-tr from-violet-600 to-purple-500 shadow-md shadow-violet-500/30",
    },
    {
      title: "BÁO CÁO",
      subtitle: "bảo vệ bí mật",
      href: "/to-giac",
      icon: Siren,
      badgeColor: "bg-gradient-to-br from-red-50/90 via-white to-rose-50/70 hover:from-red-100 hover:to-rose-100 border-red-200/90 text-red-950 shadow-xs hover:shadow-red-500/10",
      iconColor: "text-white bg-gradient-to-tr from-red-600 to-rose-500 shadow-md shadow-red-500/30",
    },
  ];

  // 1. LẤY BÀI VIẾT & TIN TỨC THẬT TỪ SUPABASE
  const { data: dbArticles } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(5);

  const fallbackArticles = [
    {
      id: "fb-1",
      title: "Ma túy - hiểm họa không chỉ của riêng ai",
      date: "18/09/2025",
      thumb: "/images/news_anti_drug_rally.png",
      href: "/tin-tuc",
      views: "1.2K",
      likes: "320",
    },
    {
      id: "fb-2",
      title: "Dấu hiệu nhận biết người sử dụng ma túy",
      date: "16/09/2025",
      thumb: "/images/hero_school_banner.png",
      href: "/tin-tuc",
      views: "980",
      likes: "210",
    },
    {
      id: "fb-3",
      title: "Kỹ năng từ chối khi bị rủ rê",
      date: "14/09/2025",
      thumb: "/images/quiz_mascot_checklist.png",
      href: "/tin-tuc",
      views: "1.5K",
      likes: "450",
    },
    {
      id: "fb-4",
      title: "Những câu chuyện thức tỉnh",
      date: "12/09/2025",
      thumb: "/images/sunrise_future_walk.png",
      href: "/tin-tuc",
      views: "870",
      likes: "190",
    },
  ];

  const hasRealArticles = dbArticles && dbArticles.length > 0;
  const firstDbArticle = hasRealArticles ? dbArticles[0] : null;

  // Bài viết nổi bật HOT (Lấy bài thật mới nhất từ DB nếu có)
  const featuredArticle = firstDbArticle
    ? {
        id: firstDbArticle.id,
        title: firstDbArticle.title,
        date: new Date(firstDbArticle.created_at).toLocaleDateString("vi-VN"),
        thumb: firstDbArticle.thumbnail_webp_url || "/images/news_anti_drug_rally.png",
        href: `/tin-tuc/${firstDbArticle.slug || firstDbArticle.id}`,
        views: firstDbArticle.views_count ? `${firstDbArticle.views_count}` : "1.2K",
        likes: "320",
      }
    : {
        id: "default-hot",
        title: "Học sinh Lương Thế Vinh hưởng ứng Ngày phòng chống ma túy",
        date: "20/09/2025",
        thumb: "/images/news_anti_drug_rally.png",
        href: "/tin-tuc",
        views: "1.2K",
        likes: "320",
      };

  // Danh sách 4 bài viết phụ bên phải
  const remainingDbArticles = hasRealArticles ? dbArticles.slice(1) : [];
  const sideArticles = [
    ...remainingDbArticles.map((art) => ({
      id: art.id,
      title: art.title,
      date: new Date(art.created_at).toLocaleDateString("vi-VN"),
      thumb: art.thumbnail_webp_url || "/images/hero_school_banner.png",
      href: `/tin-tuc/${art.slug || art.id}`,
    })),
    ...fallbackArticles.slice(remainingDbArticles.length),
  ].slice(0, 4);

  // 2. LẤY VIDEO THẬT TỪ SUPABASE
  const { data: dbVideos } = await supabase
    .from("videos")
    .select("*")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(3);

  const featuredVideo = dbVideos && dbVideos.length > 0 ? dbVideos[0] : null;
  const featuredVideoYtId = featuredVideo
    ? extractYouTubeId(featuredVideo.youtube_id || featuredVideo.youtube_url)
    : "";
  const featuredVideoThumb = featuredVideoYtId
    ? `https://img.youtube.com/vi/${featuredVideoYtId}/hqdefault.jpg`
    : "/images/video_thumb_future.png";
  const featuredVideoTitle = featuredVideo
    ? featuredVideo.title
    : "Đừng để ma túy vụt mất tương lai";
  const featuredVideoCategory =
    featuredVideo?.category === "canh_bao" ? "Cảnh báo khẩn" : "Phim tuyên truyền";

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: NÓI KHÔNG VỚI MA TÚY (CHỌN SỨC KHỎE - CHỌN TƯƠNG LAI)     */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg border border-sky-100 bg-gradient-to-r from-sky-400 via-sky-200 to-amber-100 min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
        
        {/* ẢNH NỀN TOÀN CẢNH SÂN TRƯỜNG & HAI HỌC SINH GIƠ TAY STOP */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_school_banner.png"
            alt="Trường học không ma túy - Nói không với ma túy"
            className="w-full h-full object-cover object-center"
          />
          {/* Lớp phủ gradient nhẹ để chữ luôn sắc nét và tương phản cao */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/60 pointer-events-none" />
        </div>

        {/* CÁC THÀNH PHẦN NỔI TRÊN HERO BANNER */}
        <div className="relative z-10 w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[420px]">
          
          {/* HÀNG TRÊN: 3 THẺ GỖ TREO BÊN TRÁI & 2 BONG BÓNG THÔNG ĐIỆP BÊN PHẢI */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            
            {/* BÊN TRÁI: 3 THẺ HUY HIỆU TREO GỖ */}
            <div className="space-y-2 max-w-[210px] hidden sm:block">
              <div className="bg-white/90 backdrop-blur-md border border-amber-200 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2 transform hover:-translate-y-0.5 transition-transform">
                <span className="text-base">🛡️</span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold text-[#9A3412] uppercase tracking-wide">KIẾN THỨC</p>
                  <p className="text-[10px] text-slate-600 font-medium">để tự bảo vệ</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-teal-200 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2 transform hover:-translate-y-0.5 transition-transform">
                <span className="text-base">🌿</span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold text-[#0F766E] uppercase tracking-wide">KỸ NĂNG</p>
                  <p className="text-[10px] text-slate-600 font-medium">để nói không</p>
                </div>
              </div>

              <a 
                href="#lan-toa" 
                className="bg-white/90 backdrop-blur-md border border-rose-200 hover:border-rose-400 hover:bg-rose-50/90 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all cursor-pointer group"
                title="Bấm để tham gia ký cam kết và lan tỏa cộng đồng"
              >
                <span className="text-base group-hover:scale-110 transition-transform">🤝</span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold text-[#BE123C] uppercase tracking-wide group-hover:underline">CỘNG ĐỒNG</p>
                  <p className="text-[10px] text-slate-600 font-medium">để cùng lan tỏa &darr;</p>
                </div>
              </a>
            </div>

            {/* BÊN PHẢI: BONG BÓNG LỜI NHẮC TRUYỀN CẢM HỨNG */}
            <div className="hidden lg:flex flex-col items-end gap-3 max-w-xs">
              <div className="bg-white/90 backdrop-blur-md border border-sky-200 rounded-2xl px-4 py-2 shadow-md text-right animate-bounce duration-1000">
                <p className="text-xs font-bold text-[#0369a1] italic">
                  "Vì một thế hệ khỏe mạnh và hạnh phúc! ❤️"
                </p>
              </div>

              <div className="bg-amber-50/95 backdrop-blur-md border border-amber-300 rounded-3xl p-3.5 shadow-md text-right max-w-[240px]">
                <p className="text-xs font-black text-[#b91c1c] uppercase tracking-wide">
                  Ma túy không phải là lựa chọn!
                </p>
                <p className="text-xs font-bold text-[#c2410c] mt-0.5">
                  Tương lai mới là đích đến!
                </p>
              </div>
            </div>

          </div>

          {/* TRỌNG TÂM: KHẨU HIỆU 3D LỚN (NÓI KHÔNG VỚI MA TÚY) */}
          <div className="text-center sm:text-left my-auto py-1 sm:py-2">
            <div className="inline-flex flex-col items-center sm:items-start bg-white/95 backdrop-blur-lg px-6 sm:px-10 lg:px-12 py-4 sm:py-5 rounded-3xl border border-white/90 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.06)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.22)] max-w-full">
              {/* Dải sáng gradient nổi bật phía trên mép khung */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

              {/* Huy hiệu nhỏ trang trọng trên đầu */}
              <div className="mb-2 sm:mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50/95 border border-red-200/90 text-[10px] sm:text-xs font-black tracking-wider uppercase text-red-600 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Hành động vì học đường không ma túy</span>
              </div>

              {/* TIÊU ĐỀ NÓI KHÔNG VỚI MA TÚY CÂN ĐỐI, THOÁNG ĐÃNG */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-black tracking-tight leading-none drop-shadow-sm flex flex-wrap items-center justify-center sm:justify-start gap-x-2 sm:gap-x-3 gap-y-1 my-1">
                <span className="text-[#dc2626] inline-flex items-center">
                  NÓI KH
                  {/* Biểu tượng cấm 🚫 thiết kế tinh xảo 3D */}
                  <span className="inline-flex items-center justify-center relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 border-[3.5px] sm:border-[4.5px] border-[#dc2626] rounded-full mx-1 shadow-xs shrink-0 bg-red-50/70">
                    <span className="w-full h-0.5 sm:h-1 bg-[#dc2626] rotate-45 rounded-full" />
                  </span>
                  NG
                </span>
                <span className="text-[#1e3a8a] drop-shadow-xs">
                  VỚI MA TÚY
                </span>
              </h1>

              {/* DẢI BĂNG KHẨU HIỆU: CHỌN SỨC KHỎE - CHỌN TƯƠNG LAI */}
              <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-[#dc2626] via-[#e11d48] to-[#ea580c] text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-6 py-2 rounded-full shadow-lg shadow-red-500/25 border border-white/40 ring-2 ring-red-500/20 hover:scale-[1.02] transition-transform">
                <span className="text-xs">✨</span>
                <span>CHỌN SỨC KHỎE - CHỌN TƯƠNG LAI</span>
                <span className="text-xs">🌱</span>
              </div>
            </div>
          </div>

          {/* DƯỚI CÙNG: THANH CHỈ DẪN NHANH CHO HỌC SINH */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-semibold text-slate-700 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Chung tay xây dựng môi trường học đường không khói độc & ma túy ngụy trang</span>
            </div>
            <Link 
              href="/khao-thi" 
              className="text-[#0284c7] font-bold hover:underline flex items-center gap-1"
            >
              <span>Vào thi thử thách ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. HÀNG 6 THẺ ĐIỀU HƯỚNG NHANH SẮC MÀU PASTEL (QUICK ACTION PILLS)        */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {quickCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.title}
              href={cat.href}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-1 flex items-center justify-between group ${cat.badgeColor}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform ${cat.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <h3 className="font-extrabold text-xs sm:text-sm tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] opacity-80 font-medium">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          );
        })}
      </section>


      {/* ========================================================================= */}
      {/* 3. LƯỚI 3 CỘT TRỌNG TÂM: TIN TỨC - THỬ THÁCH TRẮC NGHIỆM - CHATBOT AI     */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.46fr_1fr_0.68fr] gap-4 sm:gap-5 items-stretch">
        
        {/* ----------------------------------------------------------------------- */}
        {/* CỘT 1: TIN TỨC NỔI BẬT (~46.5% CHIỀU RỘNG, 2 CỘT NỘI BỘ SONG SONG)    */}
        {/* ----------------------------------------------------------------------- */}
        <div id="tin-tuc" className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          
          {/* HEADER CỘT */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
            <Link 
              href="/tin-tuc" 
              className="flex items-center gap-2 group hover:opacity-90 transition-all cursor-pointer"
            >
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">🔥</span>
              <h2 className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent uppercase tracking-wide transition-colors">
                Tin Tức Nổi Bật
              </h2>
            </Link>
            <Link 
              href="/tin-tuc" 
              className="text-xs font-bold text-indigo-600 hover:text-cyan-600 flex items-center gap-1 group"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 2 CỘT NỘI BỘ: BÀI HOT (TRÁI) & 4 BÀI PHỤ (PHẢI) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 flex-1 items-start">
            
            {/* BÀI VIẾT HOT CHÍNH (BÊN TRÁI) */}
            <Link 
              href={featuredArticle.href} 
              className="sm:col-span-6 group flex flex-col justify-between h-full space-y-2"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xs bg-slate-100 mb-2">
                  <img
                    src={featuredArticle.thumb}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#ef4444] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                    HOT
                  </span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-[#0284c7] transition-colors leading-snug line-clamp-2">
                  {featuredArticle.title}
                </h3>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] text-slate-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> {featuredArticle.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-400" /> {featuredArticle.views}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" /> {featuredArticle.likes}
                </span>
              </div>
            </Link>

            {/* DANH SÁCH 4 BÀI VIẾT PHỤ THUMBNAIL (BÊN PHẢI) */}
            <div className="sm:col-span-6 flex flex-col justify-between space-y-1.5 sm:space-y-2">
              {sideArticles.map((art) => (
                <Link
                  key={art.id}
                  href={art.href}
                  className="flex items-center justify-between gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-11 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <img 
                        src={art.thumb} 
                        alt={art.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-800 group-hover:text-[#0284c7] transition-colors truncate">
                        {art.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {art.date}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0284c7] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>

          </div>

        </div>


        {/* ----------------------------------------------------------------------- */}
        {/* CỘT 2: THỬ THÁCH CÙNG BẠN (~31.8% CHIỀU RỘNG, THẺ XANH TRÀN VIỀN)       */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          
          {/* HEADER CỘT */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">🏆</span>
              <h2 className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent uppercase tracking-wide">
                Thử Thách Cùng Bạn
              </h2>
            </div>
            <Link 
              href="/khao-thi" 
              className="text-xs font-bold text-indigo-600 hover:text-cyan-600 flex items-center gap-1"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* CARD XANH GRADIENT HOÀNG GIA - CHIẾM TRỌN THÂN THẺ */}
          <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-900 via-indigo-700 to-cyan-600 text-white shadow-md shadow-indigo-500/20 overflow-hidden flex flex-col justify-between flex-1 min-h-[220px]">
            
            {/* HỌA TIẾT BÓNG MỜ & HÌNH LINH VẬT CHECKLIST */}
            <div className="absolute -right-2 -bottom-2 w-36 h-36 sm:w-44 sm:h-44 pointer-events-none select-none">
              <img
                src="/images/quiz_mascot_checklist.png"
                alt="Linh vật trắc nghiệm"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </div>

            {/* NỘI DUNG VĂN BẢN TRẮC NGHIỆM */}
            <div className="relative z-10 space-y-2 max-w-[170px] sm:max-w-[210px]">
              <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-cyan-100">
                KIẾN THỨC HÔM NAY - AN TOÀN NGÀY MAI!
              </span>

              <h3 className="font-black text-base sm:text-lg leading-tight text-white drop-shadow-sm">
                TRẮC NGHIỆM HIỂU ĐÚNG - SỐNG AN TOÀN
              </h3>

              <p className="text-[11px] text-cyan-100/90 leading-relaxed font-medium">
                Bạn đã sẵn sàng? Kiểm tra hiểu biết của mình ngay để bảo vệ bản thân và bạn bè.
              </p>
            </div>

            {/* NÚT BẮT ĐẦU NGAY */}
            <div className="relative z-10 pt-3">
              <Link
                href="/khao-thi"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-black text-xs px-4 py-2 rounded-full shadow-md shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Bắt đầu ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>


        {/* ----------------------------------------------------------------------- */}
        {/* CỘT 3: CHATBOT AI (~21.7% CHIỀU RỘNG, THẺ XANH NHẸ & ROBOT BÊN TRÁI)     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-gradient-to-b from-indigo-50/90 via-sky-50/50 to-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-sm flex flex-col justify-between">
          
          {/* HEADER CỘT */}
          <div className="flex items-center justify-between border-b border-indigo-100/80 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-indigo-200 shrink-0 shadow-2xs">
                <img src="/trolyai.png" alt="Trợ lý AI" className="w-full h-full object-cover object-center" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs sm:text-sm bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wide">
                  CỐ VẤN AI
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">Người bạn luôn bên bạn</p>
              </div>
            </div>
            <Link 
              href="/hoi-trang-ti" 
              className="text-indigo-600 hover:text-cyan-600 hover:translate-x-0.5 transition-all"
              title="Đến trang Chatbot"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ROBOT & BONG BÓNG LỜI THOẠI NẰM CẠNH NHAU */}
          <div className="flex-1 flex flex-col justify-center my-auto py-1">
            <div className="flex items-center gap-2">
              {/* ẢNH TRỢ LÝ AI DỄ THƯƠNG */}
              <div className="w-20 h-28 sm:w-22 sm:h-30 shrink-0 relative flex items-center justify-center">
                <img
                  src="/trolyai.png"
                  alt="Trợ lý AI"
                  className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>

              {/* BONG BÓNG LỜI THOẠI TRỢ LÝ */}
              <div className="relative bg-white border border-indigo-200/80 rounded-2xl p-2.5 text-xs text-slate-700 shadow-xs flex-1">
                <p className="font-bold text-indigo-950 text-[11px] leading-snug">
                  Bạn có thắc mắc về ma túy?
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  Mình luôn sẵn sàng trả lời!
                </p>
                {/* Mũi tên bong bóng nhô sang trái chỉ vào robot */}
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-b border-l border-indigo-200 rotate-45" />
              </div>
            </div>
          </div>

          {/* NÚT CHAT NGAY */}
          <div className="pt-2">
            <Link
              href="/hoi-trang-ti"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm py-2 sm:py-2.5 rounded-full shadow-md shadow-indigo-500/25 hover:scale-[1.02] active:scale-98 transition-all"
            >
              <span>Chat ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* 4. TẦNG CHÂN TRANG: VIDEO NỔI BẬT - CÙNG NHAU LAN TỎA - THÔNG ĐIỆP TƯƠNG LAI */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        
        {/* VIDEO NỔI BẬT (3 CỘT) */}
        <div className="md:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-rose-500 font-bold">▶️</span>
              <h3 className="font-extrabold text-xs uppercase text-[#1e3a8a] tracking-wide">
                Video Nổi Bật
              </h3>
            </div>
            <Link href="/video" className="text-[11px] font-bold text-[#0284c7] hover:underline">
              Xem thêm →
            </Link>
          </div>

          {/* THUMBNAIL VIDEO DẠNG CUỘN PHIM TỪ DỮ LIỆU THẬT */}
          <Link href="/video" className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/9] shadow-sm block">
            <img
              src={featuredVideoThumb}
              alt={featuredVideoTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
            />
            {/* Lớp viền phim & chữ trên video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-2.5">
              <div className="self-end bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                {featuredVideoCategory}
              </div>
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-rose-600 transition-all mx-auto shadow-md">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
                <p className="text-[11px] font-extrabold text-white text-center uppercase tracking-wide leading-tight line-clamp-2 px-1">
                  {featuredVideoTitle}
                </p>
              </div>
            </div>
          </Link>

          {/* HIỂN THỊ VIDEO KẾ TIẾP NẾU CÓ */}
          {dbVideos && dbVideos.length > 1 && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700 truncate max-w-[190px]">
                Xem thêm: {dbVideos[1].title}
              </span>
              <Link href="/video" className="text-[#0284c7] font-bold hover:underline shrink-0">
                Xem ngay &rarr;
              </Link>
            </div>
          )}
        </div>


        {/* CÙNG NHAU LAN TỎA (5 CỘT) - TƯƠNG TÁC CỘNG ĐỒNG */}
        <CommunitySpread />


        {/* BANNER THÔNG ĐIỆP BÌNH MINH (4 CỘT) */}
        <div className="md:col-span-4 rounded-3xl overflow-hidden relative shadow-sm border border-amber-200/80 min-h-[140px] flex items-center">
          <img
            src="/images/sunrise_future_walk.png"
            alt="Hãy chọn những điều tốt đẹp cho tương lai của chính bạn"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-amber-500/40 via-amber-300/20 to-black/30 pointer-events-none" />
          
          <div className="relative z-10 p-4 text-right ml-auto max-w-[220px]">
            <p className="text-xs sm:text-sm font-extrabold text-[#78350f] bg-white/80 backdrop-blur-xs p-2.5 rounded-2xl shadow-xs leading-relaxed italic">
              "Hãy chọn những điều tốt đẹp cho tương lai của chính bạn!"
            </p>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. BANNER ĐẤU TRƯỜNG TRÒ CHƠI HỌC ĐƯỜNG                                   */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-indigo-950 via-indigo-800 to-blue-700 text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-indigo-950/20 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden border border-indigo-700/50">
        <div className="space-y-2 z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
            <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Tổ Hợp 8 Trò Chơi Giáo Dục Mới</span>
          </div>
          <h2 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
            Đấu Trường Trò Chơi: Vừa Học Vừa Chơi - Tôi Rèn Bản Lĩnh!
          </h2>
          <p className="text-xs text-indigo-100 leading-relaxed font-medium">
            Khám phá 8 mini game hấp dẫn: <b>Thám Tử Lật Thẻ</b>, <b>Vệ Binh Phản Xạ 45s</b>, <b>Đấu Trí Tình Huống</b>, <b>Bắn Phá Bóng Độc</b>, <b>Từ Khóa Bí Mật</b>, <b>Đúng Hay Sai 30s</b>, <b>Vòng Quay Bản Lĩnh</b> và <b>Chiến Dịch Phân Loại</b>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 z-10 shrink-0 w-full sm:w-auto">
          <Link
            href="/tro-choi"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Vào Chơi Ngay (8 Game)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* NỀN TRANG TRÍ HÌNH HỌC */}
        <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </section>


      {/* ========================================================================= */}
      {/* 6. TƯƠNG TÁC THỰC TẾ: WIDGET ĐẤU TRÍ TÌNH HUỐNG THCS (CHƠI TỨC THÌ)        */}
      {/* ========================================================================= */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥋</span>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-[#1e3a8a] uppercase tracking-wide">
                Vượt Ải Tình Huống: 4 Bước Từ Chối Vàng
              </h2>
              <p className="text-xs text-slate-500">
                Thử nghiệm xử lý tình huống thực tế khi bị bạn bè rủ rê hoặc ép buộc
              </p>
            </div>
          </div>
          <Link
            href="/khao-thi"
            className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
          >
            <span>Đấu Trí Đầy Đủ (5 Ải)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <MiniQuizWidget initialQuestion={miniQuiz} />
      </section>

    </div>
  );
}

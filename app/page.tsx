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
import YouTubeEmbed, { extractYouTubeId } from "@/components/YouTubeEmbed";

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

  // 6 Danh mục hành động nhanh (Phong cách Macaron Pastel Yêu Thương Học Đường)
  const quickCategories = [
    {
      title: "KIẾN THỨC",
      subtitle: "để tự bảo vệ",
      href: "/nhan-dien",
      icon: BookOpen,
      badgeColor: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/70 hover:from-rose-100 hover:to-pink-100 border-rose-200/80 text-rose-950 shadow-xs hover:shadow-rose-400/10",
      iconColor: "text-white bg-gradient-to-tr from-rose-500 to-pink-500 shadow-md shadow-rose-500/25",
    },
    {
      title: "TRẮC NGHIỆM",
      subtitle: "thử thách bản lĩnh",
      href: "/khao-thi",
      icon: CheckSquare,
      badgeColor: "bg-gradient-to-br from-orange-50/90 via-white to-amber-50/70 hover:from-orange-100 hover:to-amber-100 border-orange-200/80 text-orange-950 shadow-xs hover:shadow-orange-400/10",
      iconColor: "text-white bg-gradient-to-tr from-orange-500 to-amber-500 shadow-md shadow-orange-500/25",
    },
    {
      title: "TRÒ CHƠI",
      subtitle: "vừa học vừa vui",
      href: "/tro-choi",
      icon: Gamepad2,
      badgeColor: "bg-gradient-to-br from-purple-50/90 via-white to-indigo-50/70 hover:from-purple-100 hover:to-indigo-100 border-purple-200/80 text-purple-950 shadow-xs hover:shadow-purple-400/10",
      iconColor: "text-white bg-gradient-to-tr from-purple-500 to-violet-600 shadow-md shadow-purple-500/25",
    },
    {
      title: "VIDEO",
      subtitle: "phóng sự cảnh báo",
      href: "/video",
      icon: PlaySquare,
      badgeColor: "bg-gradient-to-br from-red-50/90 via-white to-rose-50/70 hover:from-red-100 hover:to-rose-100 border-rose-200/80 text-rose-950 shadow-xs hover:shadow-rose-400/10",
      iconColor: "text-white bg-gradient-to-tr from-rose-600 to-red-500 shadow-md shadow-rose-500/25",
    },
    {
      title: "CỐ VẤN AI",
      subtitle: "người bạn tâm tình",
      href: "/hoi-trang-ti",
      icon: MessageCircle,
      badgeColor: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 hover:from-emerald-100 hover:to-teal-100 border-emerald-200/80 text-emerald-950 shadow-xs hover:shadow-emerald-400/10",
      iconColor: "text-white bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25",
    },
    {
      title: "HÒM THƯ KÍN",
      subtitle: "che chở & sẻ chia",
      href: "/to-giac",
      icon: Siren,
      badgeColor: "bg-gradient-to-br from-amber-50/90 via-white to-yellow-50/70 hover:from-amber-100 hover:to-yellow-100 border-amber-200/80 text-amber-950 shadow-xs hover:shadow-amber-400/10",
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-yellow-500 shadow-md shadow-amber-500/25",
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
  const featuredVideoYtId = (featuredVideo && extractYouTubeId(featuredVideo.youtube_id || featuredVideo.youtube_url)) || "lCCc0vcG2ww";
  const featuredVideoTitle = featuredVideo
    ? featuredVideo.title
    : 'Ma túy "tấn công" học sinh và ẩn khuất dưới nhiều vỏ bọc (VTV24)';
  const featuredVideoCategory =
    featuredVideo?.category === "canh_bao" ? "Cảnh báo khẩn" : "Phóng sự VTV24";

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: NÓI KHÔNG VỚI MA TÚY (CHỌN SỨC KHỎE - CHỌN TƯƠNG LAI)     */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden shadow-lg border border-rose-200/80 bg-gradient-to-r from-rose-100/90 via-amber-50/70 to-pink-100/90 min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
        
        {/* ẢNH NỀN TOÀN CẢNH SÂN TRƯỜNG & HAI HỌC SINH GIƠ TAY STOP */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_school_banner.png"
            alt="Trường học yêu thương - Nói không với ma túy"
            className="w-full h-full object-cover object-center"
          />
          {/* Lớp phủ gradient ấm áp để tương phản dịu mắt */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/20 to-white/65 pointer-events-none" />
        </div>

        {/* CÁC THÀNH PHẦN NỔI TRÊN HERO BANNER */}
        <div className="relative z-10 w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[420px]">
          
          {/* HÀNG TRÊN: 3 THẺ THÔNG ĐIỆP BÊN TRÁI & 2 BONG BÓNG YÊU THƯƠNG BÊN PHẢI */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            
            {/* BÊN TRÁI: 3 THẺ HUY HIỆU YÊU THƯƠNG */}
            <div className="space-y-2 max-w-[210px] hidden sm:block">
              <div className="bg-white/95 backdrop-blur-md border border-rose-200 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2 transform hover:-translate-y-0.5 transition-transform">
                <span className="text-base">💖</span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wide">YÊU BẢN THÂN</p>
                  <p className="text-[10px] text-slate-600 font-medium">để sống trọn vẹn</p>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-emerald-200 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2 transform hover:-translate-y-0.5 transition-transform">
                <span className="text-base">🌿</span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wide">BẢN LĨNH TRẺ</p>
                  <p className="text-[10px] text-slate-600 font-medium">để nói không</p>
                </div>
              </div>

              <a 
                href="#lan-toa" 
                className="bg-white/95 backdrop-blur-md border border-amber-200 hover:border-rose-400 hover:bg-rose-50/90 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all cursor-pointer group"
                title="Bấm để tham gia ký cam kết và lan tỏa cộng đồng"
              >
                <span className="text-base group-hover:scale-110 transition-transform">🤝</span>
                <div className="leading-tight">
                  <p className="text-[11px] font-extrabold text-amber-700 group-hover:text-rose-600 uppercase tracking-wide group-hover:underline">LAN TỎA YÊU THƯƠNG</p>
                  <p className="text-[10px] text-slate-600 font-medium">cùng bè bạn &darr;</p>
                </div>
              </a>
            </div>

            {/* BÊN PHẢI: BONG BÓNG LỜI NHẮC TRUYỀN CẢM HỨNG */}
            <div className="hidden lg:flex flex-col items-end gap-3 max-w-xs">
              <div className="bg-white/95 backdrop-blur-md border border-rose-200 rounded-2xl px-4 py-2 shadow-md text-right animate-bounce duration-1000">
                <p className="text-xs font-bold text-rose-600 italic">
                  "Vì một thế hệ khỏe mạnh và hạnh phúc! 💖"
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-rose-50 backdrop-blur-md border border-amber-200 rounded-3xl p-3.5 shadow-md text-right max-w-[240px]">
                <p className="text-xs font-black text-rose-700 uppercase tracking-wide">
                  Ma túy không phải là lựa chọn!
                </p>
                <p className="text-xs font-bold text-amber-700 mt-0.5">
                  Tương lai tươi sáng mới là đích đến! ✨
                </p>
              </div>
            </div>

          </div>

          {/* TRỌNG TÂM: KHẨU HIỆU 3D LỚN (NÓI KHÔNG VỚI MA TÚY) */}
          <div className="text-center sm:text-left my-auto py-1 sm:py-2">
            <div className="inline-flex flex-col items-center sm:items-start bg-white/95 backdrop-blur-lg px-6 sm:px-10 lg:px-12 py-4 sm:py-5 rounded-3xl border border-rose-100 shadow-[0_16px_40px_-12px_rgba(244,63,94,0.15),0_4px_12px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_48px_-10px_rgba(244,63,94,0.2)] max-w-full">
              {/* Dải sáng gradient nổi bật phía trên mép khung */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400" />

              {/* Huy hiệu nhỏ trang trọng trên đầu */}
              <div className="mb-2 sm:mb-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/90 text-[10px] sm:text-xs font-black tracking-wider uppercase text-rose-600 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Hành động vì học đường yêu thương & an toàn</span>
              </div>

              {/* TIÊU ĐỀ NÓI KHÔNG VỚI MA TÚY CÂN ĐỐI, THOÁNG ĐÃNG */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-black tracking-tight leading-none drop-shadow-sm flex flex-wrap items-center justify-center sm:justify-start gap-x-2 sm:gap-x-3 gap-y-1 my-1">
                <span className="text-[#e11d48] inline-flex items-center">
                  NÓI KH
                  {/* Biểu tượng cấm 🚫 thiết kế tinh xảo 3D */}
                  <span className="inline-flex items-center justify-center relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 border-[3.5px] sm:border-[4.5px] border-[#e11d48] rounded-full mx-1 shadow-xs shrink-0 bg-rose-50/70">
                    <span className="w-full h-0.5 sm:h-1 bg-[#e11d48] rotate-45 rounded-full" />
                  </span>
                  NG
                </span>
                <span className="text-slate-800 drop-shadow-xs">
                  VỚI MA TÚY
                </span>
              </h1>

              {/* DẢI BĂNG KHẨU HIỆU: CHỌN YÊU THƯƠNG - CHỌN TƯƠNG LAI */}
              <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-6 py-2 rounded-full shadow-lg shadow-rose-500/25 border border-white/40 ring-2 ring-rose-400/20 hover:scale-[1.02] transition-transform">
                <span className="text-xs">💖</span>
                <span>CHỌN YÊU THƯƠNG - CHỌN TƯƠNG LAI</span>
                <span className="text-xs">🌱</span>
              </div>
            </div>
          </div>

          {/* DƯỚI CÙNG: THANH CHỈ DẪN NHANH CHO HỌC SINH */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-semibold text-slate-700 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-xl border border-rose-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Chung tay xây dựng môi trường học đường không khói độc & ma túy ngụy trang</span>
            </div>
            <Link 
              href="/khao-thi" 
              className="text-rose-600 font-bold hover:underline flex items-center gap-1"
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
        <div id="tin-tuc" className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100/90 shadow-sm flex flex-col justify-between">
          
          {/* HEADER CỘT */}
          <div className="flex items-center justify-between border-b border-rose-100/80 pb-3 mb-3.5">
            <Link 
              href="/tin-tuc" 
              className="flex items-center gap-2 group hover:opacity-90 transition-all cursor-pointer"
            >
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">🌸</span>
              <h2 className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent uppercase tracking-wide transition-colors">
                Tin Tức Học Đường
              </h2>
            </Link>
            <Link 
              href="/tin-tuc" 
              className="text-xs font-bold text-rose-600 hover:text-pink-600 flex items-center gap-1 group"
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
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xs bg-slate-100 mb-2 border border-rose-100">
                  <img
                    src={featuredArticle.thumb}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                    HOT
                  </span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
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
                  className="flex items-center justify-between gap-2.5 p-1.5 rounded-xl hover:bg-rose-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-11 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-rose-100">
                      <img 
                        src={art.thumb} 
                        alt={art.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-800 group-hover:text-rose-600 transition-colors truncate">
                        {art.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {art.date}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>

          </div>

        </div>


        {/* ----------------------------------------------------------------------- */}
        {/* CỘT 2: THỬ THÁCH CÙNG BẠN (~31.8% CHIỀU RỘNG, THẺ NẮNG ẤM PASTEL)        */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100/90 shadow-sm flex flex-col justify-between">
          
          {/* HEADER CỘT */}
          <div className="flex items-center justify-between border-b border-amber-100/80 pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">🏆</span>
              <h2 className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent uppercase tracking-wide">
                Thử Thách Cùng Bạn
              </h2>
            </div>
            <Link 
              href="/khao-thi" 
              className="text-xs font-bold text-amber-600 hover:text-rose-600 flex items-center gap-1"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* CARD NẮNG ẤM HOÀNG HÔN - CHIẾM TRỌN THÂN THẺ */}
          <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20 overflow-hidden flex flex-col justify-between flex-1 min-h-[220px]">
            
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
              <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-white">
                KIẾN THỨC HÔM NAY - AN TOÀN NGÀY MAI!
              </span>

              <h3 className="font-black text-base sm:text-lg leading-tight text-white drop-shadow-sm">
                TRẮC NGHIỆM HIỂU ĐÚNG - SỐNG AN TOÀN
              </h3>

              <p className="text-[11px] text-white/90 leading-relaxed font-medium">
                Bạn đã sẵn sàng? Kiểm tra hiểu biết của mình ngay để bảo vệ bản thân và bạn bè.
              </p>
            </div>

            {/* NÚT BẮT ĐẦU NGAY */}
            <div className="relative z-10 pt-3">
              <Link
                href="/khao-thi"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-50 text-slate-900 font-black text-xs px-4 py-2 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <span>Bắt đầu ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>


        {/* ----------------------------------------------------------------------- */}
        {/* CỘT 3: CHATBOT AI (~21.7% CHIỀU RỘNG, THẺ HỒNG NHẸ & CỐ VẤN DỄ THƯƠNG)  */}
        {/* ----------------------------------------------------------------------- */}
        <div className="bg-gradient-to-b from-rose-50/90 via-pink-50/40 to-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-sm flex flex-col justify-between">
          
          {/* HEADER CỘT */}
          <div className="flex items-center justify-between border-b border-rose-100/80 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-rose-200 shrink-0 shadow-2xs">
                <img src="/trolyai.png" alt="Trợ lý AI" className="w-full h-full object-cover object-center" />
              </div>
              <div>
                <h2 className="font-extrabold text-xs sm:text-sm bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent uppercase tracking-wide">
                  CỐ VẤN AI
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">Người bạn luôn bên bạn</p>
              </div>
            </div>
            <Link 
              href="/hoi-trang-ti" 
              className="text-rose-600 hover:text-pink-600 hover:translate-x-0.5 transition-all"
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
              <div className="relative bg-white border border-rose-200/80 rounded-2xl p-2.5 text-xs text-slate-700 shadow-xs flex-1">
                <p className="font-bold text-rose-950 text-[11px] leading-snug">
                  Bạn có tâm sự hay thắc mắc?
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  Mình luôn lắng nghe & giữ bí mật!
                </p>
                {/* Mũi tên bong bóng nhô sang trái chỉ vào robot */}
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-b border-l border-rose-200 rotate-45" />
              </div>
            </div>
          </div>

          {/* NÚT CHAT NGAY */}
          <div className="pt-2">
            <Link
              href="/hoi-trang-ti"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm py-2 sm:py-2.5 rounded-full shadow-md shadow-rose-500/25 hover:scale-[1.02] active:scale-98 transition-all"
            >
              <span>Tâm sự ngay</span>
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
        <div className="md:col-span-3 bg-white rounded-3xl p-4 sm:p-5 border border-rose-100/90 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-rose-100/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-rose-500 font-bold">▶️</span>
              <h3 className="font-extrabold text-xs uppercase bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent tracking-wide">
                Video Phóng Sự
              </h3>
            </div>
            <Link href="/video" className="text-[11px] font-bold text-rose-600 hover:text-pink-600 hover:underline">
              Xem tất cả (6 video) →
            </Link>
          </div>

          {/* NHÚNG TRỰC TIẾP VIDEO YOUTUBE PHÁT NGAY TRÊN TRANG CHỦ */}
          <div className="space-y-2">
            <div className="rounded-2xl overflow-hidden shadow-xs border border-rose-200/80 bg-slate-900 aspect-video">
              <YouTubeEmbed urlOrId={featuredVideoYtId} title={featuredVideoTitle} />
            </div>
            <div>
              <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 mb-1">
                {featuredVideoCategory}
              </span>
              <p className="text-[11px] font-bold text-slate-800 leading-snug line-clamp-2">
                {featuredVideoTitle}
              </p>
            </div>
          </div>

          {/* HIỂN THỊ LINK KHO VIDEO CHÍNH THỐNG */}
          <div className="pt-2 border-t border-rose-100/80 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-500">
              Nguồn VTV24 & ANTV
            </span>
            <Link href="/video" className="text-rose-600 font-bold hover:underline shrink-0">
              Xem 6 video &rarr;
            </Link>
          </div>
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
          <div className="absolute inset-0 bg-gradient-to-l from-rose-400/40 via-amber-300/20 to-black/30 pointer-events-none" />
          
          <div className="relative z-10 p-4 text-right ml-auto max-w-[220px]">
            <p className="text-xs sm:text-sm font-extrabold text-[#78350f] bg-white/85 backdrop-blur-xs p-2.5 rounded-2xl shadow-xs leading-relaxed italic">
              "Hãy chọn những điều tốt đẹp cho tương lai của chính bạn! 💖"
            </p>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. BANNER ĐẤU TRƯỜNG TRÒ CHƠI HỌC ĐƯỜNG                                   */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-purple-950 via-rose-950 to-pink-900 text-white rounded-3xl p-5 sm:p-6 shadow-md shadow-rose-950/20 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden border border-rose-500/30">
        <div className="space-y-2 z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
            <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Tổ Hợp 8 Trò Chơi Giáo Dục Mới</span>
          </div>
          <h2 className="text-base sm:text-xl font-black uppercase tracking-tight text-white">
            Đấu Trường Trò Chơi: Vừa Học Vừa Chơi - Tôi Rèn Bản Lĩnh!
          </h2>
          <p className="text-xs text-rose-100 leading-relaxed font-medium">
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
        <div className="absolute -right-6 -bottom-6 w-48 h-48 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
      </section>


      {/* ========================================================================= */}
      {/* 6. TƯƠNG TÁC THỰC TẾ: WIDGET ĐẤU TRÍ TÌNH HUỐNG THCS (CHƠI TỨC THÌ)        */}
      {/* ========================================================================= */}
      <section className="bg-white border border-rose-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥋</span>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent uppercase tracking-wide">
                Vượt Ải Tình Huống: 4 Bước Từ Chối Vàng
              </h2>
              <p className="text-xs text-slate-500">
                Thử nghiệm xử lý tình huống thực tế khi bị bạn bè rủ rê hoặc ép buộc
              </p>
            </div>
          </div>
          <Link
            href="/khao-thi"
            className="text-xs font-bold text-rose-600 hover:text-pink-600 hover:underline flex items-center gap-1"
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

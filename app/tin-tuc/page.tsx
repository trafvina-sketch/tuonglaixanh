import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Newspaper, Calendar, Eye, ArrowRight, ShieldCheck } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function TinTucPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const currentCategory = searchParams?.category || "all";

  let query = supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (currentCategory && currentCategory !== "all") {
    query = query.eq("seal_type", currentCategory);
  }

  const { data: articles } = await query;
  const articleList = articles || [];

  const filterTabs = [
    { label: "Tất cả bài viết", value: "all", href: "/tin-tuc" },
    { label: "🔥 Cảnh báo khẩn", value: "canhbao", href: "/tin-tuc?category=canhbao" },
    { label: "🛡️ Kỹ năng phòng vệ", value: "phongve", href: "/tin-tuc?category=phongve" },
    { label: "📚 Kiến thức học đường", value: "kienthuc", href: "/tin-tuc?category=kienthuc" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADER TRANG TIN TỨC */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-bold text-rose-700">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Thông tin & Bài viết chính thống</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent tracking-tight uppercase">
            Tin Tức & Bài Viết Tuyên Truyền
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Tuyển tập các bài viết, phóng sự cảnh giác và cẩm nang kỹ năng phòng vệ học đường được cập nhật thường xuyên bởi Ban Giám Hiệu và Thầy Cô.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs text-amber-900 font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Thông tin xác thực 100%</span>
        </div>
      </div>

      {/* THANH TAB LỌC NHANH DANH MỤC */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = currentCategory === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.href}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 shadow-2xs ${
                isActive
                  ? "bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-sm shadow-rose-500/25"
                  : "bg-white hover:bg-rose-50 text-slate-600 border border-slate-200/80 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* DANH SÁCH BÀI VIẾT */}
      {articleList.length === 0 ? (
        <div className="bg-white border border-rose-100 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl">📰</span>
          <h3 className="font-extrabold text-base text-slate-800">Chưa có bài viết trong danh mục này</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Thầy cô đang biên soạn thêm các nội dung chuyên mục này. Các bạn học sinh quay lại sau nhé!
          </p>
          <Link
            href="/tin-tuc"
            className="inline-block mt-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100"
          >
            Quay lại xem tất cả bài viết
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {articleList.map((art) => {
            const dateStr = new Date(art.created_at).toLocaleDateString("vi-VN");
            const thumbUrl = art.thumbnail_webp_url || "/images/news_anti_drug_rally.png";
            const sealBadge =
              art.seal_type === "canhbao"
                ? { label: "Cảnh báo khẩn", bg: "bg-rose-50 text-rose-700 border-rose-200" }
                : art.seal_type === "phongve"
                ? { label: "Kỹ năng phòng vệ", bg: "bg-teal-50 text-teal-700 border-teal-200" }
                : { label: "Kiến thức", bg: "bg-amber-50 text-amber-700 border-amber-200" };

            return (
              <article
                key={art.id}
                className="bg-white border border-rose-100/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  {/* ẢNH BÌA BÀI VIẾT */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={thumbUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-xs ${sealBadge.bg}`}
                    >
                      {sealBadge.label}
                    </span>
                  </div>

                  {/* NỘI DUNG TÓM TẮT */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {dateStr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {art.views_count || 1} lượt xem
                      </span>
                    </div>

                    <h2 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h2>

                    {art.proclamation_text && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {art.proclamation_text}
                      </p>
                    )}
                  </div>
                </div>

                {/* NÚT ĐỌC CHI TIẾT */}
                <div className="p-4 sm:p-5 pt-0">
                  <Link
                    href={`/tin-tuc/${art.slug || art.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:text-pink-600 group-hover:translate-x-1 transition-all"
                  >
                    <span>Đọc bài viết đầy đủ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

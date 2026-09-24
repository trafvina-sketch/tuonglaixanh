import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatSmartArticleContent } from "@/lib/articleFormatter";
import ArticleInteractions from "@/components/ArticleInteractions";
import {
  ArrowLeft,
  Calendar,
  Eye,
  ShieldAlert,
  PhoneCall,
  Clock,
  ChevronRight,
  Sparkles,
  Bot,
  ShieldCheck,
  Flame,
  Bookmark,
  ExternalLink,
} from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = params;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  let query = supabase.from("articles").select("*");
  if (isUUID) {
    query = query.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    query = query.eq("slug", slug);
  }
  const { data: article } = await query.single();
  if (!article) return {};

  const siteUrl = "https://phong-chong-ma-tuy-hoc-duong.vercel.app";
  const title = article.title;
  const description = article.proclamation_text || "Tuyên truyền phòng chống ma túy học đường - THCS Nguyễn Hồng Ánh";
  const thumb = article.thumbnail_webp_url || `${siteUrl}/logo.jpg`;
  const absoluteThumb = thumb.startsWith("http") ? thumb : `${siteUrl}${thumb.startsWith("/") ? "" : "/"}${thumb}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/tin-tuc/${slug}`,
      siteName: "Lá Chắn Học Đường",
      images: [
        {
          url: absoluteThumb,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteThumb],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = params;

  // 1. Tìm bài viết theo slug (hoặc id nếu slug là UUID)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  let query = supabase.from("articles").select("*");
  if (isUUID) {
    query = query.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    query = query.eq("slug", slug);
  }
  const { data: article } = await query.single();

  if (!article) {
    notFound();
  }

  // 2. Lấy danh sách bài viết liên quan (loại trừ bài hiện tại)
  const { data: relatedArticles } = await supabase
    .from("articles")
    .select("id, title, slug, thumbnail_webp_url, created_at, seal_type, proclamation_text")
    .eq("is_published", true)
    .neq("id", article.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const dateStr = new Date(article.created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const thumbUrl = article.thumbnail_webp_url || "/images/news_anti_drug_rally.png";

  const sealBadge =
    article.seal_type === "canhbao"
      ? {
          label: "Cảnh Báo Khẩn Học Đường",
          bg: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
        }
      : article.seal_type === "phongve"
      ? {
          label: "Kỹ Năng Thoát Hiểm An Toàn",
          bg: "bg-teal-50 text-teal-700 border-teal-200",
          dot: "bg-teal-500",
        }
      : {
          label: "Kiến Thức Học Đường",
          bg: "bg-sky-50 text-sky-700 border-sky-200",
          dot: "bg-sky-500",
        };

  // Ước tính thời gian đọc bài (khoảng 200 từ / phút)
  const rawText = article.content_html ? article.content_html.replace(/<[^>]*>/g, " ") : "";
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Tự động định dạng nội dung thông minh
  const renderedContent = formatSmartArticleContent(article.content_html);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* BREADCRUMB ĐIỀU HƯỚNG BÁO CHÍ */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto pb-1">
        <Link href="/" className="hover:text-rose-600 shrink-0 font-medium transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link href="/tin-tuc" className="hover:text-rose-600 shrink-0 font-medium transition-colors">
          Bản tin học đường
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-400 truncate max-w-[200px] sm:max-w-md font-medium">
          {article.title}
        </span>
      </nav>

      {/* BỐ CỤC TẠP CHÍ 2 CỘT CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ========================================================
            CỘT TRÁI (8/12 - 68%): NỘI DUNG BÀI VIẾT CHÍNH
        ======================================================== */}
        <main className="lg:col-span-8 space-y-6">
          <article className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8">
            {/* PHẦN ĐẦU BÀI VIẾT (HEADER) */}
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* HUY HIỆU PHÂN LOẠI */}
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-1 rounded-full border shadow-2xs ${sealBadge.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full animate-pulse ${sealBadge.dot}`} />
                  <span>{sealBadge.label}</span>
                </span>

                {/* THỜI GIAN ĐỌC ƯỚC TÍNH */}
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>~{readTimeMinutes} phút đọc</span>
                </span>
              </div>

              {/* TIÊU ĐỀ H1 CHUẨN TẠP CHÍ BÁO CHÍ */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {article.title}
              </h1>

              {/* THANH TÁC GIẢ & THỜI GIAN (BYLINE META) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
                    Ánh
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 leading-tight">
                      Ban Tuyên Truyền Phòng Chống Tệ Nạn
                    </div>
                    <div className="text-[11px] text-slate-400">Trường THCS Nguyễn Hồng Ánh</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400 font-medium text-[11px] sm:text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dateStr}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{article.views_count || 1} lượt đọc</span>
                  </span>
                </div>
              </div>
            </div>

            {/* LỜI HỊCH / KHẨU HIỆU CẢNH BÁO NỔI BẬT NẾU CÓ */}
            {article.proclamation_text && (
              <div className="relative bg-gradient-to-r from-red-50 via-amber-50/60 to-rose-50 border-l-4 border-red-600 rounded-r-2xl p-4 sm:p-5 text-sm sm:text-base font-semibold text-slate-900 leading-relaxed italic shadow-2xs">
                <div className="text-red-500/30 text-4xl font-serif absolute top-1 left-2 pointer-events-none select-none">
                  “
                </div>
                <p className="relative z-10 pl-3">"{article.proclamation_text}"</p>
              </div>
            )}

            {/* ẢNH ĐẠI DIỆN BÀI VIẾT (FEATURED IMAGE) */}
            {article.thumbnail_webp_url && (
              <figure className="space-y-2">
                <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-100 bg-slate-50">
                  <img
                    src={thumbUrl}
                    alt={article.title}
                    className="w-full max-h-[460px] object-cover"
                  />
                </div>
                <figcaption className="text-center text-[11px] text-slate-400 italic">
                  Tài liệu tuyên truyền trực quan phục vụ công tác phòng chống tệ nạn học đường
                </figcaption>
              </figure>
            )}

            {/* NỘI DUNG CHI TIẾT BÀI VIẾT (MAGAZINE TYPOGRAPHY VŨ TRỤ KẸO NGỌT) */}
            <div
              className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 pt-2
                [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-black [&>h2]:text-purple-700 [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:pb-1.5 [&>h2]:border-b [&>h2]:border-purple-100
                [&>h3]:text-base [&>h3]:sm:text-lg [&>h3]:font-extrabold [&>h3]:text-pink-600 [&>h3]:mt-5 [&>h3]:mb-2
                [&>h4]:text-sm [&>h4]:sm:text-base [&>h4]:font-bold [&>h4]:text-slate-900 [&>h4]:mt-4
                [&>p]:text-slate-700 [&>p]:leading-relaxed [&>p]:mb-4
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:text-slate-700 [&>ul]:mb-4
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:text-slate-700 [&>ol]:mb-4
                [&>strong]:text-slate-900 [&>strong]:font-bold
                [&>em]:italic [&>em]:text-slate-600
                [&>blockquote]:border-l-4 [&>blockquote]:border-pink-400 [&>blockquote]:bg-pink-50/60 [&>blockquote]:pl-4 [&>blockquote]:py-3 [&>blockquote]:rounded-r-xl [&>blockquote]:italic [&>blockquote]:text-purple-950 [&>blockquote]:my-5
                [&>img]:rounded-2xl [&>img]:shadow-md [&>img]:my-5 [&>img]:border [&>img]:border-purple-100 [&>img]:max-w-full [&>img]:mx-auto
                [&>hr]:my-8 [&>hr]:border-purple-100"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* THANH TƯƠNG TÁC: SAO CHÉP LINK, FACEBOOK, ZALO, IN ẤN */}
            <ArticleInteractions title={article.title} />

            {/* HASHTAG / TỪ KHÓA BÀI VIẾT */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400">Từ khóa:</span>
              <span className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                #phongchongmatuy
              </span>
              <span className="text-[11px] font-medium bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full border border-pink-200">
                #thuocladientu
              </span>
              <span className="text-[11px] font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200">
                #kynangsong
              </span>
              <span className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                #vutrukeongot
              </span>
            </div>

            {/* BANNER ĐƯỜNG DÂY NÓNG CỨU VIỆN KHẨN CẤP DƯỚI BÀI VIẾT */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-teal-500 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-xs border border-white/20">
                    <ShieldAlert className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm sm:text-base uppercase tracking-wide">
                      Gặp tình huống khẩn cấp hoặc bị dụ dỗ?
                    </h4>
                    <p className="text-xs text-white/90 font-medium mt-0.5">
                      Gọi ngay Tổng đài Quốc Gia 111 (Bảo vệ trẻ em) — Miễn phí 24/7, tuyệt đối bí mật danh tính học sinh.
                    </p>
                  </div>
                </div>
                <a
                  href="tel:111"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-purple-950 font-black text-xs sm:text-sm px-6 py-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>GỌI 111 NGAY</span>
                </a>
              </div>
            </div>
          </article>
        </main>

        {/* ========================================================
            CỘT PHẢI (4/12 - 32%): STICKY SIDEBAR HỖ TRỢ & BÀI LIÊN QUAN
        ======================================================== */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* WIDGET 1: HỎI TRẠNG TÍ AI VỀ BÀI VIẾT */}
          <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-teal-500 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-purple-300/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white border border-white/30 flex items-center justify-center shadow-xs shrink-0 p-0.5">
                <img src="/trolyai.png" alt="Trạng Tí AI" className="w-full h-full object-cover object-top rounded-xl" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wide">Hỏi Trạng Tí AI 🪐✨</h3>
                <p className="text-[11px] text-pink-100">Cố vấn giải đáp phòng vệ học đường</p>
              </div>
            </div>

            <p className="text-xs text-pink-50 leading-relaxed">
              Em còn băn khoăn về tác hại của thuốc lá điện tử, pod chill hay chưa biết cách từ chối bạn xấu? Hãy hỏi ngay Cố Vấn Trạng Tí!
            </p>

            <div className="space-y-2 pt-1">
              <Link
                href="/hoi-trang-ti?q=Hút thử pod chill 1 hơi thì có bị nghiện không Trạng Tí?"
                className="block text-left text-xs bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl p-2.5 transition-all group"
              >
                <span className="font-medium text-white group-hover:text-amber-200 transition-colors flex items-center justify-between">
                  <span>💭 "Hút pod chill 1 hơi có nghiện không?"</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>

              <Link
                href="/hoi-trang-ti?q=Làm sao từ chối khi bị bạn bè trong lớp ép hút thuốc lá điện tử?"
                className="block text-left text-xs bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl p-2.5 transition-all group"
              >
                <span className="font-medium text-white group-hover:text-amber-200 transition-colors flex items-center justify-between">
                  <span>🛡️ "Cách từ chối khi bị bạn bè ép hút pod"</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            <Link
              href="/hoi-trang-ti"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-purple-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-950" />
              <span>Trò chuyện trực tiếp với Trạng Tí</span>
            </Link>
          </div>

          {/* WIDGET 2: THẦN CHÚ 3K THOÁT HIỂM */}
          <div className="bg-white border border-purple-100 rounded-3xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 text-purple-700 border-b border-purple-100 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-pink-500" />
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900">
                Thần Chú 3K Thoát Hiểm
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-pink-50/70 border border-pink-200 rounded-xl">
                <span className="font-black text-pink-700 block mb-0.5">1. KHÔNG tò mò</span>
                <span className="text-slate-600">Tuyệt đối không nếm thử, không cầm hộ dù chỉ một lần.</span>
              </div>

              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                <span className="font-black text-purple-800 block mb-0.5">2. KIÊN QUYẾT từ chối</span>
                <span className="text-slate-600">Nói "Không!" dứt khoát và lập tức rời khỏi nơi có kẻ rủ rê.</span>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl">
                <span className="font-black text-teal-800 block mb-0.5">3. KỂ NGAY cho người lớn</span>
                <span className="text-slate-600">Báo ngay cho cha mẹ, thầy cô hoặc gọi 111 để được bảo vệ.</span>
              </div>
            </div>
          </div>

          {/* WIDGET 3: BÀI VIẾT TUYÊN TRUYỀN LIÊN QUAN */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="bg-white border border-purple-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
                <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-pink-500" />
                  <span>Bài viết cùng chuyên mục</span>
                </h3>
                <Link
                  href="/tin-tuc"
                  className="text-[11px] font-bold text-purple-600 hover:text-pink-600 hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3.5">
                {relatedArticles.map((rel) => {
                  const relDate = new Date(rel.created_at).toLocaleDateString("vi-VN");
                  const relThumb = rel.thumbnail_webp_url || "/images/news_anti_drug_rally.png";
                  return (
                    <Link
                      key={rel.id}
                      href={`/tin-tuc/${rel.slug || rel.id}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-50 shrink-0 border border-purple-100">
                        <img
                          src={relThumb}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-bold text-xs text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          <span>{relDate}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* WIDGET 4: NÚT QUAY LẠI TỔNG QUAN */}
          <div>
            <Link
              href="/tin-tuc"
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-purple-600 bg-white px-4 py-3 rounded-2xl border border-purple-100 hover:border-purple-300 shadow-2xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Trang Tin Tức Học Đường</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

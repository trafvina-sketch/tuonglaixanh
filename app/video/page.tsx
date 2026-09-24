import React from "react";
import { supabase } from "@/lib/supabase";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { Film, ShieldCheck, PlayCircle, Video as VideoIcon } from "lucide-react";

export const revalidate = 0; // Dynamic fetch
export const dynamic = "force-dynamic";

const DEFAULT_VIDEOS = [
  {
    id: "v1",
    youtube_id: "lCCc0vcG2ww",
    youtube_url: "https://www.youtube.com/watch?v=lCCc0vcG2ww",
    title: 'Ma túy "tấn công" học sinh và ẩn khuất dưới nhiều vỏ bọc',
    description: 'Phóng sự điều tra VTV24 về thủ đoạn tinh vi của tội phạm ma túy nhắm vào giới trẻ và các biện pháp bảo vệ học đường.',
    category: 'canh_bao',
    order_index: 1,
  },
  {
    id: "v2",
    youtube_id: "YBaNAxRqoWE",
    youtube_url: "https://www.youtube.com/watch?v=YBaNAxRqoWE",
    title: 'Mối nguy ma túy "đội lốt" thuốc lá điện tử xâm nhập học đường',
    description: 'Cảnh báo về các loại tinh dầu thuốc lá điện tử trộn cần sa tổng hợp (ADB-BUTINACA) khiến nhiều học sinh ngộ độc, loạn thần.',
    category: 'canh_bao',
    order_index: 2,
  },
  {
    id: "v3",
    youtube_id: "MNJ04_MhS3E",
    youtube_url: "https://www.youtube.com/watch?v=MNJ04_MhS3E",
    title: 'Ma túy núp bóng thực phẩm, đồ uống tấn công giới trẻ',
    description: 'Truyền hình Công an Nhân dân (ANTV) vạch trần các loại "nước vui", "trà sữa", kẹo dẻo tẩm chất ma túy cực độc.',
    category: 'canh_bao',
    order_index: 3,
  },
  {
    id: "v4",
    youtube_id: "oD3amXjoeAs",
    youtube_url: "https://www.youtube.com/watch?v=oD3amXjoeAs",
    title: 'Cảnh báo nguy cơ học sinh ngộ độc ma túy ngụy trang',
    description: 'Phân tích các triệu chứng ngộ độc cấp tính và hướng dẫn sơ cứu khẩn cấp cho học sinh và giáo viên khi phát hiện bạn bè ngộ độc.',
    category: 'ky_nang',
    order_index: 4,
  },
  {
    id: "v5",
    youtube_id: "xlwoAeZtTvM",
    youtube_url: "https://www.youtube.com/watch?v=xlwoAeZtTvM",
    title: 'Ma túy mới "đầu độc" giới trẻ - Cảnh giác học đường',
    description: 'Tiếng chuông báo động về những chất gây nghiện thế hệ mới và kỹ năng tự vệ "4 Không" của học sinh.',
    category: 'ky_nang',
    order_index: 5,
  },
  {
    id: "v6",
    youtube_id: "K0G0jm40NBw",
    youtube_url: "https://www.youtube.com/watch?v=K0G0jm40NBw",
    title: 'Học sinh THPT nghiện ma túy - 1 thực trạng buồn và bài học thức tỉnh',
    description: 'Câu chuyện có thật về những vết trượt dài do tò mò và hành trình tìm lại ánh sáng tương lai của các bạn trẻ.',
    category: 'ky_nang',
    order_index: 6,
  },
];

export default async function VideoPage() {
  const { data: items } = await supabase
    .from("videos")
    .select("*")
    .order("order_index", { ascending: true });

  const videos = items && items.length > 0 ? items : DEFAULT_VIDEOS;

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* HEADER HIỆN ĐẠI ĐỒNG BỘ TRANG CHỦ */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-bold text-rose-700">
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Thư viện phim & phóng sự học đường</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent tracking-tight uppercase">
            Video & Phóng Sự Cảnh Báo
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Tuyển tập các phóng sự điều tra, phim ngắn cảnh báo và hướng dẫn kỹ năng tự vệ thực tế từ các kênh chính thống VTV24, Truyền hình Công an Nhân dân ANTV.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs text-amber-900 font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Tư liệu truyền thông chính thống</span>
        </div>
      </div>

      {/* DANH SÁCH VIDEO HIỆN ĐẠI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {videos.map((vid) => {
          const isWarning = vid.category === "canh_bao";
          return (
            <div
              key={vid.id}
              className="bg-white border border-rose-100/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group"
            >
              {/* KHUNG NHÚNG VIDEO YOUTUBE BO TRÒN HIỆN ĐẠI */}
              <div className="rounded-2xl overflow-hidden shadow-xs border border-rose-200/60 bg-slate-900">
                <YouTubeEmbed urlOrId={vid.youtube_id || vid.youtube_url} title={vid.title} />
              </div>

              <div className="space-y-2 pt-1 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs ${
                        isWarning
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-teal-50 text-teal-700 border-teal-200"
                      }`}
                    >
                      {isWarning ? "Cảnh Báo Khẩn" : "Kỹ Năng Thoát Hiểm"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5 text-rose-600" />
                      Trực tuyến YouTube HD
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                    {vid.title}
                  </h3>

                  {vid.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-normal mt-1.5 line-clamp-3">
                      {vid.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Nguồn: VTV24 / ANTV / Bộ Công An</span>
                  <span className="text-emerald-700 font-bold">● Giáo dục học đường</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

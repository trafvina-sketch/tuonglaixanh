import React from "react";

interface YouTubeEmbedProps {
  urlOrId: string;
  title?: string;
}

// Hàm trích xuất YouTube ID từ mọi dạng link
export function extractYouTubeId(url: string): string {
  if (!url) return "";
  // Nếu đã là ID 11 ký tự
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : "";
}

export default function YouTubeEmbed({ urlOrId, title = "Video tuyên truyền" }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(urlOrId);

  if (!videoId) {
    return (
      <div className="aspect-video bg-[#1E1B18] text-[#F8F4EA] rounded-2xl flex flex-col items-center justify-center p-4 text-center border-2 border-[#1E1B18]">
        <span className="text-3xl mb-1">🎬</span>
        <p className="text-xs font-heritage font-bold">Chưa có liên kết Video YouTube</p>
        <span className="text-[10px] text-[#D6C8B2] mt-0.5">Vui lòng dán liên kết video hợp lệ</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  ShieldCheck,
  Sprout,
  Star,
  Share2,
  Send,
  CheckCircle2,
  Award,
  Copy,
  X,
  Sparkles,
  MessageSquareHeart,
  ChevronRight,
  ExternalLink,
  Flame
} from "lucide-react";

interface Pledge {
  id: string;
  name: string;
  school_class: string;
  message: string;
  tag: string;
  likes: number;
  created_at: string;
}

interface PillarDetail {
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  summary: string;
  points: string[];
}

const PILLARS: Record<string, PillarDetail> = {
  health: {
    title: "Sống Khỏe Không Ma Túy",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50 border-rose-200",
    summary: "Xây dựng lối sống lành mạnh, trân trọng sức khỏe thể chất và tinh thần tuổi thanh xuân.",
    points: [
      "Kiên quyết thực hiện Quy tắc 3 KHÔNG: Không thử - Không giữ - Không rủ rê.",
      "Tập luyện thể thao đều đặn ít nhất 30 phút mỗi ngày để tạo năng lượng tích cực.",
      "Nói KHÔNG với thuốc lá điện tử, pod chill, nước vui và các chất kích thích trá hình.",
    ],
  },
  friends: {
    title: "Bạn Bè Tốt Nói Không",
    icon: Users,
    color: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-200",
    summary: "Xây dựng tình bạn trong sáng, cùng nhau tiến bộ và kịp thời can ngăn bạn bè khỏi cám dỗ.",
    points: [
      "Bản lĩnh từ chối dứt khoát: 'Mình không bao giờ dùng thứ này, hại người lắm!'.",
      "Kéo bạn bè tham gia các hoạt động tập thể lành mạnh, câu lạc bộ học tập.",
      "Kịp thời tâm sự với thầy cô nếu phát hiện bạn bè có dấu hiệu bị kẻ xấu lôi kéo.",
    ],
  },
  school: {
    title: "Trường Học An Toàn",
    icon: Sprout,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
    summary: "Mỗi lớp học là một pháo đài vững chắc, cùng chung tay bảo vệ môi trường giáo dục văn minh.",
    points: [
      "Tích cực tham gia các buổi sinh hoạt ngoại khóa tuyên truyền phòng chống ma túy.",
      "Sử dụng Hộp thư tố giác ẩn danh khi phát hiện dấu hiệu mua bán, dụ dỗ quanh cổng trường.",
      "Ghi nhớ Tổng đài Quốc gia Bảo vệ Trẻ em 111 và Cảnh sát 113 để được trợ giúp 24/7.",
    ],
  },
  future: {
    title: "Tương Lai Tươi Sáng",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
    summary: "Nuôi dưỡng ước mơ hoài bão, làm chủ công nghệ và tri thức để vươn tầm thế giới.",
    points: [
      "Ý thức rõ tương lai, sự nghiệp và danh dự gia đình nằm trong tay chính mình.",
      "Trang bị kỹ năng số thông minh để phát hiện các chiêu trò tiếp thị ma túy trên mạng xã hội.",
      "Trở thành một 'Đại sứ học đường an toàn' lan tỏa thông điệp sống đẹp đến cộng đồng.",
    ],
  },
};

const SUGGESTED_MESSAGES = [
  "Em cam kết nói KHÔNG tuyệt đối với ma túy, thuốc lá điện tử và bóng cười!",
  "Em chọn rèn luyện thể thao, học tập chăm chỉ vì một tương lai rạng rỡ!",
  "Em sẽ dũng cảm từ chối khi bị rủ rê và cùng bạn bè xây dựng lớp học an toàn!",
  "Em cam kết lan tỏa cẩm nang phòng chống ma túy ngụy trang đến các bạn trong trường!",
];

export default function CommunitySpread() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [totalCount, setTotalCount] = useState<number>(1868);
  const [loading, setLoading] = useState(true);

  // Modals & Panels
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [certificateData, setCertificateData] = useState<{
    name: string;
    school_class: string;
    date: string;
    code: string;
  } | null>(null);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formClass, setFormClass] = useState("");
  const [formMessage, setFormMessage] = useState(SUGGESTED_MESSAGES[0]);
  const [formTag, setFormTag] = useState("Cam kết sống đẹp");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Copy toast
  const [copied, setCopied] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  // Tải dữ liệu ban đầu
  useEffect(() => {
    async function fetchPledges() {
      try {
        const res = await fetch("/api/community");
        const json = await res.json();
        if (json.success && json.pledges) {
          setPledges(json.pledges);
          if (json.total_count) setTotalCount(json.total_count);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách cam kết:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPledges();
  }, []);

  // Xử lý Like
  const handleLike = async (id: string) => {
    if (likedIds[id]) return;

    // Optimistic update
    setLikedIds((prev) => ({ ...prev, [id]: true }));
    setPledges((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

    try {
      await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", pledge_id: id }),
      });
    } catch (e) {
      console.error("Lỗi like:", e);
    }
  };

  // Xử lý gửi cam kết
  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMessage.trim()) {
      setFormError("Vui lòng chọn hoặc viết thông điệp cam kết.");
      return;
    }
    setFormError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pledge",
          name: formName || "Học sinh tích cực",
          school_class: formClass || "Chi đội an toàn",
          message: formMessage,
          tag: formTag,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setFormError(data.error || "Gửi cam kết không thành công.");
        setSubmitting(false);
        return;
      }

      // Cập nhật danh sách trên UI
      if (data.pledge) {
        setPledges((prev) => [data.pledge, ...prev]);
        setTotalCount((c) => c + 1);
      }

      // Tạo chứng nhận điện tử
      const now = new Date();
      const dateStr = `Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
      const codeStr = `LCHD-${Math.floor(100000 + Math.random() * 900000)}`;
      setCertificateData({
        name: formName.trim() || "Học sinh tích cực",
        school_class: formClass.trim() || "Chi đội an toàn",
        date: dateStr,
        code: codeStr,
      });

      setShowPledgeModal(false);
      setFormName("");
      setFormClass("");
    } catch (err: any) {
      setFormError(err.message || "Đã xảy ra sự cố.");
    } finally {
      setSubmitting(false);
    }
  };

  // Copy link trang web
  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "https://phong-chong-ma-tuy-hoc-duong.vercel.app";
    const textToCopy = `Cùng mình tham gia ký cam kết 'Trường học an toàn - Không ma túy' tại: ${url} ❤️ #LaChanHocDuong #TruongHocKhongMaTuy`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "https://phong-chong-ma-tuy-hoc-duong.vercel.app");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const handleShareZalo = () => {
    const url = encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "https://phong-chong-ma-tuy-hoc-duong.vercel.app");
    window.open(`https://zalo.me/share?url=${url}`, "_blank");
  };

  return (
    <div id="lan-toa" className="md:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
      
      {/* 1. HEADER CỘNG ĐỒNG LAN TỎA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-teal-400 text-white flex items-center justify-center shadow-xs shadow-purple-500/20">
            <span className="text-lg">🪐</span>
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base uppercase bg-gradient-to-r from-purple-700 via-pink-600 to-teal-600 bg-clip-text text-transparent tracking-wide flex items-center gap-1.5">
              <span>Cùng Nhau Lan Tỏa</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-50 text-pink-600 border border-pink-200">
                <Flame className="w-3 h-3 fill-pink-500 mr-0.5" />
                Vũ trụ diệu kỳ
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Đã có <span className="font-bold text-purple-600">{totalCount.toLocaleString("vi-VN")}+</span> Thầy Cô & Học sinh tham gia ký cam kết
            </p>
          </div>
        </div>

        {/* CÁC NÚT HÀNH ĐỘNG NHANH */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 rounded-xl border border-purple-200 hover:border-purple-300 bg-purple-50/60 hover:bg-purple-50 text-slate-700 hover:text-purple-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Chia sẻ lên mạng xã hội"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lan tỏa</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPledgeModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" style={{ animationDuration: "3s" }} />
            <span>Ký Cam Kết</span>
          </button>
        </div>
      </div>

      {/* 2. 4 TRỤ CỘT LAN TỎA (CÓ TƯƠNG TÁC CLICK XEM CHI TIẾT) */}
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <span>4 Trụ cột bảo vệ học đường:</span>
          <span className="text-[10px] text-slate-400 font-normal">(Chạm vào từng trụ cột để xem bí kíp)</span>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          
          <button
            type="button"
            onClick={() => setActivePillar("health")}
            className="p-2.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-100 hover:border-rose-300 transition-all flex flex-col items-center group cursor-pointer text-left sm:text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 group-hover:bg-rose-200 text-rose-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-rose-700 transition-colors">
              Sống khỏe không ma túy
            </span>
            <span className="text-[9px] text-rose-600 font-semibold mt-0.5">Bí kíp 3 KHÔNG &rarr;</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar("friends")}
            className="p-2.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 border border-sky-100 hover:border-sky-300 transition-all flex flex-col items-center group cursor-pointer text-left sm:text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 group-hover:bg-sky-200 text-sky-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-sky-700 transition-colors">
              Bạn bè tốt nói không
            </span>
            <span className="text-[9px] text-sky-600 font-semibold mt-0.5">Kỹ năng từ chối &rarr;</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar("school")}
            className="p-2.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col items-center group cursor-pointer text-left sm:text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 text-emerald-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Sprout className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
              Trường học an toàn
            </span>
            <span className="text-[9px] text-emerald-600 font-semibold mt-0.5">Kênh bảo vệ &rarr;</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar("future")}
            className="p-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-100 hover:border-amber-300 transition-all flex flex-col items-center group cursor-pointer text-left sm:text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 group-hover:bg-amber-200 text-amber-600 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-amber-700 transition-colors">
              Tương lai tươi sáng
            </span>
            <span className="text-[9px] text-amber-600 font-semibold mt-0.5">Khát vọng sống &rarr;</span>
          </button>

        </div>
      </div>

      {/* 3. TƯỜNG THÔNG ĐIỆP LAN TỎA (COMMUNITY WALL THỰC TẾ) */}
      <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a]">
            <MessageSquareHeart className="w-3.5 h-3.5 text-rose-500" />
            <span>Lời nhắn gửi từ các Đại sứ học đường:</span>
          </div>
          <button
            type="button"
            onClick={() => setShowPledgeModal(true)}
            className="text-[11px] font-bold text-[#0284c7] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>+ Gửi lời nhắn</span>
          </button>
        </div>

        {/* DANH SÁCH 2-3 LỜI NHẮN MỚI NHẤT */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {pledges.slice(0, 3).map((item) => {
            const isLiked = likedIds[item.id];
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-colors flex items-start justify-between gap-2.5"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs text-slate-900 truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({item.school_class})
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-sky-50 text-[#0284c7] border border-sky-100">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{item.message}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLike(item.id)}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                    isLiked
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200"
                  }`}
                  title="Thả tim thông điệp này"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-400"} transition-transform`}
                  />
                  <span>{item.likes}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POPUP CHI TIẾT TRỤ CỘT BẢO VỆ                                             */}
      {/* ========================================================================= */}
      {activePillar && PILLARS[activePillar] && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${PILLARS[activePillar].bgColor}`}>
                  {React.createElement(PILLARS[activePillar].icon, {
                    className: `w-6 h-6 ${PILLARS[activePillar].color}`,
                  })}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#1e3a8a] leading-tight">
                    {PILLARS[activePillar].title}
                  </h4>
                  <p className="text-xs text-slate-500">Cẩm nang hành động thực tế</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePillar(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              {PILLARS[activePillar].summary}
            </p>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">3 Lời khuyên hành động:</p>
              <ul className="space-y-2">
                {PILLARS[activePillar].points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setActivePillar(null);
                  setShowPledgeModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md transition-colors text-center"
              >
                Ký cam kết theo tinh thần này ngay &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL KÝ CAM KẾT HỌC ĐƯỜNG                                                */}
      {/* ========================================================================= */}
      {showPledgeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-sky-100 text-[#0284c7] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#1e3a8a]">
                    Ký Cam Kết "Lá Chắn Học Đường"
                  </h4>
                  <p className="text-xs text-slate-500">Trở thành Đại sứ an toàn học đường</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPledgeModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPledge} className="space-y-3.5 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Họ và tên của bạn:
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Nguyễn Tuấn Anh (hoặc để ẩn danh)"
                    maxLength={50}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Lớp / Trường / Đơn vị:
                  </label>
                  <input
                    type="text"
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    placeholder="VD: Lớp 8A2 - THCS Lam Sơn"
                    maxLength={50}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chọn thông điệp hành động nhanh:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {SUGGESTED_MESSAGES.map((msg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormMessage(msg)}
                      className={`text-left p-2 rounded-xl border transition-all text-[11px] leading-relaxed cursor-pointer ${
                        formMessage === msg
                          ? "bg-sky-50 border-sky-400 text-[#0284c7] font-bold"
                          : "bg-slate-50/70 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      🌱 {msg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hoặc tự viết lời nhắn lan tỏa của riêng bạn:
                </label>
                <textarea
                  rows={2}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Viết lời nhắn gửi tới bạn bè và thầy cô..."
                  maxLength={300}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPledgeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-600 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-sky-500/25 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Đang ghi nhận..." : "Xác Nhận Ký Cam Kết"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL HIỂN THỊ CHỨNG NHẬN ĐẠI SỨ HỌC ĐƯỜNG AN TOÀN                         */}
      {/* ========================================================================= */}
      {certificateData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                CHỨNG NHẬN DANH DỰ
              </span>
              <h3 className="text-lg font-black text-[#1e3a8a] uppercase tracking-tight">
                ĐẠI SỨ LÁ CHẮN HỌC ĐƯỜNG
              </h3>
              <p className="text-xs text-slate-500">Dự án Phòng Chống Ma Túy & Bạo Lực Học Đường</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs space-y-2">
              <p className="text-xs text-slate-600">Trân trọng chứng nhận:</p>
              <h4 className="text-base font-extrabold text-[#0284c7]">
                {certificateData.name}
              </h4>
              <p className="text-xs font-semibold text-slate-700">
                Đơn vị: {certificateData.school_class}
              </p>
              <p className="text-[11px] text-slate-500 italic pt-1">
                "Đã chính thức tham gia ký cam kết nói KHÔNG với ma túy, chung tay xây dựng trường học an toàn và lành mạnh!"
              </p>
              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                <span>Mã số: <b className="text-slate-600">{certificateData.code}</b></span>
                <span>{certificateData.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "Đã chép link!" : "Khoe bạn bè"}</span>
              </button>

              <button
                type="button"
                onClick={() => setCertificateData(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL CHIA SẺ MẠNG XÃ HỘI                                                  */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm sm:text-base text-[#1e3a8a] flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#0284c7]" />
                <span>Lan Tỏa Tới Bạn Bè</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mỗi lượt chia sẻ của bạn là một lá chắn bảo vệ thêm nhiều bạn học sinh khỏi nguy cơ ma túy ngụy trang!
            </p>

            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <button
                type="button"
                onClick={handleShareZalo}
                className="w-full py-2.5 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>💬 Chia sẻ vào nhóm Zalo (Lớp / Phụ huynh)</span>
              </button>

              <button
                type="button"
                onClick={handleShareFacebook}
                className="w-full py-2.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>🌐 Chia sẻ lên Facebook</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{copied ? "Đã sao chép liên kết!" : "Sao chép liên kết trang web"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

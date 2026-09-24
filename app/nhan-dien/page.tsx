"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  BookOpen, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ZoomIn,
  Maximize2,
  X,
  PhoneCall,
  Search,
  Eye,
  Info
} from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";

interface NarcoticsItem {
  id: string;
  name: string;
  street_names: string;
  disguise_type: string;
  harm_description: string;
  danger_level: string;
  order_index: number;
  image_webp_url?: string;
}

const FALLBACK_ITEMS: NarcoticsItem[] = [
  {
    id: "fb-1",
    name: "Tinh Dầu Pod Chill",
    street_names: "Pod chill, Pod dầu, Vape chill, Khói thơm",
    disguise_type: "Ống hút điện tử nhiều màu sắc, tỏa hương thơm ngát vị dâu, xoài, việt quất",
    harm_description: "Bản chất chứa chất cần sa tổng hợp nguy hiểm (ADB-BUTINACA). Làm loạn nhịp tim, co giật, suy hô hấp, hôn mê sâu và ảo giác mạnh ngay từ lần đầu tiên sử dụng.",
    danger_level: "extreme",
    order_index: 1,
    image_webp_url: "https://pjegwrjxooaemxlpkwxy.supabase.co/storage/v1/object/public/app-assets/catalog/1790082146069_images.webp",
  },
  {
    id: "fb-2",
    name: "Nước Vui (Chali / Trà Sữa)",
    street_names: "Nước vui, Nước dâu, Nước xoài Chali, Nước sướng",
    disguise_type: "Gói bột hòa tan in hình trái cây bắt mắt hoặc giả dạng gói trà túi lọc, bột collagen",
    harm_description: "Hỗn hợp cực độc trộn lẫn Ketamine, Ecstasy (thuốc lắc) và thuốc an thần Diazepam. Gây co giật toàn thân, xuất huyết não, hoại tử nội tạng và tử vong nhanh chóng.",
    danger_level: "extreme",
    order_index: 2,
    image_webp_url: "https://pjegwrjxooaemxlpkwxy.supabase.co/storage/v1/object/public/app-assets/catalog/1790082199474_mt_pha_tron.webp",
  },
  {
    id: "fb-3",
    name: "Tem Giấy (Bùa Lưỡi)",
    street_names: "Bùa lưỡi, Tem giấy, Bùa ảo giác, LSD",
    disguise_type: "Miếng giấy nhỏ bằng móng tay in hình các nhân vật hoạt hình ngộ nghĩnh, ngậm dưới lưỡi",
    harm_description: "Chứa chất ma túy bán tổng hợp cực mạnh LSD. Gây ảo giác dị thường về không gian và thời gian, hoang tưởng bị truy sát, dẫn đến hành vi nhảy lầu tự sát.",
    danger_level: "extreme",
    order_index: 3,
    image_webp_url: "https://pjegwrjxooaemxlpkwxy.supabase.co/storage/v1/object/public/app-assets/catalog/1790082263342_Screen_Shot_2016_10_24_at_7_01_16_AM.webp",
  },
  {
    id: "fb-4",
    name: "Sô-cô-la Chill (Chocochill)",
    street_names: "Kẹo chill, Bánh lười (Lazy Cakes), Bánh cần",
    disguise_type: "Thanh sô-cô-la hoặc bánh quy ăn vặt đóng gói như hàng nhập khẩu cao cấp",
    harm_description: "Tẩm tinh dầu cần sa và chất kích thích thần kinh. Làm tê liệt vùng nhận thức của não bộ tuổi dậy thì, mất trí nhớ, ảo thanh và nghiện lệ thuộc.",
    danger_level: "danger",
    order_index: 4,
    image_webp_url: "https://pjegwrjxooaemxlpkwxy.supabase.co/storage/v1/object/public/app-assets/catalog/1790082316068_ma_tuy_socola_1216.webp",
  },
  {
    id: "fb-5",
    name: "Bóng Cười (Khí N2O)",
    street_names: "Bóng cười, Khí cười, Dinitrogen monoxide",
    disguise_type: "Quả bóng cao su bơm đầy khí để hít trực tiếp bằng miệng",
    harm_description: "Khí N2O gây ức chế hệ thần kinh trung ương, phá hủy tế bào tủy sống, gây tê liệt vận động 2 chân và tổn thương vĩnh viễn hệ thần kinh não bộ.",
    danger_level: "danger",
    order_index: 5,
    image_webp_url: "https://pjegwrjxooaemxlpkwxy.supabase.co/storage/v1/object/public/app-assets/catalog/1790082358362_images2151740_7a_luyp.webp",
  },
];

export default function NhanDienPage() {
  const [catalog, setCatalog] = useState<NarcoticsItem[]>(FALLBACK_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<NarcoticsItem | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  // Tải danh mục thực tế từ Supabase
  useEffect(() => {
    async function loadCatalog() {
      try {
        const { data, error } = await supabase
          .from("narcotics_catalog")
          .select("*")
          .order("order_index", { ascending: true });

        if (data && data.length > 0) {
          setCatalog(data);
        }
      } catch (err) {
        console.warn("Dùng danh mục dự phòng:", err);
      }
    }
    loadCatalog();
  }, []);

  // Lắng nghe phím ESC để đóng popup
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (zoomedImage) {
        setZoomedImage(null);
      } else if (selectedItem) {
        setSelectedItem(null);
      }
    }
  }, [zoomedImage, selectedItem]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lọc theo từ khóa tìm kiếm
  const filteredCatalog = catalog.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      (item.street_names && item.street_names.toLowerCase().includes(q)) ||
      (item.disguise_type && item.disguise_type.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* HEADER HIỆN ĐẠI ĐỒNG BỘ TRANG CHỦ */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-bold text-rose-700">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cẩm nang nhận diện ma túy ngụy trang</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-rose-700 via-pink-600 to-amber-600 bg-clip-text text-transparent tracking-tight uppercase">
            Nhận Diện Ma Túy Thế Hệ Mới
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Vạch trần bộ mặt thật của các loại ma dược đội lốt bánh kẹo, nước giải khát và khói thơm chốn học đường. Bấm vào từng loại để xem chi tiết & phóng to ảnh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-xs text-amber-900 font-bold shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Thông tin đối chiếu Y tế & Công an</span>
        </div>
      </div>

      {/* THANH TÌM KIẾM NHANH LOẠI MA TÚY */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-rose-100 shadow-2xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên gọi, tiếng lóng (pod, chali, tem, cỏ...)"
            className="w-full pl-10 pr-4 py-2 bg-rose-50/30 border border-rose-200/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/20 focus:bg-white transition-all placeholder-slate-400"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
          Hiển thị: <strong className="text-rose-600">{filteredCatalog.length}</strong> loại ma túy ngụy trang
        </div>
      </div>

      {/* DANH SÁCH THẺ NHẬN DIỆN TƯƠNG TÁC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredCatalog.map((item) => {
          const isExtreme = item.danger_level === "extreme";
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white border border-rose-100/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4 group cursor-pointer hover:border-rose-300 relative"
            >
              {/* PHẦN ĐẦU THẺ: TÊN & HUY HIỆU MỨC ĐỘ ĐỘC */}
              <div className="flex items-start justify-between gap-3 border-b border-rose-100/80 pb-3">
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-rose-600 transition-colors leading-snug flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <Info className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    <span className="text-slate-400">Tên gọi ngụy trang:</span>{" "}
                    <strong className="text-slate-700">{item.street_names}</strong>
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs whitespace-nowrap shrink-0 ${
                    isExtreme
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {isExtreme ? "Cực độc - Nguy hiểm" : "Cảnh báo cao"}
                </span>
              </div>

              {/* HÌNH ẢNH TRỰC QUAN WEBP VỚI NÚT PHÓNG TO */}
              <div 
                className="w-full aspect-[16/10] rounded-2xl border border-slate-200/70 overflow-hidden bg-slate-100 relative group/img cursor-zoom-in"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.image_webp_url) {
                    setZoomedImage({
                      url: item.image_webp_url,
                      title: item.name,
                      subtitle: item.street_names,
                    });
                  } else {
                    setSelectedItem(item);
                  }
                }}
              >
                {item.image_webp_url ? (
                  <ImageWithFallback
                    src={item.image_webp_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <span className="text-3xl mb-1">📷</span>
                    <span>Chưa có ảnh thumbnail</span>
                  </div>
                )}
                
                {/* NHÃN TIẾNG LÓNG TRÊN ẢNH */}
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/20 shadow-xs">
                  {item.street_names}
                </div>

                {/* NÚT PHÓNG TO ẢNH TRỰC TIẾP */}
                <div className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-xl backdrop-blur-md opacity-80 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-medium">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Phóng to</span>
                </div>
              </div>

              {/* BỀ NGOÀI NGỤY TRANG */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 space-y-1">
                <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Bề ngoài ngụy trang (Mặt nạ lừa đảo)
                </span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2">
                  {item.disguise_type}
                </p>
              </div>

              {/* BẢN CHẤT CHẤT ĐỘC */}
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 space-y-1 text-rose-900">
                <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Bản chất hủy diệt sức khỏe & tương lai
                </span>
                <p className="text-xs font-semibold leading-relaxed line-clamp-2">
                  {item.harm_description}
                </p>
              </div>

              {/* KHẨU HIỆU & NÚT XEM CHI TIẾT */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Không thử dù chỉ 1 lần!</span>
                </div>
                <span className="font-bold text-rose-600 group-hover:text-pink-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. MODAL XEM CHI TIẾT ĐẦY ĐỦ NỘI DUNG MA TÚY                               */}
      {/* ========================================================================= */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative bg-white border border-rose-100 rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* NÚT ĐÓNG MODAL */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-slate-600 flex items-center justify-center transition-colors z-10"
              title="Đóng (Phím Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER MODAL */}
            <div className="space-y-1.5 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    selectedItem.danger_level === "extreme"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {selectedItem.danger_level === "extreme" ? "CỰC ĐỘC - NGUY HIỂM" : "CẢNH BÁO CAO"}
                </span>
                <span className="text-xs text-slate-400 font-medium">Mã nhận diện: #{selectedItem.order_index}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent tracking-tight">
                {selectedItem.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Tiếng lóng & Tên gọi khác: <strong className="text-slate-800">{selectedItem.street_names}</strong>
              </p>
            </div>

            {/* HÌNH ẢNH TO RÕ NÉT CÓ NÚT PHÓNG TO */}
            <div 
              className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in group"
              onClick={() => {
                if (selectedItem.image_webp_url) {
                  setZoomedImage({
                    url: selectedItem.image_webp_url,
                    title: selectedItem.name,
                    subtitle: selectedItem.street_names,
                  });
                }
              }}
            >
              {selectedItem.image_webp_url ? (
                <ImageWithFallback
                  src={selectedItem.image_webp_url}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <span className="text-4xl mb-1">📷</span>
                  <span>Chưa có ảnh</span>
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Bấm vào ảnh để phóng to toàn màn hình</span>
              </div>
            </div>

            {/* KHỐI 1: THỦ ĐOẠN NGỤY TRANG */}
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-1.5">
              <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                1. Thủ đoạn ngụy trang (Mặt nạ lừa đảo học sinh):
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedItem.disguise_type}
              </p>
            </div>

            {/* KHỐI 2: BẢN CHẤT CHẤT ĐỘC */}
            <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-4 space-y-1.5">
              <h3 className="text-xs font-extrabold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                2. Bản chất hủy diệt sức khỏe & tương lai:
              </h3>
              <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-semibold">
                {selectedItem.harm_description}
              </p>
            </div>

            {/* KHỐI 3: DẤU HIỆU CẢNH BÁO KHẨN CẤP */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-xs text-slate-700">
              <h3 className="font-extrabold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                3. Khẩu quyết phòng vệ học đường:
              </h3>
              <ul className="space-y-1 list-disc list-inside text-slate-600 font-medium">
                <li>Tuyệt đối không nhận đồ ăn vặt, kẹo gấu, nước uống mở nắp sẵn từ người lạ ngoài cổng trường.</li>
                <li>Không thử dù chỉ một hơi pod thơm hay một ngụm nước ngọt do bạn bè thách đố.</li>
                <li>Nếu nghi ngờ ai đó bị ngộ độc (lơ mơ, co giật, ảo giác), gọi ngay cho Thầy Cô và Y tế trường học.</li>
              </ul>
            </div>

            {/* HÀNG NÚT HÀNH ĐỘNG DƯỚI CÙNG */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-slate-500">Cứu viện khẩn:</span>
                <a href="tel:111" className="text-rose-600 hover:underline flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" /> 111 (Trẻ em)
                </a>
                <span>•</span>
                <a href="tel:113" className="text-rose-600 hover:underline flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" /> 113 (Công an)
                </a>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/khao-thi"
                  className="flex-1 sm:flex-initial bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Thử thách giải ải này</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  Đóng lại
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIGHTBOX PHÓNG TO ẢNH TOÀN MÀN HÌNH (FULLSCREEN IMAGE ZOOM)             */}
      {/* ========================================================================= */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          {/* NÚT ĐÓNG LIGHTBOX */}
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
            title="Đóng phóng to (Phím Esc hoặc bấm ra ngoài)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* KHUNG HIỂN THỊ ẢNH TO TOÀN MÀN HÌNH */}
          <div 
            className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage.url}
              alt={zoomedImage.title}
              className="max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>

          {/* CHÚ THÍCH DƯỚI ẢNH */}
          <div 
            className="mt-3 text-center text-white max-w-md bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-extrabold text-sm sm:text-base text-white">{zoomedImage.title}</h4>
            {zoomedImage.subtitle && (
              <p className="text-xs text-sky-200 mt-0.5">Tên lóng: {zoomedImage.subtitle}</p>
            )}
            <p className="text-[10px] text-slate-300 mt-1">Bấm ra ngoài hoặc bấm nút X để đóng</p>
          </div>
        </div>
      )}

    </div>
  );
}

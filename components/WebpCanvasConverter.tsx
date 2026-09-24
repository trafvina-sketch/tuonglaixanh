"use client";

import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, Image as ImageIcon, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface WebpCanvasConverterProps {
  onUploadSuccess: (publicUrl: string) => void;
  folderPath?: string;
  label?: string;
  maxDimension?: number;
  quality?: number;
}

export default function WebpCanvasConverter({
  onUploadSuccess,
  folderPath = "articles",
  label = "Chọn ảnh từ máy tính (Tự động nén sang .WebP)",
  maxDimension = 1200,
  quality = 0.8,
}: WebpCanvasConverterProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [webpBlob, setWebpBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<{
    origSize: string;
    webpSize: string;
    ratio: string;
  } | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chuyển đổi ảnh sang WebP bằng HTML5 Canvas trực tiếp trên trình duyệt
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    setIsConverting(true);
    setCompressionInfo(null);
    setIsUploaded(false);
    setUploadedUrl(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Tính toán kích thước thu phóng tối ưu giữ nguyên tỷ lệ
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Vẽ lên Canvas để nén và convert sang .webp
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                setWebpBlob(blob);
                const webpUrl = URL.createObjectURL(blob);
                setPreviewUrl(webpUrl);

                // Tính toán tỷ lệ nén
                const origMB = (file.size / (1024 * 1024)).toFixed(2);
                const webpKB = (blob.size / 1024).toFixed(0);
                const savedPercent = Math.round(((file.size - blob.size) / file.size) * 100);

                setCompressionInfo({
                  origSize: `${origMB} MB (${file.name})`,
                  webpSize: `${webpKB} KB (.webp)`,
                  ratio: `${savedPercent}%`,
                });
              }
              setIsConverting(false);
            },
            "image/webp",
            quality
          );
        } else {
          setIsConverting(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Upload file WebP nén lên Supabase Storage thông qua Server API /api/upload
  const handleUpload = async () => {
    if (!webpBlob || !originalFile) return;

    setIsUploading(true);
    try {
      const cleanName = originalFile.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_") + ".webp";
      
      // Cách 1: Gọi qua API Route /api/upload (Sử dụng service_role key, 100% vượt qua RLS an toàn)
      const formData = new FormData();
      formData.append("file", webpBlob, cleanName);
      formData.append("folder", folderPath);
      formData.append("filename", cleanName);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        setIsUploaded(true);
        setUploadedUrl(resData.url);
        onUploadSuccess(resData.url);
        return;
      }

      // Cách 2 (Dự phòng): Nếu API máy chủ có trục trặc, upload trực tiếp qua client
      console.warn("API upload fallback, thử upload trực tiếp...", resData.error);
      const filePath = `${folderPath}/${Date.now()}_${cleanName}`;
      const { data, error } = await supabase.storage
        .from("app-assets")
        .upload(filePath, webpBlob, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("app-assets")
        .getPublicUrl(filePath);

      setIsUploaded(true);
      setUploadedUrl(publicUrlData.publicUrl);
      onUploadSuccess(publicUrlData.publicUrl);
    } catch (err: any) {
      console.error("Lỗi upload Supabase:", err.message);
      alert("Lỗi khi tải ảnh lên Supabase: " + (err.message || err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-[#1e3a8a] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {label}
        </label>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284c7] border border-sky-200/80">
          NÉN WEBP TIẾT KIỆM 95%
        </span>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/40 hover:bg-sky-50/80 rounded-2xl p-4 text-center cursor-pointer transition-colors group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Upload className="w-6 h-6 text-[#0284c7] mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
        <p className="text-xs font-bold text-slate-800">Bấm vào đây để chọn ảnh từ thiết bị</p>
        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
          Hỗ trợ JPG, PNG, HEIC — Trình duyệt tự nén thành .webp siêu nhẹ
        </p>
      </div>

      {isConverting && (
        <div className="flex items-center justify-center gap-2 text-xs text-sky-600 font-bold py-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Đang tối ưu và nén ảnh sang .WebP...</span>
        </div>
      )}

      {compressionInfo && previewUrl && (
        <div className="space-y-3 pt-2">
          {/* Thông tin nén */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 flex-1">
              <p className="font-bold">Đã nén và chuyển đổi sang .WebP thành công!</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>Dung lượng gốc: <strong className="text-slate-700">{compressionInfo.origSize}</strong></div>
                <div>Sau khi nén: <strong className="text-emerald-700">{compressionInfo.webpSize}</strong></div>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold pt-0.5">
                ⚡ Tiết kiệm {compressionInfo.ratio} dung lượng lưu trữ!
              </p>
            </div>
          </div>

          {/* Xem trước ảnh hoặc trạng thái đã upload */}
          {isUploaded ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Đã lưu ảnh WebP lên hệ thống thành công!</p>
                  <p className="text-[10px] text-emerald-700/80 truncate max-w-xs">{uploadedUrl}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOriginalFile(null);
                  setWebpBlob(null);
                  setPreviewUrl(null);
                  setCompressionInfo(null);
                  setIsUploaded(false);
                  setUploadedUrl(null);
                }}
                className="text-xs font-bold text-[#0284c7] underline hover:text-[#0369a1] shrink-0"
              >
                Đổi ảnh khác
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 relative shadow-xs">
                <img src={previewUrl} alt="Preview WebP" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm shadow-sky-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tải lên hệ thống lưu trữ...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Lưu ảnh WebP này lên Cloud Storage</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

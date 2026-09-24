"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Eraser,
  Sparkles,
  Eye,
  Code,
  FileEdit,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  thumbnailToInsert?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Soạn thảo nội dung bài viết tuyên truyền...",
  thumbnailToInsert,
}: RichTextEditorProps) {
  const [viewMode, setViewMode] = useState<"visual" | "preview" | "code">("visual");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#0284c7] underline font-bold hover:text-[#0369a1]",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-2xl shadow-md my-4 max-w-full mx-auto border border-slate-200",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[260px] p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-slate-800 " +
          "[&>h2]:text-xl [&>h2]:font-black [&>h2]:text-[#1e3a8a] [&>h2]:mt-6 [&>h2]:mb-2.5 " +
          "[&>h3]:text-base [&>h3]:font-extrabold [&>h3]:text-[#b91c1c] [&>h3]:mt-4 [&>h3]:mb-1.5 " +
          "[&>h4]:text-sm [&>h4]:font-bold [&>h4]:text-slate-800 [&>h4]:mt-3 " +
          "[&>p]:mb-3 [&>p]:leading-relaxed " +
          "[&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ul]:mb-3 " +
          "[&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>ol]:mb-3 " +
          "[&>blockquote]:border-l-4 [&>blockquote]:border-[#0284c7] [&>blockquote]:bg-sky-50/70 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:rounded-r-xl [&>blockquote]:italic [&>blockquote]:text-sky-950 [&>blockquote]:my-3 " +
          "[&>hr]:my-6 [&>hr]:border-slate-200",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Đồng bộ nội dung khi value bên ngoài thay đổi (ví dụ khi reset form)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (value === "" || Math.abs(editor.getHTML().length - value.length) > 5) {
        editor.commands.setContent(value || "");
      }
    }
  }, [value, editor]);

  if (!editor) return null;

  // Thêm liên kết
  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập địa chỉ liên kết (URL):", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // Thêm hình ảnh
  const handleInsertImage = (url?: string) => {
    const imageUrl = url || window.prompt("Dán đường link ảnh WebP hoặc URL ảnh:");
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: "Ảnh minh họa bài viết" }).run();
    }
  };

  // Chèn Hộp Cảnh Báo Khẩn (Callout Box)
  const handleInsertWarningBox = () => {
    const quoteHtml = `
      <blockquote style="border-left: 4px solid #ef4444; background-color: #fef2f2; padding: 12px 16px; border-radius: 0 16px 16px 0; margin: 16px 0;">
        <strong style="color: #b91c1c; display: block; margin-bottom: 4px;">⚠️ LỜI CẢNH TỈNH HỌC ĐƯỜNG:</strong>
        <p style="color: #7f1d1d; margin: 0;">Tuyệt đối không hút thử dù chỉ một hơi, không nếm kẹo lạ hay đồ uống không rõ nguồn gốc!</p>
      </blockquote>
      <p></p>
    `;
    editor.chain().focus().insertContent(quoteHtml).run();
  };

  // Chèn Hộp Mẹo Thoát Hiểm (Safety Box)
  const handleInsertSafetyBox = () => {
    const safetyHtml = `
      <blockquote style="border-left: 4px solid #0f766e; background-color: #f0fdfa; padding: 12px 16px; border-radius: 0 16px 16px 0; margin: 16px 0;">
        <strong style="color: #0f766e; display: block; margin-bottom: 4px;">🛡️ KẾ SÁCH THOÁT HIỂM AN TOÀN:</strong>
        <p style="color: #134e4a; margin: 0;">Bước 1: Lắc đầu dứt khoát. Bước 2: Viện cớ sức khỏe (viêm xoang/dị ứng). Bước 3: Rút lui ngay về phía thầy cô hoặc bảo vệ.</p>
      </blockquote>
      <p></p>
    `;
    editor.chain().focus().insertContent(safetyHtml).run();
  };

  // Chèn Mẫu Bài Viết Tuyên Truyền Chuẩn (Standard Template)
  const handleInsertTemplate = () => {
    if (editor.getText().trim() && !confirm("Bài viết đang có chữ, Thầy có muốn chèn khung mẫu bài viết chuẩn vào?")) {
      return;
    }
    const templateHtml = `
      <h2>1. Thực trạng & Chiêu trò lừa dối học đường</h2>
      <p>Hiện nay, nhiều loại thuốc lá điện tử (Pod Chill) và ma túy ngụy trang đang lén lút tiếp cận các bạn học sinh dưới vỏ bọc bắt mắt như thỏi son, bút dạ quang hay chai nước ngọt giải khát.</p>
      
      <blockquote style="border-left: 4px solid #ef4444; background-color: #fef2f2; padding: 12px 16px; border-radius: 0 16px 16px 0; margin: 16px 0;">
        <strong style="color: #b91c1c; display: block; margin-bottom: 4px;">⚠️ CẢNH BÁO TÁC HẠI HỦY HOẠI NÃO BỘ:</strong>
        <p style="color: #7f1d1d; margin: 0;">Chất độc trong tinh dầu ngụy trang có thể gây nghiện tức thì, phá hủy tế bào thần kinh và làm suy giảm trí nhớ vĩnh viễn.</p>
      </blockquote>

      <h2>2. Nhận diện các dấu hiệu nguy hiểm</h2>
      <ul>
        <li><strong>Về hình thức:</strong> Bao bì in hình hoạt hình sặc sỡ, có mùi thơm nhân tạo mùi kẹo ngọt, hoa quả.</li>
        <li><strong>Về hành vi:</strong> Thường xuyên tụ tập ở góc khuất, nhà vệ sinh hoặc ngõ vắng để rủ rê lôi kéo.</li>
      </ul>

      <h2>3. Lời dặn dò dành cho học sinh THCS</h2>
      <p>Khi bị người khác ép buộc hoặc thách thức, các bạn học sinh hãy luôn nhớ quy tắc <strong>"4 Không"</strong>: Không tò mò - Không thử - Không giữ hộ - Báo ngay cho Thầy Cô và Tổng đài 111!</p>
    `;
    editor.chain().focus().setContent(templateHtml).run();
  };

  return (
    <div className="border border-slate-300 rounded-2xl bg-white shadow-xs overflow-hidden transition-all focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20">
      
      {/* THANH CÔNG CỤ SOẠN THẢO (WORD-LIKE TOOLBAR) */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-1.5 select-none">
        
        {/* NHÓM 1: TIÊU ĐỀ & ĐOẠN VĂN */}
        <div className="flex items-center gap-0.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              editor.isActive("paragraph") ? "bg-sky-100 text-[#0284c7]" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Đoạn văn bình thường"
          >
            <Pilcrow className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Văn bản</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 2 }) ? "bg-sky-100 text-[#0284c7]" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Tiêu đề mục lớn (H2)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 3 }) ? "bg-sky-100 text-[#0284c7]" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Tiêu đề mục vừa (H3)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              editor.isActive("heading", { level: 4 }) ? "bg-sky-100 text-[#0284c7]" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Tiêu đề mục nhỏ (H4)"
          >
            <Heading4 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NHÓM 2: ĐỊNH DẠNG CHỮ B/I/U/S */}
        <div className="flex items-center gap-0.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("bold") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="In đậm (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("italic") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("underline") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Gạch chân (Ctrl+U)"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("strike") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Gạch ngang chữ"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NHÓM 3: MÀU CHỮ & BÚT DẠ QUANG */}
        <div className="flex items-center gap-0.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          {/* Màu Đỏ Cảnh Báo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setColor("#dc2626").run()}
            className="w-5 h-5 rounded-md bg-red-600 border border-red-700 hover:scale-110 transition-transform"
            title="Màu đỏ cảnh báo"
          />
          {/* Màu Xanh Học Đường */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setColor("#1e3a8a").run()}
            className="w-5 h-5 rounded-md bg-blue-900 border border-blue-950 hover:scale-110 transition-transform"
            title="Màu xanh học đường"
          />
          {/* Màu Xanh Lá An Toàn */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setColor("#0f766e").run()}
            className="w-5 h-5 rounded-md bg-teal-700 border border-teal-800 hover:scale-110 transition-transform"
            title="Màu xanh bảo vệ"
          />
          {/* Bút dạ quang vàng */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
            className={`p-1 rounded-md text-amber-600 transition-colors ${
              editor.isActive("highlight") ? "bg-amber-200" : "hover:bg-slate-100"
            }`}
            title="Đánh dấu bút dạ quang vàng"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NHÓM 4: DANH SÁCH & CĂN LỀ */}
        <div className="flex items-center gap-0.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("bulletList") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Gạch đầu dòng (Bullet list)"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("orderedList") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Đánh số thứ tự (1, 2, 3)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Căn trái"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Căn giữa"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive({ textAlign: "justify" }) ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Căn đều hai bên"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NHÓM 5: KHỐI NỔI BẬT & HỘP CẢNH BÁO */}
        <div className="flex items-center gap-0.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("blockquote") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Trích dẫn / Lời hịch"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleInsertWarningBox}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
            title="Chèn hộp cảnh báo khẩn đỏ"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleInsertSafetyBox}
            className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
            title="Chèn hộp kế sách thoát hiểm xanh"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Đường kẻ ngang phân cách"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NHÓM 6: LIÊN KẾT & HÌNH ẢNH */}
        <div className="flex items-center gap-0.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={handleSetLink}
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("link") ? "bg-sky-100 text-[#0284c7]" : "text-slate-700 hover:bg-slate-100"
            }`}
            title="Chèn link liên kết"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
              title="Gỡ link liên kết"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleInsertImage()}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="Chèn ảnh từ link ngoài"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          {thumbnailToInsert && (
            <button
              type="button"
              onClick={() => handleInsertImage(thumbnailToInsert)}
              className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
              title="Chèn ngay ảnh WebP vừa nén phía trên vào bài"
            >
              <span>🖼️ Chèn ảnh WebP</span>
            </button>
          )}
        </div>

        {/* NHÓM 7: MẪU BÀI VIẾT CHUẨN & HOÀN TÁC */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleInsertTemplate}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:brightness-105 active:scale-95 transition-all"
            title="Chèn cấu trúc bài viết tuyên truyền chuẩn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mẫu bài chuẩn</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            title="Hoàn tác (Undo)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            title="Làm lại (Redo)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title="Xóa mọi định dạng (Clear formatting)"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* THANH CHUYỂN CHẾ ĐỘ XEM (SOẠN THẢO / XEM TRƯỚC / MÃ HTML) */}
      <div className="bg-slate-100/70 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === "visual" ? "bg-white text-[#0284c7] shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Soạn thảo trực quan</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === "preview" ? "bg-white text-[#0284c7] shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước học sinh thấy</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("code")}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              viewMode === "code" ? "bg-white text-[#0284c7] shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mã HTML</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          {editor.storage.characterCount?.words?.() || editor.getText().split(/\s+/).filter(Boolean).length} từ • {editor.getText().length} ký tự
        </span>
      </div>

      {/* KHUNG NỘI DUNG CHÍNH */}
      {viewMode === "visual" && (
        <div className="bg-white min-h-[300px] cursor-text" onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} />
        </div>
      )}

      {viewMode === "preview" && (
        <div className="bg-slate-50/50 p-6 min-h-[300px]">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 mb-3">
              BẢN XEM TRƯỚC BÀI BÁO
            </span>
            <div
              className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() || "<p class='text-slate-400 italic'>Chưa có nội dung soạn thảo...</p>" }}
            />
          </div>
        </div>
      )}

      {viewMode === "code" && (
        <div className="p-3 bg-slate-900 min-h-[300px]">
          <textarea
            value={editor.getHTML()}
            onChange={(e) => editor.commands.setContent(e.target.value)}
            className="w-full h-72 bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-y leading-relaxed"
            placeholder="Mã HTML bài viết..."
          />
        </div>
      )}

    </div>
  );
}
